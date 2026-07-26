import Link from "next/link";
import { AlertTriangle, ArrowRight, Plus } from "lucide-react";
import {
  BotaoPrimario,
  CabecalhoPagina,
  Cartao,
  Estatistica,
  VazioEstado,
} from "@/components/admin/ui";
import { exigirSessao } from "@/lib/admin/guarda";
import { situacaoDosCanais } from "@/lib/canais";
import { formatarDataHora, formatarPreco } from "@/lib/format";
import { avisosDoProduto, ofertaAtiva } from "@/lib/produto";
import { listarContatos } from "@/lib/repo/contatos";
import { listarPedidosDesde } from "@/lib/repo/pedidos";
import { listarProdutos } from "@/lib/repo/produtos";

export const dynamic = "force-dynamic";

export const metadata = { title: "Início" };

export default async function PaginaInicio() {
  const sessao = await exigirSessao();

  const inicioDoDia = new Date();
  inicioDoDia.setHours(0, 0, 0, 0);

  const [produtos, pedidosHoje, contatos] = await Promise.all([
    listarProdutos(),
    listarPedidosDesde(inicioDoDia),
    listarContatos(),
  ]);

  const faturamentoEstimado = pedidosHoje.reduce((soma, x) => soma + x.totalCentavos, 0);
  const ofertas = produtos.filter((x) => ofertaAtiva(x));
  const contatosAtivos = contatos.filter((x) => !x.descadastradoEm);

  const pendencias = produtos
    .map((produto) => ({ produto, avisos: avisosDoProduto(produto) }))
    .filter((x) => x.avisos.length > 0);

  const canais = situacaoDosCanais();

  return (
    <>
      <CabecalhoPagina
        titulo={`Olá, ${sessao.nome.split(" ")[0]}`}
        descricao="Um resumo do dia e o que precisa da sua atenção."
        acao={
          <BotaoPrimario href="/admin/produtos/novo">
            <Plus size={16} />
            Novo corte
          </BotaoPrimario>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Estatistica
          rotulo="Pedidos hoje"
          valor={pedidosHoje.length}
          detalhe={`${formatarPreco(faturamentoEstimado)} estimados`}
        />
        <Estatistica
          rotulo="Cortes na vitrine"
          valor={produtos.filter((x) => x.disponivel).length}
          detalhe={`${produtos.length} cadastrados no total`}
        />
        <Estatistica
          rotulo="Ofertas ativas"
          valor={ofertas.length}
          detalhe={ofertas.length === 0 ? "Nenhuma promoção no ar" : "Aparecendo na home"}
          tom={ofertas.length === 0 ? "alerta" : "bom"}
        />
        <Estatistica
          rotulo="Lista de e-mail"
          valor={contatosAtivos.length}
          detalhe={`${contatos.length - contatosAtivos.length} descadastrado(s)`}
        />
      </div>

      {/* Avisos de cadastro incompleto — o que está atrapalhando a venda */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Precisa de atenção</h2>
        {pendencias.length === 0 ? (
          <Cartao>
            <p className="text-[13.5px] text-creme-muted">
              Tudo certo por aqui: nenhum produto com cadastro incompleto.
            </p>
          </Cartao>
        ) : (
          <Cartao className="p-0">
            <ul className="divide-y divide-carvao-800">
              {pendencias.slice(0, 6).map(({ produto, avisos }) => (
                <li key={produto.id}>
                  <Link
                    href={`/admin/produtos/${produto.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-carvao-850"
                  >
                    <AlertTriangle size={16} className="shrink-0 text-alerta" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-creme">
                        {produto.nome}
                      </span>
                      <span className="block text-[12px] text-creme-muted">
                        {avisos.join(" · ")}
                      </span>
                    </span>
                    <ArrowRight size={15} className="shrink-0 text-creme-muted" />
                  </Link>
                </li>
              ))}
            </ul>
            {pendencias.length > 6 && (
              <p className="border-t border-carvao-800 px-5 py-3 text-[12.5px] text-creme-muted">
                e mais {pendencias.length - 6} produto(s) com pendência.
              </p>
            )}
          </Cartao>
        )}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Pedidos de hoje</h2>
          {pedidosHoje.length === 0 ? (
            <VazioEstado
              titulo="Nenhum pedido hoje"
              texto="Assim que um cliente enviar o pedido pelo site, ele aparece aqui."
            />
          ) : (
            <Cartao className="p-0">
              <ul className="divide-y divide-carvao-800">
                {pedidosHoje.slice(0, 8).map((pedido) => (
                  <li key={pedido.id} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[14px] font-semibold text-creme">
                        {pedido.clienteNome || "Cliente sem nome"}
                      </span>
                      <span className="text-[14px] font-semibold text-ambar-400">
                        {formatarPreco(pedido.totalCentavos)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-creme-muted">
                      {formatarDataHora(pedido.criadoEm)} ·{" "}
                      {pedido.itens.map((item) => item.nome).join(", ")}
                    </p>
                  </li>
                ))}
              </ul>
            </Cartao>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Canais de comunicação</h2>
          <Cartao className="p-0">
            <ul className="divide-y divide-carvao-800">
              {canais.map((canal) => (
                <li key={canal.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13.5px] font-semibold text-creme">
                      {canal.rotulo}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        canal.ativo
                          ? "bg-sucesso/15 text-sucesso"
                          : "bg-carvao-800 text-creme-muted"
                      }`}
                    >
                      {canal.ativo ? "ligado" : "desligado"}
                    </span>
                  </div>
                  {canal.motivo && (
                    <p className="mt-1 text-[12px] leading-snug text-creme-muted">
                      {canal.motivo}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Cartao>
        </section>
      </div>
    </>
  );
}
