import "server-only";
import { formatarPreco } from "@/lib/format";
import { somenteDigitos } from "@/lib/format";
import { ofertaAtiva } from "@/lib/produto";
import { urlDescadastro, urlDoSite } from "@/lib/url";
import {
  flagLigada,
  type ContatoDestino,
  type Mensagem,
  type MessageChannel,
  type ResultadoEnvio,
} from "./tipos";

/**
 * Canal EM STAND-BY — implementado, desligado por flag.
 *
 * A Evolution API roda em cima do WhatsApp Web, ou seja, não é oficial. Disparo
 * de oferta em massa por esse caminho tem risco real de banimento do número,
 * e o número da loja é o canal de venda: perder ele é perder o negócio.
 *
 * O código fica pronto justamente para que a decisão de ligar seja de negócio
 * (número secundário, volume baixo, risco assumido por escrito) e não de
 * engenharia. Ligar = definir CANAL_EVOLUTION_ATIVO=true + as credenciais.
 */
export class CanalEvolution implements MessageChannel {
  readonly id = "evolution";
  readonly rotulo = "WhatsApp (Evolution API — não oficial)";

  private base(): string | null {
    return process.env.EVOLUTION_API_URL?.trim().replace(/\/$/, "") || null;
  }
  private chave(): string | null {
    return process.env.EVOLUTION_API_KEY?.trim() || null;
  }
  private instancia(): string | null {
    return process.env.EVOLUTION_INSTANCIA?.trim() || null;
  }

  ativo(): boolean {
    return (
      flagLigada("CANAL_EVOLUTION_ATIVO", false) &&
      Boolean(this.base() && this.chave() && this.instancia())
    );
  }

  motivoInativo(): string | null {
    if (!flagLigada("CANAL_EVOLUTION_ATIVO", false)) {
      return "Desligado de propósito: API não oficial, com risco de banimento do número em disparo em massa.";
    }
    if (!this.base() || !this.chave() || !this.instancia()) {
      return "Faltam EVOLUTION_API_URL, EVOLUTION_API_KEY ou EVOLUTION_INSTANCIA.";
    }
    return null;
  }

  private textoDaMensagem(contato: ContatoDestino, mensagem: Mensagem): string {
    const itens = mensagem.produtos
      .map((p) => {
        const preco = ofertaAtiva(p)
          ? `${formatarPreco(p.precoPromoCentavos!)} (de ${formatarPreco(p.precoCentavos)})`
          : formatarPreco(p.precoCentavos);
        return `• *${p.nome}* — ${preco} / ${p.unidade}`;
      })
      .join("\n");

    return [
      `Olá, ${contato.nome}!`,
      "",
      mensagem.corpo,
      itens ? `\n${itens}` : "",
      "",
      `Peça aqui: ${urlDoSite()}`,
      `Para não receber mais: ${urlDescadastro(contato.tokenDescadastro)}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  async enviar(contato: ContatoDestino, mensagem: Mensagem): Promise<ResultadoEnvio> {
    const motivo = this.motivoInativo();
    if (motivo) return { ok: false, erro: motivo };

    const telefone = somenteDigitos(contato.telefone ?? "");
    if (!telefone) return { ok: false, erro: "Contato sem telefone." };

    try {
      const resposta = await fetch(
        `${this.base()}/message/sendText/${encodeURIComponent(this.instancia()!)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: this.chave()!,
          },
          body: JSON.stringify({
            number: telefone,
            text: this.textoDaMensagem(contato, mensagem),
          }),
        },
      );

      if (!resposta.ok) {
        return { ok: false, erro: `Evolution respondeu ${resposta.status}.` };
      }
      const dados = (await resposta.json().catch(() => ({}))) as { key?: { id?: string } };
      return { ok: true, idExterno: dados?.key?.id };
    } catch (erro) {
      return {
        ok: false,
        erro: erro instanceof Error ? erro.message : "Falha ao falar com a Evolution API.",
      };
    }
  }
}
