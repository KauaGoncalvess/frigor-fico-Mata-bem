CREATE TABLE "kit_itens" (
	"id" serial PRIMARY KEY NOT NULL,
	"kit_id" integer NOT NULL,
	"produto_id" integer NOT NULL,
	"quantidade" double precision NOT NULL
);
--> statement-breakpoint
ALTER TABLE "config_loja" ADD COLUMN "entrega_ativa" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "config_loja" ADD COLUMN "taxa_entrega_centavos" integer;--> statement-breakpoint
ALTER TABLE "config_loja" ADD COLUMN "pedido_minimo_centavos" integer;--> statement-breakpoint
ALTER TABLE "config_loja" ADD COLUMN "horarios" jsonb;--> statement-breakpoint
ALTER TABLE "pedidos" ADD COLUMN "subtotal_centavos" integer;--> statement-breakpoint
ALTER TABLE "pedidos" ADD COLUMN "taxa_entrega_centavos" integer;--> statement-breakpoint
ALTER TABLE "pedidos" ADD COLUMN "modalidade" text DEFAULT 'retirada' NOT NULL;--> statement-breakpoint
ALTER TABLE "pedidos" ADD COLUMN "endereco_entrega" text;--> statement-breakpoint
ALTER TABLE "produtos" ADD COLUMN "tipo" text DEFAULT 'corte' NOT NULL;--> statement-breakpoint
CREATE INDEX "kit_itens_kit_idx" ON "kit_itens" USING btree ("kit_id");