import { EMPRESA } from "./empresa";

/**
 * O menu é curto de propósito. O visitante precisa chegar em
 * Produtos → Qualidade → Contato em poucos segundos.
 */
export const MENU = [
  { rotulo: "Início", href: "/" },
  { rotulo: "O Frigorífico", href: "/frigorifico" },
  { rotulo: "Produtos", href: "/produtos" },
  { rotulo: "Qualidade", href: "/qualidade" },
  { rotulo: "Sustentabilidade", href: "/sustentabilidade" },
  { rotulo: "Mercado", href: "/mercado" },
  { rotulo: "Contato", href: "/contato" },
] as const;

export const CTA_COMERCIAL = {
  rotulo: "Fale com nosso comercial",
  href: "/contato#comercial",
} as const;

/**
 * WhatsApp do comercial. Enquanto o dono não passar o número, o botão do
 * celular cai no telefone fixo — melhor ligar do que abrir conversa com
 * número errado.
 */
export const WHATSAPP = {
  numero: null as string | null,
  href: EMPRESA.telefoneLink,
} as const;

export const RODAPE = [
  {
    titulo: "Institucional",
    links: [
      { rotulo: "O Mata Bem", href: "/frigorifico" },
      { rotulo: "Nossa estrutura", href: "/frigorifico#estrutura" },
      { rotulo: "Qualidade", href: "/qualidade" },
      { rotulo: "Sustentabilidade", href: "/sustentabilidade" },
    ],
  },
  {
    titulo: "Produtos",
    links: [
      { rotulo: "Cortes bovinos", href: "/produtos#cortes" },
      { rotulo: "Resfriados", href: "/produtos#resfriados" },
      { rotulo: "Congelados", href: "/produtos#congelados" },
      { rotulo: "Mercado", href: "/mercado" },
    ],
  },
  {
    titulo: "Relacionamento",
    links: [
      { rotulo: "Comercial", href: "/contato#comercial" },
      { rotulo: "Fornecedores", href: "/contato#fornecedores" },
      { rotulo: "Trabalhe conosco", href: "/contato#trabalhe-conosco" },
    ],
  },
] as const;
