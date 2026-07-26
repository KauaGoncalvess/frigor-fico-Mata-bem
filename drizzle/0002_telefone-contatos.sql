ALTER TABLE "contatos" ADD COLUMN "telefone" text;--> statement-breakpoint
ALTER TABLE "contatos" ADD COLUMN "consentimento_whatsapp" boolean DEFAULT false NOT NULL;