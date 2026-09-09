import { aConfirmar, type Dado } from "./tipos";

/**
 * Mercado.
 *
 * A pesquisa não encontrou nenhuma evidência de exportação. Forçar narrativa
 * internacional num site institucional é o tipo de coisa que um comprador
 * confere em cinco minutos — então aqui a história é a atuação regional, que
 * é verdadeira e, para quem compra em Minas, mais relevante.
 */
export const MERCADO = {
  titulo: "Atuação regional, com estrutura de indústria.",
  lead:
    "O Mata Bem atende casas de carnes, supermercados, distribuidores e indústrias " +
    "de Sete Lagoas e região.",
  regiao: aConfirmar(
    "Centro-Oeste e Central de Minas Gerais.",
    "perfis públicos da empresa",
  ),
  exporta: aConfirmar(false, "sem evidência pública de exportação"),
} as const;

export const PUBLICOS = [
  { titulo: "Casas de carnes", texto: "Cortes padronizados, com regularidade de entrega." },
  { titulo: "Supermercados", texto: "Volume e constância para abastecer gôndola." },
  { titulo: "Distribuidores", texto: "Resfriados e congelados para revenda." },
  { titulo: "Indústrias", texto: "Matéria-prima e subprodutos para processamento." },
] as const;

export const RELACIONAMENTO: { titulo: string; texto: string; cta: string; href: string }[] = [
  {
    titulo: "Sou produtor ou fornecedor",
    texto:
      "Trabalhamos com prestação de serviço de abate e com compra direta de " +
      "produtores da região.",
    cta: "Falar com a equipe",
    href: "/contato#fornecedores",
  },
  {
    titulo: "Quero comprar",
    texto:
      "Atendimento comercial para casas de carnes, supermercados, distribuidores " +
      "e indústrias.",
    cta: "Falar com o comercial",
    href: "/contato#comercial",
  },
];

export const TRABALHE_CONOSCO: { titulo: string; texto: string; vagas: Dado<string[]> } = {
  titulo: "Faça parte do Mata Bem",
  texto: "Pessoas são parte essencial de uma operação construída para crescer.",
  vagas: aConfirmar([]),
};
