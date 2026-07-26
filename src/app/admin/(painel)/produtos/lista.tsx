"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { ROTULO_CATEGORIA, type Categoria, type Produto } from "@/lib/db/schema";
import { formatarData, formatarPreco } from "@/lib/format";
import { avisosDoProduto, ofertaAtiva } from "@/lib/produto";
import type { RespostaAcao } from "@/lib/admin/guarda";
import { acaoEmMassa, apagarProduto } from "./acoes";

const INICIAL: RespostaAcao = { ok: false, mensagem: "" };

export function ListaProdutos({ produtos }: { produtos: Produto[] }) {
  const [estado, acao, pendente] = useActionState(acaoEmMassa, INICIAL);
  const [marcados, setMarcados] = useState<number[]>([]);
  const [confirmando, setConfirmando] = useState<number | null>(null);

  const alternar = (id: number) => {
    setMarcados((atuais) =>
      atuais.includes(id) ? atuais.filter((x) => x !== id) : [...atuais, id],
    );
  };

  const todosMarcados = produtos.length > 0 && marcados.length === produtos.length;

  return (
    <form action={acao}>
      {/* Barra de ação em massa — só aparece quando há algo marcado */}
      {marcados.length > 0 && (
        <div className="sticky top-2 z-20 mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-ambar-500/40 bg-carvao-850 px-4 py-3 shadow-lift">
          <span className="text-[13px] font-semibold text-creme">
            {marcados.length} marcado(s)
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <button
              type="submit"
              name="operacao"
              value="disponibilizar"
              disabled={pendente}
              className="rounded-lg border border-carvao-600 px-3 py-2 text-[12.5px] font-semibold text-creme transition hover:border-sucesso/60 hover:text-sucesso disabled:opacity-50"
            >
              Marcar disponível
            </button>
            <button
              type="submit"
              name="operacao"
              value="indisponibilizar"
              disabled={pendente}
              className="rounded-lg border border-carvao-600 px-3 py-2 text-[12.5px] font-semibold text-creme transition hover:border-alerta/60 hover:text-alerta disabled:opacity-50"
            >
              Marcar indisponível
            </button>
            <button
              type="submit"
              name="operacao"
              value="encerrar_oferta"
              disabled={pendente}
              className="rounded-lg border border-carvao-600 px-3 py-2 text-[12.5px] font-semibold text-creme transition hover:border-brasa-500 hover:text-brasa-400 disabled:opacity-50"
            >
              Encerrar oferta
            </button>
          </div>
        </div>
      )}

      {estado.mensagem && (
        <p
          className={cn(
            "mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-[13px]",
            estado.ok
              ? "border border-sucesso/40 bg-sucesso/10 text-creme"
              : "border border-erro/40 bg-erro/10 text-creme",
          )}
        >
          {estado.ok ? (
            <CheckCircle2 size={16} className="text-sucesso" />
          ) : (
            <AlertTriangle size={16} className="text-erro" />
          )}
          {estado.mensagem}
        </p>
      )}

      <div className="overflow-hidden rounded-card border border-carvao-800">
        <div className="flex items-center gap-3 border-b border-carvao-800 bg-carvao-900 px-4 py-2.5">
          <input
            type="checkbox"
            checked={todosMarcados}
            onChange={(evento) =>
              setMarcados(evento.target.checked ? produtos.map((x) => x.id) : [])
            }
            aria-label="Marcar todos"
            className="h-4 w-4 accent-ambar-500"
          />
          <span className="text-[12px] font-semibold uppercase tracking-wider text-creme-muted">
            {produtos.length} produto(s)
          </span>
        </div>

        <ul className="divide-y divide-carvao-800">
          {produtos.map((produto) => {
            const avisos = avisosDoProduto(produto);
            const promo = ofertaAtiva(produto);

            return (
              <li key={produto.id} className="bg-carvao-900/60">
                <div className="flex items-center gap-3 px-4 py-3">
                  <input
                    type="checkbox"
                    name="ids"
                    value={produto.id}
                    checked={marcados.includes(produto.id)}
                    onChange={() => alternar(produto.id)}
                    aria-label={`Marcar ${produto.nome}`}
                    className="h-4 w-4 shrink-0 accent-ambar-500"
                  />

                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-carvao-850">
                    {produto.imagemUrl ? (
                      <Image
                        src={produto.imagemUrl}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-[10px] text-creme-muted">
                        sem foto
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="truncate text-[14px] font-semibold text-creme">
                        {produto.nome}
                      </span>
                      {!produto.disponivel && (
                        <span className="rounded-full bg-carvao-800 px-2 py-0.5 text-[10px] font-semibold text-creme-muted">
                          indisponível
                        </span>
                      )}
                      {promo && (
                        <span className="rounded-full bg-brasa-600/20 px-2 py-0.5 text-[10px] font-semibold text-brasa-400">
                          em oferta
                        </span>
                      )}
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px] text-creme-muted">
                      <span>{ROTULO_CATEGORIA[produto.categoria as Categoria] ?? produto.categoria}</span>
                      <span>·</span>
                      <span className="font-semibold text-ambar-400">
                        {formatarPreco(promo ? produto.precoPromoCentavos! : produto.precoCentavos)}
                        /{produto.unidade}
                      </span>
                      {promo && produto.ofertaAte && (
                        <>
                          <span>·</span>
                          <span>até {formatarData(produto.ofertaAte)}</span>
                        </>
                      )}
                    </div>

                    {avisos.length > 0 && (
                      <p className="mt-1 flex items-center gap-1 text-[11.5px] text-alerta">
                        <AlertTriangle size={12} />
                        {avisos.join(" · ")}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      href={`/admin/produtos/${produto.id}`}
                      aria-label={`Editar ${produto.nome}`}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-carvao-700 text-creme-muted transition hover:border-ambar-500/60 hover:text-ambar-400"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmando(produto.id)}
                      aria-label={`Excluir ${produto.nome}`}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-carvao-700 text-creme-muted transition hover:border-erro/60 hover:text-erro"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Toda exclusão pede confirmação — não existe desfazer. */}
                {confirmando === produto.id && (
                  <div className="flex flex-wrap items-center gap-3 border-t border-erro/30 bg-erro/10 px-4 py-3">
                    <span className="text-[13px] text-creme">
                      Excluir <strong>{produto.nome}</strong> de vez? Isso não tem como
                      desfazer.
                    </span>
                    <span className="ml-auto flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmando(null)}
                        className="rounded-lg border border-carvao-600 px-3 py-1.5 text-[12.5px] font-semibold text-creme-muted hover:text-creme"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        formAction={apagarProduto}
                        name="id"
                        value={produto.id}
                        className="rounded-lg bg-erro px-3 py-1.5 text-[12.5px] font-bold text-white"
                      >
                        Excluir
                      </button>
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </form>
  );
}
