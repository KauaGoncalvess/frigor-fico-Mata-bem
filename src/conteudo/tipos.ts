/**
 * Todo dado do site carrega a sua própria procedência.
 *
 * O site apresenta uma empresa sob inspeção federal. Publicar número que ninguém
 * conferiu é pior do que não publicar. Então nada entra "solto": ou o dono
 * confirmou, ou o valor viaja marcado como pendente e a página avisa.
 */
export type Dado<T> = {
  valor: T;
  /** De onde veio, quando não veio da empresa. Ex.: "FIEMG", "SEMAD/MG". */
  fonte?: string;
  confirmado: boolean;
};

/** Dado levantado em pesquisa pública. Aparece com etiqueta até o dono validar. */
export function aConfirmar<T>(valor: T, fonte?: string): Dado<T> {
  return { valor, fonte, confirmado: false };
}

/** Dado que a empresa confirmou. Entra no ar sem ressalva. */
export function confirmado<T>(valor: T): Dado<T> {
  return { valor, confirmado: true };
}

export const estaConfirmado = (dado: Dado<unknown>) => dado.confirmado;
