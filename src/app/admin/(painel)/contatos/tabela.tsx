"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Cartao } from "@/components/admin/ui";
import type { Contato } from "@/lib/db/schema";
import { formatarData, formatarTelefone } from "@/lib/format";
import { apagarContato } from "./acoes";

export function TabelaContatos({ contatos }: { contatos: Contato[] }) {
  const [confirmando, setConfirmando] = useState<number | null>(null);

  return (
    <Cartao className="overflow-x-auto p-0">
      <table className="w-full min-w-[680px] text-left text-[13.5px]">
        <thead>
          <tr className="border-b border-carvao-800 text-[11.5px] uppercase tracking-wider text-creme-muted">
            <th className="px-5 py-3 font-semibold">Nome</th>
            <th className="px-5 py-3 font-semibold">E-mail</th>
            <th className="px-5 py-3 font-semibold">WhatsApp</th>
            <th className="px-5 py-3 font-semibold">Cadastro</th>
            <th className="px-5 py-3 font-semibold">Situação</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-carvao-800">
          {contatos.map((contato) => (
            <tr key={contato.id}>
              <td className="px-5 py-3 font-medium text-creme">{contato.nome}</td>
              <td className="px-5 py-3 text-creme-muted">{contato.email}</td>
              <td className="px-5 py-3">
                {contato.consentimentoWhatsapp && contato.telefone ? (
                  <span className="text-creme-muted">
                    {formatarTelefone(contato.telefone)}
                  </span>
                ) : (
                  <span className="text-[12px] text-creme-muted/60">
                    não autorizou
                  </span>
                )}
              </td>
              <td className="px-5 py-3 text-creme-muted">
                {formatarData(contato.criadoEm)}
              </td>
              <td className="px-5 py-3">
                {contato.descadastradoEm ? (
                  <span className="rounded-full bg-carvao-800 px-2.5 py-0.5 text-[11px] font-semibold text-creme-muted">
                    saiu da lista
                  </span>
                ) : (
                  <span className="rounded-full bg-sucesso/15 px-2.5 py-0.5 text-[11px] font-semibold text-sucesso">
                    recebe ofertas
                  </span>
                )}
              </td>
              <td className="px-5 py-3 text-right">
                {confirmando === contato.id ? (
                  <form action={apagarContato} className="flex items-center justify-end gap-2">
                    <input type="hidden" name="id" value={contato.id} />
                    <span className="text-[11.5px] text-creme-muted">Apagar de vez?</span>
                    <button
                      type="button"
                      onClick={() => setConfirmando(null)}
                      className="rounded-lg border border-carvao-600 px-2.5 py-1 text-[11.5px] font-semibold text-creme-muted hover:text-creme"
                    >
                      Não
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-erro px-2.5 py-1 text-[11.5px] font-bold text-white"
                    >
                      Apagar
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmando(contato.id)}
                    aria-label={`Apagar ${contato.nome}`}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-carvao-700 text-creme-muted transition hover:border-erro/60 hover:text-erro"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Cartao>
  );
}
