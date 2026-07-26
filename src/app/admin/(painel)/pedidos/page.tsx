import { MapPin, Store, Truck } from "lucide-react";
import { CabecalhoPagina, Cartao, VazioEstado } from "@/components/admin/ui";
import { exigirSessao } from "@/lib/admin/guarda";
import { formatarDataHora, formatarPreco, formatarQuantidade } from "@/lib/format";
import { listarPedidos } from "@/lib/repo/pedidos";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pedidos" };

export default async function PaginaPedidos() {
  await exigirSessao();
  const pedidos = await listarPedidos(100);

  const total = pedidos.reduce((soma, x) => soma + x.totalCentavos, 0);

  return (
    <>
      <CabecalhoPagina
        titulo="Pedidos"
        descricao="Tudo que saiu do site para o WhatsApp. Serve para conferir o que o cliente pediu antes de separar."
      />

      {pedidos.length === 0 ? (
        <VazioEstado
          titulo="Nenhum pedido registrado"
          texto="Quando um cliente enviar o pedido pelo site, ele aparece aqui com os itens e o total."
        />
      ) : (
        <>
          <p className="mb-4 text-[13.5px] text-creme-muted">
            <strong className="text-creme">{pedidos.length}</strong> pedido(s) ·{" "}
            {formatarPreco(total)} estimados no período
          </p>

          <div className="flex flex-col gap-3">
            {pedidos.map((pedido) => {
              const entrega = pedido.modalidade === "entrega";

              return (
                <Cartao key={pedido.id} className="p-0">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-carvao-800 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-[14.5px] font-semibold text-creme">
                        {pedido.clienteNome || "Cliente sem nome"}
                      </p>
                      <p className="text-[12px] text-creme-muted">
                        #{pedido.id} · {formatarDataHora(pedido.criadoEm)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          entrega
                            ? "bg-ambar-500/15 text-ambar-400"
                            : "bg-carvao-800 text-creme-muted"
                        }`}
                      >
                        {entrega ? <Truck size={12} /> : <Store size={12} />}
                        {entrega ? "Entrega" : "Retirada"}
                      </span>
                      <span className="font-display text-xl font-semibold text-ambar-400 tabular-nums">
                        {formatarPreco(pedido.totalCentavos)}
                      </span>
                    </div>
                  </div>

                  <ul className="divide-y divide-carvao-800/60">
                    {pedido.itens.map((item, indice) => (
                      <li
                        key={`${pedido.id}-${item.produtoId}-${indice}`}
                        className="flex items-start justify-between gap-3 px-5 py-2.5"
                      >
                        <span className="min-w-0">
                          <span className="block text-[13.5px] text-creme">
                            {item.nome}
                          </span>
                          {item.composicao && (
                            <span className="block text-[11.5px] text-ambar-400/80">
                              {item.composicao}
                            </span>
                          )}
                          <span className="block text-[12px] text-creme-muted">
                            {formatarQuantidade(item.quantidade, item.unidade)} ×{" "}
                            {formatarPreco(item.precoUnitarioCentavos)}
                          </span>
                        </span>
                        <span className="shrink-0 text-[13px] font-semibold tabular-nums text-creme">
                          {formatarPreco(item.subtotalCentavos)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {(entrega || pedido.observacoes || (pedido.taxaEntregaCentavos ?? 0) > 0) && (
                    <div className="flex flex-col gap-1.5 border-t border-carvao-800 px-5 py-3 text-[12.5px]">
                      {entrega && (
                        <p className="flex items-start gap-1.5 text-creme-muted">
                          <MapPin size={13} className="mt-0.5 shrink-0" />
                          {pedido.enderecoEntrega || "Endereço não informado"}
                        </p>
                      )}
                      {(pedido.taxaEntregaCentavos ?? 0) > 0 && (
                        <p className="text-creme-muted">
                          Subtotal {formatarPreco(pedido.subtotalCentavos ?? 0)} + taxa{" "}
                          {formatarPreco(pedido.taxaEntregaCentavos ?? 0)}
                        </p>
                      )}
                      {pedido.observacoes && (
                        <p className="text-creme">
                          <span className="font-semibold text-creme-muted">Obs: </span>
                          {pedido.observacoes}
                        </p>
                      )}
                    </div>
                  )}
                </Cartao>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
