import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** Categorias do catálogo. Mantidas como texto + validação no Zod para o dono
 *  poder crescer o catálogo sem migração de enum no banco. */
export const CATEGORIAS = ["bovino", "suino", "aves", "embutidos"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const ROTULO_CATEGORIA: Record<Categoria, string> = {
  bovino: "Bovino",
  suino: "Suíno",
  aves: "Aves",
  embutidos: "Embutidos",
};

export const adminUsers = pgTable(
  "admin_users",
  {
    id: serial("id").primaryKey(),
    nome: text("nome").notNull(),
    email: text("email").notNull(),
    senhaHash: text("senha_hash").notNull(),
    criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
    ultimoLogin: timestamp("ultimo_login", { withTimezone: true }),
  },
  (t) => [uniqueIndex("admin_users_email_idx").on(t.email)],
);

export const produtos = pgTable(
  "produtos",
  {
    id: serial("id").primaryKey(),
    nome: text("nome").notNull(),
    categoria: text("categoria").notNull(),
    /** Preço por kg em centavos — dinheiro nunca em float. */
    precoCentavos: integer("preco_centavos").notNull(),
    unidade: text("unidade").notNull().default("kg"),
    descricao: text("descricao"),
    imagemUrl: text("imagem_url"),
    imagemPublicId: text("imagem_public_id"),
    disponivel: boolean("disponivel").notNull().default(true),
    /** Oferta da semana */
    emOferta: boolean("em_oferta").notNull().default(false),
    precoPromoCentavos: integer("preco_promo_centavos"),
    ofertaAte: timestamp("oferta_ate", { withTimezone: true }),
    ordem: integer("ordem").notNull().default(0),
    criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
    atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("produtos_categoria_idx").on(t.categoria)],
);

export const contatos = pgTable(
  "contatos",
  {
    id: serial("id").primaryKey(),
    nome: text("nome").notNull(),
    email: text("email").notNull(),
    /** LGPD: consentimento explícito, com data e origem registradas. */
    consentimento: boolean("consentimento").notNull().default(false),
    consentimentoEm: timestamp("consentimento_em", { withTimezone: true }),
    origem: text("origem").notNull().default("site"),
    tokenDescadastro: text("token_descadastro").notNull(),
    descadastradoEm: timestamp("descadastrado_em", { withTimezone: true }),
    criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("contatos_email_idx").on(t.email),
    uniqueIndex("contatos_token_idx").on(t.tokenDescadastro),
  ],
);

export type ItemPedido = {
  produtoId: number;
  nome: string;
  quantidade: number;
  unidade: string;
  precoUnitarioCentavos: number;
  subtotalCentavos: number;
};

export const pedidos = pgTable("pedidos", {
  id: serial("id").primaryKey(),
  itens: jsonb("itens").$type<ItemPedido[]>().notNull(),
  totalCentavos: integer("total_centavos").notNull(),
  clienteNome: text("cliente_nome"),
  observacoes: text("observacoes"),
  canal: text("canal").notNull().default("whatsapp"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const configLoja = pgTable("config_loja", {
  id: integer("id").primaryKey().default(1),
  nome: text("nome").notNull(),
  whatsapp: text("whatsapp").notNull(),
  endereco: text("endereco").notNull(),
  horario: text("horario").notNull(),
  telefone: text("telefone"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  mapsUrl: text("maps_url"),
  entregaTexto: text("entrega_texto"),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const campanhas = pgTable("campanhas", {
  id: serial("id").primaryKey(),
  assunto: text("assunto").notNull(),
  conteudo: text("conteudo").notNull(),
  produtosIds: jsonb("produtos_ids").$type<number[]>().notNull().default([]),
  canal: text("canal").notNull().default("email"),
  status: text("status").notNull().default("rascunho"),
  totalEnviados: integer("total_enviados").notNull().default(0),
  totalFalhas: integer("total_falhas").notNull().default(0),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
  enviadoEm: timestamp("enviado_em", { withTimezone: true }),
});

export const envios = pgTable(
  "envios",
  {
    id: serial("id").primaryKey(),
    campanhaId: integer("campanha_id").notNull(),
    contatoId: integer("contato_id").notNull(),
    canal: text("canal").notNull(),
    status: text("status").notNull(),
    erro: text("erro"),
    criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("envios_campanha_idx").on(t.campanhaId)],
);

/** Rate limiting persistido: sobrevive ao cold start de função serverless,
 *  onde um contador em memória seria zerado a cada instância nova. */
export const rateLimits = pgTable("rate_limits", {
  chave: text("chave").primaryKey(),
  contagem: integer("contagem").notNull().default(0),
  janelaInicio: timestamp("janela_inicio", { withTimezone: true }).defaultNow().notNull(),
});

export type Produto = typeof produtos.$inferSelect;
export type NovoProduto = typeof produtos.$inferInsert;
export type Contato = typeof contatos.$inferSelect;
export type ConfigLoja = typeof configLoja.$inferSelect;
export type Campanha = typeof campanhas.$inferSelect;
export type Pedido = typeof pedidos.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
