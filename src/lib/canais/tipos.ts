import type { Produto } from "@/lib/db/schema";

/** Destinatário genérico — cada canal usa o campo que lhe serve. */
export type ContatoDestino = {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  tokenDescadastro: string;
};

export type Mensagem = {
  assunto: string;
  /** Texto escrito pelo dono, em linguagem simples (sem HTML). */
  corpo: string;
  produtos: Produto[];
};

/**
 * Template nomeado. O e-mail monta o HTML localmente; a Cloud API exige
 * template aprovado pela Meta, e é aqui que o nome dele viaja.
 */
export type Template = {
  nome: string;
  idioma?: string;
  parametros?: Record<string, string>;
};

export type ResultadoEnvio = {
  ok: boolean;
  idExterno?: string;
  erro?: string;
};

/**
 * Contrato único de comunicação com o cliente final.
 *
 * A campanha não sabe (nem deve saber) qual canal está ligado: ela pede
 * `enviar` e segue. Trocar e-mail por WhatsApp oficial no futuro é acrescentar
 * uma implementação e virar uma flag, sem tocar na tela de campanhas.
 */
export interface MessageChannel {
  readonly id: string;
  readonly rotulo: string;

  /** Ligado por flag E com credenciais presentes. As duas coisas. */
  ativo(): boolean;

  /** Por que está desligado — texto mostrado ao dono no painel. */
  motivoInativo(): string | null;

  enviar(
    contato: ContatoDestino,
    mensagem: Mensagem,
    template?: Template,
  ): Promise<ResultadoEnvio>;
}

export function flagLigada(nome: string, padrao = false): boolean {
  const valor = process.env[nome];
  if (valor == null || valor.trim() === "") return padrao;
  return ["1", "true", "sim", "on"].includes(valor.trim().toLowerCase());
}
