import "server-only";
import { CanalEmail } from "./email";
import { CanalEvolution } from "./evolution";
import { CanalWhatsappCloud } from "./whatsapp-cloud";
import type { MessageChannel } from "./tipos";

/**
 * Registro de canais. Acrescentar um canal novo é acrescentar uma linha aqui —
 * a tela de campanhas e o disparo não mudam.
 */
const REGISTRO: MessageChannel[] = [
  new CanalEmail(),
  new CanalEvolution(),
  new CanalWhatsappCloud(),
];

export function todosOsCanais(): MessageChannel[] {
  return REGISTRO;
}

export function canaisAtivos(): MessageChannel[] {
  return REGISTRO.filter((canal) => canal.ativo());
}

export function obterCanal(id: string): MessageChannel | null {
  return REGISTRO.find((canal) => canal.id === id) ?? null;
}

/** Situação de cada canal, para o painel mostrar o que está ligado e por quê. */
export function situacaoDosCanais() {
  return REGISTRO.map((canal) => ({
    id: canal.id,
    rotulo: canal.rotulo,
    ativo: canal.ativo(),
    motivo: canal.motivoInativo(),
  }));
}

export type { MessageChannel } from "./tipos";
export type { ContatoDestino, Mensagem, ResultadoEnvio, Template } from "./tipos";
