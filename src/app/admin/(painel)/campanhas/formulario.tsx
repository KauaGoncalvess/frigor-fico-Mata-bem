"use client";

import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { Cartao } from "@/components/admin/ui";
import type { Produto } from "@/lib/db/schema";
import { formatarPreco } from "@/lib/format";
import { ofertaAtiva } from "@/lib/produto";
import type { RespostaAcao } from "@/lib/admin/guarda";
import { dispararCampanha } from "./acoes";

const INICIAL: RespostaAcao = { ok: false, mensagem: "" };

type Canal = {
  id: string;
  rotulo: string;
  requer: "email" | "telefone";
  ativo: boolean;
  motivo: string | null;
};

export function FormularioCampanha({
  produtos,
  canais,
  totalPorRequisito,
}: {
  produtos: Produto[];
  canais: Canal[];
  /** Quantos contatos cada tipo de canal alcança hoje. */
  totalPorRequisito: { email: number; telefone: number };
}) {
  const [estado, acao, pendente] = useActionState(dispararCampanha, INICIAL);
  const [confirmando, setConfirmando] = useState(false);

  const canaisAtivos = canais.filter((x) => x.ativo);
  const [canalId, setCanalId] = useState(canaisAtivos[0]?.id ?? "");
  const canalEscolhido = canaisAtivos.find((x) => x.id === canalId) ?? canaisAtivos[0];

  // O total muda com o canal: quem autorizou e-mail não autorizou WhatsApp.
  const totalContatos = canalEscolhido
    ? totalPorRequisito[canalEscolhido.requer]
    : 0;

  const podeEnviar = canaisAtivos.length > 0 && totalContatos > 0;

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
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-creme-muted">
            Canal de envio
          </span>
          <select
            name="canal"
            required
            value={canalId}
            onChange={(evento) => setCanalId(evento.target.value)}
            disabled={canaisAtivos.length === 0}
            className="h-12 w-full rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 text-sm text-creme focus:border-ambar-500 focus:outline-none disabled:opacity-60"
          >
            {canaisAtivos.length === 0 ? (
              <option value="">Nenhum canal ligado</option>
            ) : (
              canaisAtivos.map((canal) => (
                <option key={canal.id} value={canal.id}>
                  {canal.rotulo}
                </option>
              ))
            )}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-creme-muted">
            Assunto do e-mail *
          </span>
          <input
            name="assunto"
            required
            maxLength={140}
            placeholder="Ex: Picanha a R$ 74,90 só esta semana"
            className="h-12 w-full rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 text-sm text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-creme-muted">Mensagem *</span>
          <textarea
            name="conteudo"
            required
            rows={6}
            maxLength={4000}
            placeholder={
              "Escreva como você falaria no balcão.\n\nEx: Chegou picanha maturada nova e separamos um preço especial para quem é da lista."
            }
            className="w-full resize-none rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 py-3 text-sm leading-relaxed text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none"
          />
          <span className="text-[11.5px] text-creme-muted">
            O link de descadastro entra sozinho no rodapé — é obrigatório por lei.
          </span>
        </label>
      </Cartao>

      <Cartao className="flex flex-col gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-creme">
            Cortes para destacar no e-mail
          </h2>
          <p className="text-[12.5px] text-creme-muted">
            Marque os que devem aparecer com foto de preço na mensagem.
          </p>
        </div>

        {produtos.length === 0 ? (
          <p className="text-[13px] text-creme-muted">Nenhum produto disponível.</p>
        ) : (
          <div className="grid max-h-72 gap-1.5 overflow-y-auto sm:grid-cols-2">
            {produtos.map((produto) => {
              const promo = ofertaAtiva(produto);
              return (
                <label
                  key={produto.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-carvao-800 px-3 py-2.5 transition hover:border-carvao-600"
                >
                  <input
                    type="checkbox"
                    name="produtos"
                    value={produto.id}
                    defaultChecked={promo}
                    className="h-4 w-4 shrink-0 accent-brasa-500"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-creme">
                      {produto.nome}
                    </span>
                    <span className="block text-[11.5px] text-creme-muted">
                      {formatarPreco(
                        promo ? produto.precoPromoCentavos! : produto.precoCentavos,
                      )}
                      /{produto.unidade}
                      {promo && " · em oferta"}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </Cartao>

      {/* Disparo é irreversível: confirma antes. */}
      {confirmando ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-alerta/40 bg-alerta/10 px-4 py-3.5">
          <span className="text-[13px] text-creme">
            Enviar agora para <strong>{totalContatos} contato(s)</strong>? Não dá para
            cancelar depois.
          </span>
          <span className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="rounded-lg border border-carvao-600 px-3.5 py-2 text-[12.5px] font-semibold text-creme-muted hover:text-creme"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={pendente}
              className="flex items-center gap-2 rounded-lg bg-brasa-600 px-4 py-2 text-[12.5px] font-bold text-white transition hover:bg-brasa-500 disabled:opacity-60"
            >
              {pendente && <Loader2 size={14} className="animate-spin" />}
              {pendente ? "Enviando..." : "Confirmar envio"}
            </button>
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-creme-muted">
            {totalContatos === 0
              ? canalEscolhido?.requer === "telefone"
                ? "Ninguém autorizou receber no WhatsApp ainda."
                : "Nenhum contato ativo na lista ainda."
              : `Vai para ${totalContatos} contato(s) da lista.`}
          </p>
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            disabled={!podeEnviar}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brasa-600 px-7 text-[14px] font-bold text-white transition hover:bg-brasa-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
            Revisar e enviar
          </button>
        </div>
      )}
    </form>
  );
}
