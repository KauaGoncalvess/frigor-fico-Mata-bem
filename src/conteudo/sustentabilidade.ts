import { aConfirmar, type Dado } from "./tipos";

/**
 * Sustentabilidade sem folha verde e sem promessa vaga.
 *
 * Nenhuma prática específica desta unidade foi confirmada. O que existe de
 * público é o licenciamento ambiental — e é só isso que a página afirma. Os
 * cards ficam como estrutura, aguardando o que a empresa realmente faz.
 */
export const PRATICAS: { emoji: string; titulo: string; texto: Dado<string> }[] = [
  {
    emoji: "🌱",
    titulo: "Uso responsável dos recursos",
    texto: aConfirmar("Práticas a descrever pela empresa."),
  },
  {
    emoji: "💧",
    titulo: "Gestão da água",
    texto: aConfirmar("Práticas a descrever pela empresa."),
  },
  {
    emoji: "♻️",
    titulo: "Gestão de resíduos",
    texto: aConfirmar("Práticas a descrever pela empresa."),
  },
  {
    emoji: "🐂",
    titulo: "Bem-estar animal",
    texto: aConfirmar("Práticas a descrever pela empresa."),
  },
  {
    emoji: "🌎",
    titulo: "Responsabilidade na cadeia",
    texto: aConfirmar("Práticas a descrever pela empresa."),
  },
];

export const SUSTENTABILIDADE = {
  titulo: "Produzir hoje. Pensar no amanhã.",
  lead:
    "Operar um frigorífico é lidar com água, resíduo e energia todos os dias. " +
    "O que segue é o que a unidade mantém sob licença e controle.",
  licenca: aConfirmar(
    "Licenciamento ambiental LAC 2 — LIC + LO, classe 5, deferido em 26/05/2023, " +
      "com certificado válido até 22/02/2031.",
    "SEMAD/MG",
  ),
} as const;
