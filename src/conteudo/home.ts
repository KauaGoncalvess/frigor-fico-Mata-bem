import { aConfirmar, type Dado } from "./tipos";

export const HERO = {
  kicker: "Sete Lagoas · Minas Gerais",
  titulo: "Da origem à mesa.",
  tituloDestaque: "Com qualidade em cada etapa.",
  lead:
    "Produzimos carne bovina e suína com controle, segurança e compromisso em " +
    "toda a cadeia.",
  cta: { rotulo: "Conheça o Mata Bem", href: "/frigorifico" },
} as const;

/**
 * A faixa de números.
 *
 * Regra do briefing, e é uma regra boa: número inventado não entra. Enquanto
 * nenhum estiver confirmado, a seção inteira não vai ao ar — é melhor não ter
 * a faixa do que ter cinco caixinhas com "a confirmar".
 */
export const NUMEROS: { valor: Dado<string>; unidade: string }[] = [
  { valor: aConfirmar("+20", "cadastro: fundação em 2004"), unidade: "anos de atuação" },
  { valor: aConfirmar("6.000", "FIEMG"), unidade: "m² de área construída" },
  { valor: aConfirmar("—"), unidade: "capacidade produtiva" },
  { valor: aConfirmar("—"), unidade: "colaboradores" },
  { valor: aConfirmar("—"), unidade: "mercados atendidos" },
];

export const INSTITUCIONAL = {
  numero: "01",
  rotulo: "O Mata Bem",
  titulo: "Mais do que produzir carne. Construímos confiança em cada etapa.",
  paragrafos: [
    "O Frigorífico Mata Bem atua na produção e comercialização de carne bovina e " +
      "suína, unindo experiência, controle de processos e compromisso com a qualidade.",
    "Da seleção da matéria-prima ao processamento e à distribuição, cada etapa é " +
      "conduzida com responsabilidade e atenção aos padrões de segurança e qualidade.",
  ],
  cta: { rotulo: "Conheça nossa história", href: "/frigorifico" },
} as const;

export const CTA_FINAL = {
  titulo: "Vamos conversar?",
  paragrafo:
    "Seja para comprar nossos produtos, estabelecer uma parceria ou conhecer melhor " +
    "nossa operação, nossa equipe está pronta para atender você.",
} as const;
