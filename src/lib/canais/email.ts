import "server-only";
import { Resend } from "resend";
import { obterConfig } from "@/lib/repo/config";
import { urlDescadastro, urlDoSite } from "@/lib/url";
import { montarEmailHtml, montarEmailTexto } from "./template-email";
import {
  flagLigada,
  type ContatoDestino,
  type Mensagem,
  type MessageChannel,
  type ResultadoEnvio,
} from "./tipos";

/**
 * Canal ATIVO do MVP.
 *
 * E-mail transacional: custo baixo, sem risco de bloqueio de conta e suficiente
 * para começar a construir a base de contatos.
 */
export class CanalEmail implements MessageChannel {
  readonly id = "email";
  readonly rotulo = "E-mail";
  readonly requer = "email" as const;

  private cliente: Resend | null = null;

  private chave(): string | null {
    return process.env.RESEND_API_KEY?.trim() || null;
  }

  private remetente(): string {
    return process.env.EMAIL_REMETENTE?.trim() || "";
  }

  ativo(): boolean {
    return flagLigada("CANAL_EMAIL_ATIVO", true) && Boolean(this.chave() && this.remetente());
  }

  motivoInativo(): string | null {
    if (!flagLigada("CANAL_EMAIL_ATIVO", true)) {
      return "Canal desligado pela configuração (CANAL_EMAIL_ATIVO).";
    }
    if (!this.chave()) return "Falta a chave do Resend (RESEND_API_KEY).";
    if (!this.remetente()) {
      return "Falta o remetente verificado (EMAIL_REMETENTE), ex: Loja <ofertas@sualoja.com.br>.";
    }
    return null;
  }

  async enviar(contato: ContatoDestino, mensagem: Mensagem): Promise<ResultadoEnvio> {
    const motivo = this.motivoInativo();
    if (motivo) return { ok: false, erro: motivo };

    if (!this.cliente) this.cliente = new Resend(this.chave()!);

    const config = await obterConfig();
    const dados = {
      nomeContato: contato.nome,
      assunto: mensagem.assunto,
      corpo: mensagem.corpo,
      produtos: mensagem.produtos,
      nomeLoja: config.nome,
      urlLoja: urlDoSite(),
      urlDescadastro: urlDescadastro(contato.tokenDescadastro),
      whatsapp: config.whatsapp,
    };

    try {
      const resposta = await this.cliente.emails.send({
        from: this.remetente(),
        to: contato.email,
        subject: mensagem.assunto,
        html: montarEmailHtml(dados),
        text: montarEmailTexto(dados),
        headers: {
          // Descadastro nativo no cliente de e-mail: reduz marcação de spam.
          // Sem "List-Unsubscribe-Post" de propósito — o one-click do RFC 8058
          // exige que a MESMA URL aceite POST, e /descadastro é uma página GET.
          // Anunciar o que não existe faria o provedor receber 405 e desconfiar.
          "List-Unsubscribe": `<${urlDescadastro(contato.tokenDescadastro)}>`,
        },
      });

      if (resposta.error) {
        return { ok: false, erro: resposta.error.message };
      }
      return { ok: true, idExterno: resposta.data?.id };
    } catch (erro) {
      return {
        ok: false,
        erro: erro instanceof Error ? erro.message : "Falha desconhecida no envio.",
      };
    }
  }
}
