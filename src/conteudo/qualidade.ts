import { aConfirmar, type Dado } from "./tipos";

/**
 * Qualidade não é uma etapa: é parte de todo o processo.
 *
 * Os quatro pilares descrevem prática, não prometem selo. Certificação é outra
 * coisa e vive na lista abaixo, onde cada uma precisa de confirmação.
 */
export const PILARES = [
  {
    titulo: "Segurança dos alimentos",
    texto: "Processos voltados ao controle e à segurança dos produtos.",
  },
  {
    titulo: "Rastreabilidade",
    texto: "Controle da origem e acompanhamento da cadeia produtiva.",
  },
  {
    titulo: "Controle de qualidade",
    texto: "Monitoramento dos processos e dos padrões internos.",
  },
  {
    titulo: "Bem-estar animal",
    texto: "Práticas responsáveis nas etapas sob responsabilidade da operação.",
  },
] as const;

export type Certificacao = {
  sigla: string;
  nome: string;
  detalhe: Dado<string>;
};

/**
 * Certificações.
 *
 * O número do SIF está em disputa: o briefing trazia 4127, a pesquisa pública
 * aponta 585 para este frigorífico. Enquanto o dono não resolver, a página
 * afirma só a existência da inspeção, sem o número.
 */
export const CERTIFICACOES: Certificacao[] = [
  {
    sigla: "SIF",
    nome: "Serviço de Inspeção Federal",
    detalhe: aConfirmar(
      "Inspeção Federal permanente na unidade. Número do registro pendente de confirmação.",
      "FIEMG / DIPOA",
    ),
  },
  {
    sigla: "DIPOA",
    nome: "Departamento de Inspeção de Produtos de Origem Animal",
    detalhe: aConfirmar("Registro no DIPOA.", "FIEMG"),
  },
  {
    sigla: "Wagyu",
    nome: "Protocolo de carne Wagyu certificada",
    detalhe: aConfirmar(
      "Unidade credenciada ao protocolo, conforme a relação de frigoríficos da CNA.",
      "CNA / ABCBRW",
    ),
  },
  {
    sigla: "Ambiental",
    nome: "Licenciamento ambiental",
    detalhe: aConfirmar(
      "LAC 2 — LIC + LO, classe 5, deferido em 26/05/2023. Certificado válido até 22/02/2031.",
      "SEMAD/MG",
    ),
  },
];

export const WAGYU = {
  rotulo: "Wagyu",
  tituloAntes: "O primeiro de Minas a certificar ",
  tituloDestaque: "Wagyu",
  paragrafo:
    "Segundo a FIEMG, o Frigorífico Mata Bem foi a primeira empresa a possuir " +
    "certificação pela Associação Brasileira dos Criadores de Bovinos da Raça " +
    "Wagyu em Minas Gerais.",
  nota: aConfirmar(
    "A relação de frigoríficos credenciados ao protocolo de carne Wagyu certificada " +
      "registra a unidade de Sete Lagoas/MG.",
    "CNA",
  ),
} as const;

/** Blocos de foto da seção Estrutura. Aguardam ensaio na própria unidade. */
export const ESTRUTURA = {
  titulo: "Uma estrutura preparada para produzir com eficiência.",
  fotos: [
    { arquivo: "estrutura-planta", legenda: "Planta industrial" },
    { arquivo: "estrutura-linha", legenda: "Linha de produção" },
    { arquivo: "estrutura-camaras", legenda: "Câmaras frias" },
    { arquivo: "estrutura-expedicao", legenda: "Expedição" },
    { arquivo: "estrutura-controle", legenda: "Controle de qualidade" },
    { arquivo: "estrutura-equipe", legenda: "Equipe" },
  ],
} as const;
