import { aConfirmar, type Dado } from "./tipos";

/**
 * Catálogo.
 *
 * A pesquisa pública confirma abate de bovinos e suínos, industrialização e
 * preparação de subprodutos — mas não o que de fato é comercializado, em que
 * formato, nem para quem. Por isso toda linha está `aConfirmar`: a estrutura
 * existe, o dono marca o que vende e o que sai.
 */
export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  disponivel: Dado<boolean>;
};

export const PRODUTOS: Produto[] = [
  {
    id: "cortes",
    nome: "Cortes bovinos",
    descricao:
      "Cortes padronizados para casas de carnes, supermercados e distribuidores.",
    disponivel: aConfirmar(true, "CNAE 1011-2/01 — abate de bovinos"),
  },
  {
    id: "suinos",
    nome: "Cortes suínos",
    descricao: "Linha própria para animais de médio porte, no mesmo processo.",
    disponivel: aConfirmar(true, "razão social — abate de suínos"),
  },
  {
    id: "resfriados",
    nome: "Carne resfriada",
    descricao: "Produto mantido sob refrigeração, para giro rápido no varejo.",
    disponivel: aConfirmar(true),
  },
  {
    id: "congelados",
    nome: "Carne congelada",
    descricao: "Produto congelado, para estoque e distribuição a distância.",
    disponivel: aConfirmar(true),
  },
  {
    id: "miudos",
    nome: "Miúdos",
    descricao: "Vísceras e miudezas comestíveis preparadas na própria unidade.",
    disponivel: aConfirmar(true),
  },
  {
    id: "subprodutos",
    nome: "Subprodutos",
    descricao:
      "Preparação de subprodutos do abate, comestíveis e não comestíveis.",
    disponivel: aConfirmar(true, "atividade registrada"),
  },
];

export const PRODUTOS_TEXTO = {
  titulo: "Nossos produtos",
  subtitulo: "Qualidade e padronização para diferentes necessidades do mercado.",
} as const;

/** Os dois modelos de contrato — isto a pesquisa confirma. */
export const MODELOS = [
  {
    titulo: "Prestação de serviço de abate",
    texto: "Para quem traz o próprio animal e quer a estrutura da unidade.",
  },
  {
    titulo: "Comercialização por demanda própria",
    texto: "Compramos, processamos e vendemos. O processo é o mesmo; muda o contrato.",
  },
] as const;
