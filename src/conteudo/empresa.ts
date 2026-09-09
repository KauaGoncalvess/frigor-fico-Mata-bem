/**
 * Fonte única de todo o conteúdo da página.
 *
 * ATENÇÃO: os dados regulatórios e cadastrais vieram de pesquisa em fontes
 * públicas (SEMAD/MG, FIEMG, relação CNA do protocolo Wagyu), não da empresa.
 * Cada evidência carrega `confirmado`. Nada com `confirmado: false` deveria ir
 * ao ar sem o dono validar — para uma empresa sob inspeção federal, um número
 * errado no site é pior do que número nenhum.
 */

export const EMPRESA = {
  nome: "Mata Bem",
  razaoSocial: "Frigorífico Mata Bem Comércio e Abate de Suínos e Bovinos LTDA",
  cnpj: "07.015.638/0001-45",
  local: "Sete Lagoas · Minas Gerais · Brasil",
  telefone: "(31) 2106-3355",
  telefoneLink: "tel:+553121063355",
  email: "frigorificomatabem@terra.com.br",
  endereco: {
    linha1: "Av. Padre Tarcizo Gonçalves, 4300",
    linha2: "Cidade de Deus · Sete Lagoas — MG",
    logradouro: "Avenida Padre Tarcizo Gonçalves, 4300",
    bairro: "Cidade de Deus",
    cidade: "Sete Lagoas",
    uf: "MG",
    cep: "35703-387",
  },
  atendemos: "Casas de carnes, supermercados, distribuidores e indústrias",
} as const;

export const ABERTURA = {
  kicker: EMPRESA.local,
  titulo: "Mata Bem",
  lead:
    "Um frigorífico construído sobre uma ideia simples: quem trabalha com carne " +
    "precisa de estrutura, controle e alguém que responda pelo processo.",
} as const;

export const ORIGEM = {
  numero: "01",
  rotulo: "A origem",
  titulo: "Tudo começa antes do portão da fábrica.",
  paragrafos: [
    "Bovinos e suínos chegam de produtores da cidade e da região. A partir da recepção, " +
      "cada animal entra em um processo documentado e acompanhado por Inspeção Federal permanente.",
    "É esse encadeamento — origem, abate, processamento, expedição — que permite atender " +
      "casas de carnes, supermercados, distribuidores e indústrias com previsibilidade.",
  ],
  legenda: "Fig. 01 — Rebanho de fornecedores regionais",
} as const;

export const PLANTA = {
  numero: "02",
  rotulo: "A planta",
  titulo: "Seis mil metros quadrados sob um só registro.",
  numeros: [
    {
      valor: "6.000",
      unidade: "m² de área construída",
      nota: "Unidade única, conforme apresentação institucional da FIEMG.",
    },
    {
      valor: "2",
      unidade: "espécies processadas",
      nota: "Bovinos e suínos, com linhas próprias para animais de grande e de médio porte.",
    },
    {
      valor: "SIF",
      unidade: "4127 · inspeção permanente",
      nota: "Registro no DIPOA, com Serviço de Inspeção Federal presente na unidade.",
    },
    {
      valor: "2004",
      unidade: "ano de fundação",
      nota: "Duas décadas de operação contínua em abate e processamento.",
    },
  ],
} as const;

export const OFICIO = {
  numero: "03",
  rotulo: "O ofício",
  citacao:
    "Do animal ao produto acabado — abate, industrialização e preparação de " +
    "subprodutos na mesma unidade.",
  paragrafo:
    "Trabalhamos em dois modelos: prestação de serviço de abate para quem traz o próprio " +
    "animal, e comercialização por demanda própria. O processo é o mesmo; muda apenas o contrato.",
  legenda: "Fig. 03 — Do abate ao corte",
} as const;

export const WAGYU = {
  numero: "04",
  rotulo: "Wagyu",
  tituloAntes: "O primeiro de Minas a certificar ",
  tituloDestaque: "Wagyu",
  paragrafo:
    "Segundo a FIEMG, o Frigorífico Mata Bem foi a primeira empresa a possuir certificação " +
    "pela Associação Brasileira dos Criadores de Bovinos da Raça Wagyu em Minas Gerais.",
  nota:
    "A relação de 2025 de frigoríficos credenciados ao protocolo de carne Wagyu certificada " +
    "registra SIF 4127 — Sete Lagoas/MG.",
  galeria: [
    { alt: "Bovinos em pastagem" },
    { alt: "Rebanho ao pôr do sol" },
    { alt: "Suínos" },
  ],
} as const;

export const RIGOR = {
  numero: "05",
  rotulo: "O rigor",
  titulo: "O que pode ser comprovado.",
} as const;

/** Cada linha da tabela de evidências da seção 05. */
export const EVIDENCIAS = [
  {
    rotulo: "Registro sanitário",
    valor: "SIF 4127 — inspeção federal permanente",
    fonte: "FIEMG / DIPOA",
    confirmado: false,
  },
  {
    rotulo: "Órgão",
    valor: "DIPOA — Departamento de Inspeção de Produtos de Origem Animal",
    fonte: "FIEMG",
    confirmado: false,
  },
  {
    rotulo: "Licenciamento ambiental",
    valor: "LAC 2 — LIC + LO, classe 5 · deferido em 26/05/2023",
    fonte: "SEMAD/MG",
    confirmado: false,
  },
  {
    rotulo: "Certificado ambiental",
    valor: "Válido até 22/02/2031",
    fonte: "SEMAD/MG",
    confirmado: false,
  },
] as const;

export const CONTATO = {
  numero: "06",
  rotulo: "Contato",
  tituloAntes: "Fale com nossa ",
  tituloDestaque: "equipe",
} as const;
