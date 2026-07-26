"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Store, Trash2, Truck, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatarPreco, formatarQuantidade } from "@/lib/format";
import type { ProdutoVitrine } from "@/lib/vitrine";
import { linkWhatsapp, montarMensagemPedido } from "@/lib/whatsapp";
import { passoDaUnidade, useCarrinho } from "./carrinho-contexto";
import { salvarUltimoPedido } from "./ultimo-pedido";

export function CarrinhoPainel({
  nomeLoja,
  whatsapp,
  enderecoLoja,
  avisoEntrega,
  produtos,
}: {
  nomeLoja: string;
  whatsapp: string;
  enderecoLoja: string;
  avisoEntrega: string | null;
  produtos: ProdutoVitrine[];
}) {
  const {
    itens,
    subtotalCentavos,
    taxaCentavos,
    totalCentavos,
    entrega,
    modalidade,
    definirModalidade,
    enderecoEntrega,
    definirEnderecoEntrega,
    faltaParaMinimoCentavos,
    podeFechar,
    impedimento,
    definirQuantidade,
    remover,
    limpar,
    painelAberto,
    fecharPainel,
  } = useCarrinho();

  const [clienteNome, setClienteNome] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [confirmandoLimpeza, setConfirmandoLimpeza] = useState(false);

  const porId = new Map(produtos.map((produto) => [produto.id, produto]));

  const mensagem = montarMensagemPedido({
    nomeLoja,
    itens: itens.map((x) => ({
      nome: x.nome,
      quantidade: x.quantidade,
      unidade: x.unidade,
      precoUnitarioCentavos: x.precoUnitarioCentavos,
      composicao: porId.get(x.produtoId)?.composicao ?? null,
    })),
    subtotalCentavos,
    taxaCentavos,
    totalCentavos,
    modalidade,
    enderecoLoja,
    enderecoEntrega,
    clienteNome,
    observacoes,
  });

  const link = linkWhatsapp(whatsapp, mensagem);

  // Só faz sentido avisar sobre peso se algo for vendido por quilo.
  const temItemPorPeso = itens.some((x) => x.unidade === "kg");

  /**
   * Registra o pedido sem atrasar a ida para o WhatsApp: o <a> navega na hora
   * e o `keepalive` deixa a requisição terminar mesmo com a página saindo.
   * Se o registro falhar, o cliente ainda consegue pedir — o que importa.
   */
  const aoFechar = () => {
    // Guarda no aparelho para o atalho "repetir último pedido".
    salvarUltimoPedido(itens.map((x) => ({ produtoId: x.produtoId, quantidade: x.quantidade })));

    try {
      void fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          itens: itens.map((x) => ({
            produtoId: x.produtoId,
            quantidade: x.quantidade,
          })),
          modalidade,
          enderecoEntrega: modalidade === "entrega" ? enderecoEntrega.trim() : null,
          clienteNome: clienteNome.trim() || null,
          observacoes: observacoes.trim() || null,
        }),
      }).catch(() => {});
    } catch {
      // Registro é acessório: nunca pode impedir o pedido de sair.
    }
  };

  const textoImpedimento =
    impedimento === "minimo"
      ? `Faltam ${formatarPreco(faltaParaMinimoCentavos)} para o mínimo de entrega${
          entrega.minimoCentavos ? ` de ${formatarPreco(entrega.minimoCentavos)}` : ""
        }.`
      : impedimento;

  return (
    <AnimatePresence>
      {painelAberto && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={fecharPainel}
            className="fixed inset-0 z-[60] bg-carvao-950/75 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Seu pedido"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[92dvh] flex-col rounded-t-3xl border-t border-carvao-700 bg-carvao-900 sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[420px] sm:rounded-none sm:rounded-l-3xl sm:border-l sm:border-t-0"
          >
            <header className="flex items-center justify-between border-b border-carvao-800 px-5 py-4">
              <div>
                <h2 className="text-xl font-semibold">Seu pedido</h2>
                <p className="text-[12px] text-creme-muted">
                  {itens.length === 1
                    ? "1 item selecionado"
                    : `${itens.length} itens selecionados`}
                </p>
              </div>
              <button
                type="button"
                onClick={fecharPainel}
                aria-label="Fechar pedido"
                className="grid h-9 w-9 place-items-center rounded-lg text-creme-muted transition hover:bg-carvao-800 hover:text-creme"
              >
                <X size={19} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {itens.length === 0 ? (
                <p className="py-10 text-center text-sm text-creme-muted">
                  Seu pedido está vazio. Escolha um corte para começar.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {itens.map((item) => {
                    const passo = passoDaUnidade(item.unidade);
                    const composicao = porId.get(item.produtoId)?.composicao;
                    return (
                      <li
                        key={item.produtoId}
                        className="flex items-center gap-3 rounded-xl border border-carvao-800 bg-carvao-850 p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-creme">{item.nome}</p>
                          {composicao && (
                            <p className="line-clamp-2 text-[11px] leading-snug text-ambar-400/80">
                              {composicao}
                            </p>
                          )}
                          <p className="text-[12px] text-creme-muted">
                            {formatarPreco(item.precoUnitarioCentavos)} / {item.unidade}
                          </p>
                          <p className="mt-1 text-[13px] font-semibold text-ambar-400 tabular-nums">
                            {formatarPreco(
                              Math.round(item.precoUnitarioCentavos * item.quantidade),
                            )}
                          </p>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1 rounded-lg bg-carvao-800 p-1">
                            <button
                              type="button"
                              onClick={() => definirQuantidade(item.produtoId, item.quantidade - passo)}
                              aria-label={`Diminuir ${item.nome}`}
                              className="grid h-7 w-7 place-items-center rounded text-creme transition hover:bg-carvao-700"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-14 text-center text-[12px] font-semibold tabular-nums">
                              {formatarQuantidade(item.quantidade, item.unidade)}
                            </span>
                            <button
                              type="button"
                              onClick={() => definirQuantidade(item.produtoId, item.quantidade + passo)}
                              aria-label={`Aumentar ${item.nome}`}
                              className="grid h-7 w-7 place-items-center rounded bg-brasa-600 text-white transition hover:bg-brasa-500"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remover(item.produtoId)}
                            className="flex items-center gap-1 text-[11px] text-creme-muted transition hover:text-erro"
                          >
                            <Trash2 size={12} /> remover
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {itens.length > 0 && (
                <div className="mt-5 flex flex-col gap-3">
                  {/* Como recebe: só aparece escolha quando a loja faz entrega. */}
                  {entrega.ativa ? (
                    <fieldset className="flex flex-col gap-2">
                      <legend className="mb-1 text-[12px] font-semibold text-creme-muted">
                        Como você prefere receber?
                      </legend>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            { valor: "retirada", rotulo: "Retirar na loja", icone: Store },
                            { valor: "entrega", rotulo: "Receber em casa", icone: Truck },
                          ] as const
                        ).map((opcao) => (
                          <button
                            key={opcao.valor}
                            type="button"
                            onClick={() => definirModalidade(opcao.valor)}
                            aria-pressed={modalidade === opcao.valor}
                            className={cn(
                              "flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-[12.5px] font-semibold transition",
                              modalidade === opcao.valor
                                ? "border-ambar-500 bg-ambar-500/10 text-creme"
                                : "border-carvao-700 bg-carvao-850 text-creme-muted hover:border-carvao-500",
                            )}
                          >
                            <opcao.icone size={17} />
                            {opcao.rotulo}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  ) : (
                    <div className="flex items-start gap-2.5 rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 py-3">
                      <Store size={16} className="mt-0.5 shrink-0 text-ambar-400" />
                      <p className="text-[12.5px] leading-snug text-creme-muted">
                        <span className="block font-semibold text-creme">
                          Retirada no local
                        </span>
                        {enderecoLoja}
                      </p>
                    </div>
                  )}

                  {entrega.ativa && modalidade === "entrega" && (
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-semibold text-creme-muted">
                        Endereço da entrega
                      </span>
                      <textarea
                        value={enderecoEntrega}
                        onChange={(evento) => definirEnderecoEntrega(evento.target.value)}
                        rows={2}
                        maxLength={240}
                        placeholder="Rua, número, complemento e bairro"
                        className="resize-none rounded-xl border border-carvao-700 bg-carvao-850 px-3 py-2.5 text-sm text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none"
                      />
                    </label>
                  )}

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-creme-muted">
                      Seu nome (opcional)
                    </span>
                    <input
                      value={clienteNome}
                      onChange={(evento) => setClienteNome(evento.target.value)}
                      maxLength={80}
                      placeholder="Para agilizar o atendimento"
                      className="h-11 rounded-xl border border-carvao-700 bg-carvao-850 px-3 text-sm text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-creme-muted">
                      Observações (opcional)
                    </span>
                    <textarea
                      value={observacoes}
                      onChange={(evento) => setObservacoes(evento.target.value)}
                      maxLength={400}
                      rows={3}
                      placeholder="Ex: picanha fatiada, separar até as 18h..."
                      className="resize-none rounded-xl border border-carvao-700 bg-carvao-850 px-3 py-2.5 text-sm text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none"
                    />
                  </label>

                  {confirmandoLimpeza ? (
                    <div className="flex items-center justify-between rounded-xl border border-erro/40 bg-erro/10 px-3 py-2.5">
                      <span className="text-[12px] text-creme">Apagar todo o pedido?</span>
                      <span className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmandoLimpeza(false)}
                          className="rounded-lg px-2.5 py-1 text-[12px] text-creme-muted hover:text-creme"
                        >
                          Não
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            limpar();
                            setConfirmandoLimpeza(false);
                          }}
                          className="rounded-lg bg-erro px-2.5 py-1 text-[12px] font-semibold text-white"
                        >
                          Apagar
                        </button>
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmandoLimpeza(true)}
                      className="self-start text-[12px] text-creme-muted underline-offset-2 hover:text-erro hover:underline"
                    >
                      Limpar pedido
                    </button>
                  )}
                </div>
              )}
            </div>

            {itens.length > 0 && (
              <footer
                className="border-t border-carvao-800 bg-carvao-900 px-5 pt-4"
                style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
              >
                {taxaCentavos > 0 && (
                  <div className="mb-1.5 flex flex-col gap-0.5 text-[12.5px] text-creme-muted">
                    <span className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="tabular-nums">{formatarPreco(subtotalCentavos)}</span>
                    </span>
                    <span className="flex justify-between">
                      <span>Taxa de entrega</span>
                      <span className="tabular-nums">{formatarPreco(taxaCentavos)}</span>
                    </span>
                  </div>
                )}

                <div className="mb-1 flex items-end justify-between">
                  <span className="text-sm text-creme-muted">Total estimado</span>
                  <span className="font-display text-2xl font-semibold text-ambar-400 tabular-nums">
                    {formatarPreco(totalCentavos)}
                  </span>
                </div>

                <p className="mb-3 text-[11px] leading-snug text-creme-muted">
                  {temItemPorPeso && "O valor final depende do peso exato das peças. "}
                  {entrega.ativa && modalidade === "entrega" && avisoEntrega
                    ? avisoEntrega
                    : ""}
                </p>

                {podeFechar ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={aoFechar}
                    className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-sucesso py-4 text-[15px] font-bold text-white transition hover:brightness-110 active:scale-[0.99]"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                      <path d="M17.47 14.38c-.3-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.29-.76.95-.93 1.15-.17.2-.34.22-.63.08-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5h-.57c-.2 0-.5.07-.77.37-.26.3-1 .98-1 2.4s1.03 2.78 1.17 2.98c.15.2 2.02 3.08 4.9 4.32.68.3 1.22.47 1.63.6.69.22 1.31.19 1.8.11.55-.08 1.74-.71 1.98-1.4.25-.68.25-1.27.17-1.4-.07-.13-.26-.2-.56-.35Z" />
                      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.13c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.09.81.83-3.01-.2-.31a8.16 8.16 0 0 1-1.25-4.36c0-4.55 3.7-8.25 8.26-8.25 2.2 0 4.28.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.84c0 4.55-3.7 8.2-8.25 8.2Z" />
                    </svg>
                    Enviar pedido no WhatsApp
                  </a>
                ) : (
                  <div>
                    <button
                      type="button"
                      disabled
                      className="flex h-13 w-full cursor-not-allowed items-center justify-center rounded-xl bg-carvao-800 py-4 text-[15px] font-bold text-creme-muted"
                    >
                      Enviar pedido no WhatsApp
                    </button>
                    {textoImpedimento && (
                      <p role="status" className="mt-2 text-center text-[12px] text-alerta">
                        {textoImpedimento}
                      </p>
                    )}
                  </div>
                )}
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
