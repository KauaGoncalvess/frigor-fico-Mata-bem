"use client";

import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Store, Truck } from "lucide-react";
import { Cartao } from "@/components/admin/ui";
import type { ConfigLoja } from "@/lib/db/schema";
import { formatarTelefone } from "@/lib/format";
import { NOMES_DIA, normalizarHorarios } from "@/lib/horario";
import type { RespostaAcao } from "@/lib/admin/guarda";
import { salvarDadosDaLoja } from "./acoes";

const INICIAL: RespostaAcao = { ok: false, mensagem: "" };

const rotulo = "text-[12.5px] font-semibold text-creme-muted";
const campo =
  "h-12 w-full rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 text-sm text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none";

function reais(centavos: number | null): string {
  if (centavos == null) return "";
  return (centavos / 100).toFixed(2).replace(".", ",");
}

export function FormularioLoja({ config }: { config: ConfigLoja }) {
  const [estado, acao, pendente] = useActionState(salvarDadosDaLoja, INICIAL);
  const [entregaAtiva, setEntregaAtiva] = useState(config.entregaAtiva);

  const semana = normalizarHorarios(config.horarios);
  const [fechados, setFechados] = useState<boolean[]>(
    semana.map((dia) => dia.fechado),
  );

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
          <span className={rotulo}>Link do Google Maps (opcional)</span>
          <input
            name="mapsUrl"
            type="url"
            defaultValue={config.mapsUrl ?? ""}
            placeholder="https://maps.google.com/..."
            className={campo}
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className={rotulo}>Horário de funcionamento *</span>
          <p className="-mt-1 text-[11.5px] text-creme-muted">
            É isto que liga o selo &ldquo;aberto agora&rdquo; na loja e informa o horário ao
            Google.
          </p>

          <div className="mt-1 flex flex-col gap-1.5">
            {semana.map((dia, indice) => (
              <div
                key={dia.dia}
                className="flex items-center gap-2 rounded-lg border border-carvao-700 bg-carvao-850 px-3 py-2"
              >
                <span className="w-20 shrink-0 text-[12.5px] font-semibold capitalize text-creme">
                  {NOMES_DIA[dia.dia]}
                </span>

                <label className="flex shrink-0 items-center gap-1.5 text-[11.5px] text-creme-muted">
                  <input
                    type="checkbox"
                    name={`fechado_${dia.dia}`}
                    checked={fechados[indice]}
                    onChange={(evento) =>
                      setFechados((atuais) =>
                        atuais.map((v, i) => (i === indice ? evento.target.checked : v)),
                      )
                    }
                    className="h-3.5 w-3.5 accent-erro"
                  />
                  fechado
                </label>

                <span className="ml-auto flex items-center gap-1.5">
                  <input
                    type="time"
                    name={`abre_${dia.dia}`}
                    defaultValue={dia.abre}
                    disabled={fechados[indice]}
                    aria-label={`Abre ${NOMES_DIA[dia.dia]}`}
                    className="h-9 rounded-lg border border-carvao-700 bg-carvao-900 px-2 text-[12.5px] text-creme focus:border-ambar-500 focus:outline-none disabled:opacity-40"
                  />
                  <span className="text-[12px] text-creme-muted">às</span>
                  <input
                    type="time"
                    name={`fecha_${dia.dia}`}
                    defaultValue={dia.fecha}
                    disabled={fechados[indice]}
                    aria-label={`Fecha ${NOMES_DIA[dia.dia]}`}
                    className="h-9 rounded-lg border border-carvao-700 bg-carvao-900 px-2 text-[12.5px] text-creme focus:border-ambar-500 focus:outline-none disabled:opacity-40"
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

      </Cartao>

      <Cartao className="flex flex-col gap-4">
        <h2 className="text-[15px] font-semibold text-creme">Como o cliente recebe</h2>

        <div className="flex items-start gap-2.5 rounded-xl border border-carvao-700 bg-carvao-850 px-4 py-3">
          <Store size={17} className="mt-0.5 shrink-0 text-ambar-400" />
          <p className="text-[12.5px] leading-snug text-creme-muted">
            <span className="block font-semibold text-creme">
              Retirada no local — sempre ativa
            </span>
            O cliente monta o pedido e busca no balcão, no endereço acima.
          </p>
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-carvao-700 bg-carvao-850 px-4 py-3">
          <input
            type="checkbox"
            name="entregaAtiva"
            checked={entregaAtiva}
            onChange={(evento) => setEntregaAtiva(evento.target.checked)}
            className="mt-0.5 h-4 w-4 accent-sucesso"
          />
          <span className="text-[13px]">
            <span className="flex items-center gap-1.5 font-semibold text-creme">
              <Truck size={15} />
              Também fazemos entrega
            </span>
            <span className="block text-creme-muted">
              Só marque quando a entrega existir de verdade. Enquanto estiver desmarcado, o
              site não promete entrega em nenhum lugar — prometer o que a loja não faz
              queima a confiança na primeira compra.
            </span>
          </span>
        </label>

        {entregaAtiva && (
          <div className="flex flex-col gap-4 border-t border-carvao-700 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={rotulo}>Taxa de entrega</span>
                <span className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-creme-muted">
                    R$
                  </span>
                  <input
                    name="taxaEntrega"
                    inputMode="decimal"
                    defaultValue={reais(config.taxaEntregaCentavos)}
                    placeholder="8,00"
                    className={`${campo} pl-10`}
                  />
                </span>
                <span className="text-[11px] text-creme-muted">
                  Deixe vazio para entrega sem taxa.
                </span>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={rotulo}>Pedido mínimo para entregar</span>
                <span className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-creme-muted">
                    R$
                  </span>
                  <input
                    name="pedidoMinimo"
                    inputMode="decimal"
                    defaultValue={reais(config.pedidoMinimoCentavos)}
                    placeholder="60,00"
                    className={`${campo} pl-10`}
                  />
                </span>
                <span className="text-[11px] text-creme-muted">
                  O carrinho avisa quanto falta para o cliente bater esse valor.
                </span>
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={rotulo}>Aviso de entrega (opcional)</span>
              <input
                name="entregaTexto"
                defaultValue={config.entregaTexto ?? ""}
                placeholder="Entrega em até 2h na região central."
                className={campo}
              />
              <span className="text-[11.5px] text-creme-muted">
                Aparece junto do total, só quando o cliente escolhe entrega.
              </span>
            </label>
          </div>
        )}
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
