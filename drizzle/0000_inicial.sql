CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha_hash" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"ultimo_login" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "campanhas" (
	"id" serial PRIMARY KEY NOT NULL,
	"assunto" text NOT NULL,
	"conteudo" text NOT NULL,
	"produtos_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"canal" text DEFAULT 'email' NOT NULL,
	"status" text DEFAULT 'rascunho' NOT NULL,
	"total_enviados" integer DEFAULT 0 NOT NULL,
	"total_falhas" integer DEFAULT 0 NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"enviado_em" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "config_loja" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"nome" text NOT NULL,
	"whatsapp" text NOT NULL,
	"endereco" text NOT NULL,
	"horario" text NOT NULL,
	"telefone" text,
	"instagram" text,
	"facebook" text,
	"maps_url" text,
	"entrega_texto" text,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contatos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"consentimento" boolean DEFAULT false NOT NULL,
	"consentimento_em" timestamp with time zone,
	"origem" text DEFAULT 'site' NOT NULL,
	"token_descadastro" text NOT NULL,
	"descadastrado_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "envios" (
	"id" serial PRIMARY KEY NOT NULL,
	"campanha_id" integer NOT NULL,
	"contato_id" integer NOT NULL,
	"canal" text NOT NULL,
	"status" text NOT NULL,
	"erro" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pedidos" (
	"id" serial PRIMARY KEY NOT NULL,
	"itens" jsonb NOT NULL,
	"total_centavos" integer NOT NULL,
	"cliente_nome" text,
	"observacoes" text,
	"canal" text DEFAULT 'whatsapp' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "produtos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"categoria" text NOT NULL,
	"preco_centavos" integer NOT NULL,
	"unidade" text DEFAULT 'kg' NOT NULL,
	"descricao" text,
	"imagem_url" text,
	"imagem_public_id" text,
	"disponivel" boolean DEFAULT true NOT NULL,
	"em_oferta" boolean DEFAULT false NOT NULL,
	"preco_promo_centavos" integer,
	"oferta_ate" timestamp with time zone,
	"ordem" integer DEFAULT 0 NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"chave" text PRIMARY KEY NOT NULL,
	"contagem" integer DEFAULT 0 NOT NULL,
	"janela_inicio" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_email_idx" ON "admin_users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "contatos_email_idx" ON "contatos" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "contatos_token_idx" ON "contatos" USING btree ("token_descadastro");--> statement-breakpoint
CREATE INDEX "envios_campanha_idx" ON "envios" USING btree ("campanha_id");--> statement-breakpoint
CREATE INDEX "produtos_categoria_idx" ON "produtos" USING btree ("categoria");