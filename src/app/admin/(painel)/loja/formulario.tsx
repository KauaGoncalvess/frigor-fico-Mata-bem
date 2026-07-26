"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Cartao } from "@/components/admin/ui";
import type { ConfigLoja } from "@/lib/db/schema";
import { formatarTelefone } from "@/lib/format";
import type { RespostaAcao } from "@/lib/admin/guarda";
import { salvarDadosDaLoja } from "./acoes";

const INICIAL: RespostaAcao = { ok: false, mensagem: "" };

const rotulo = "text-[12.5px] font-semibold text-creme-muted";
const campo =
  "h-12 w-full rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 text-sm text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none";

export function FormularioLoja({ config }: { config: ConfigLoja }) {
  const [estado, acao, pendente] = useActionState(salvarDadosDaLoja, INICIAL);

  return (
    <form action={acao} className="flex max-w-2xl flex-col gap-5">
      {estado.mensagem && (
        <p
          role="alert"
          className={`flex items-start gap-2 rounded-xl px-4 py-3 text-[13px] ${
            estado.ok
              ? "border border-sucesso/40 bg-sucesso/10 text-creme"
              : "border border-erro/40 bg-erro/10 text-creme"
          }`}
        >
          {estado.ok ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-sucesso" />
          ) : (
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-erro" />
          )}
          {estado.mensagem}
        </p>
      )}

      <Cartao className="flex flex-col gap-4">
        <h2 className="text-[15px] font-semibold text-creme">Identificação</h2>

        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>Nome da loja *</span>
          <input name="nome" required defaultValue={config.nome} className={campo} />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>WhatsApp que recebe os pedidos *</span>
          <input
            name="whatsapp"
            required
            inputMode="tel"
            defaultValue={formatarTelefone(config.whatsapp)}
            placeholder="(11) 99999-9999"
            className={campo}
          />
          <span className="text-[11.5px] text-creme-muted">
            É para este número que todo pedido do site vai. Pode digitar com parênteses e
            traço que a gente ajusta.
          </span>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>Telefone fixo (opcional)</span>
          <input
            name="telefone"
            defaultValue={config.telefone ?? ""}
            placeholder="(11) 3333-3333"
            className={campo}
          />
        </label>
      </Cartao>

      <Cartao className="flex flex-col gap-4">
        <h2 className="text-[15px] font-semibold text-creme">Onde e quando</h2>

        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>Endereço *</span>
          <input
            name="endereco"
            required
            defaultValue={config.endereco}
            placeholder="Av. das Carnes, 1200 — Centro"
            className={campo}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>Horário de funcionamento *</span>
          <input
            name="horario"
            required
            defaultValue={config.horario}
            placeholder="Segunda a sábado, 8h às 19h"
            className={campo}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>Link do Google Maps (opcional)</span>
          <input
            name="mapsUrl"
            type="url"
            defaultValue={config.mapsUrl ?? ""}
            placeholder="https://maps.google.com/..."
            className={campo}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>Aviso de entrega (opcional)</span>
          <input
            name="entregaTexto"
            defaultValue={config.entregaTexto ?? ""}
            placeholder="Entrega em até 2h na região. Pedido mínimo de R$ 60."
            className={campo}
          />
          <span className="text-[11.5px] text-creme-muted">
            Aparece na hora de fechar o pedido, junto do total.
          </span>
        </label>
      </Cartao>

      <Cartao className="flex flex-col gap-4">
        <h2 className="text-[15px] font-semibold text-creme">Redes sociais</h2>

        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>Instagram (opcional)</span>
          <input
            name="instagram"
            type="url"
            defaultValue={config.instagram ?? ""}
            placeholder="https://instagram.com/sualoja"
            className={campo}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>Facebook (opcional)</span>
          <input
            name="facebook"
            type="url"
            defaultValue={config.facebook ?? ""}
            placeholder="https://facebook.com/sualoja"
            className={campo}
          />
        </label>
      </Cartao>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pendente}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brasa-600 px-8 text-[14px] font-bold text-white transition hover:bg-brasa-500 active:scale-[0.99] disabled:opacity-60"
        >
          {pendente && <Loader2 size={16} className="animate-spin" />}
          {pendente ? "Salvando..." : "Salvar dados da loja"}
        </button>
      </div>
    </form>
  );
}
