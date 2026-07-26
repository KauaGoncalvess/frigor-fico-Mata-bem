import "server-only";
import { somenteDigitos } from "@/lib/format";
import {
  flagLigada,
  type ContatoDestino,
  type Mensagem,
  type MessageChannel,
  type ResultadoEnvio,
  type Template,
} from "./tipos";

/**
 * Canal EM STAND-BY — arquitetura pronta para plugar.
 *
 * É o caminho recomendado quando a recorrência por WhatsApp virar prioridade:
 * oficial da Meta, sem risco de banimento, com template aprovado e custo por
 * conversa. Em troca exige conta Meta Business verificada e, na prática, um BSP.
 *
 * Fora da janela de 24h de atendimento, a Meta só entrega mensagem de template
 * aprovado — por isso `enviar` exige um template e não aceita texto livre.
 */
export class CanalWhatsappCloud implements MessageChannel {
  readonly id = "whatsapp_cloud";
  readonly rotulo = "WhatsApp Cloud API (oficial Meta)";

  private token(): string | null {
    return process.env.WHATSAPP_CLOUD_TOKEN?.trim() || null;
  }
  private idNumero(): string | null {
    return process.env.WHATSAPP_CLOUD_PHONE_ID?.trim() || null;
  }
  private versao(): string {
    return process.env.WHATSAPP_CLOUD_VERSAO?.trim() || "v21.0";
  }

  ativo(): boolean {
    return (
      flagLigada("CANAL_WHATSAPP_CLOUD_ATIVO", false) &&
      Boolean(this.token() && this.idNumero())
    );
  }

  motivoInativo(): string | null {
    if (!flagLigada("CANAL_WHATSAPP_CLOUD_ATIVO", false)) {
      return "Aguardando decisão comercial: exige conta Meta Business verificada e tem custo por conversa.";
    }
    if (!this.token() || !this.idNumero()) {
      return "Faltam WHATSAPP_CLOUD_TOKEN ou WHATSAPP_CLOUD_PHONE_ID.";
    }
    return null;
  }

  async enviar(
    contato: ContatoDestino,
    mensagem: Mensagem,
    template?: Template,
  ): Promise<ResultadoEnvio> {
    const motivo = this.motivoInativo();
    if (motivo) return { ok: false, erro: motivo };

    const telefone = somenteDigitos(contato.telefone ?? "");
    if (!telefone) return { ok: false, erro: "Contato sem telefone." };

    if (!template?.nome) {
      return {
        ok: false,
        erro: "A Cloud API exige um template aprovado pela Meta para envio ativo.",
      };
    }

    const parametros = [
      contato.nome,
      mensagem.assunto,
      ...Object.values(template.parametros ?? {}),
    ].map((texto) => ({ type: "text", text: String(texto) }));

    try {
      const resposta = await fetch(
        `https://graph.facebook.com/${this.versao()}/${this.idNumero()}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token()}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: telefone,
            type: "template",
            template: {
              name: template.nome,
              language: { code: template.idioma ?? "pt_BR" },
              components: [{ type: "body", parameters: parametros }],
            },
          }),
        },
      );

      const dados = (await resposta.json().catch(() => ({}))) as {
        messages?: { id?: string }[];
        error?: { message?: string };
      };

      if (!resposta.ok) {
        return {
          ok: false,
          erro: dados?.error?.message ?? `Cloud API respondeu ${resposta.status}.`,
        };
      }
      return { ok: true, idExterno: dados?.messages?.[0]?.id };
    } catch (erro) {
      return {
        ok: false,
        erro: erro instanceof Error ? erro.message : "Falha ao falar com a Cloud API.",
      };
    }
  }
}
