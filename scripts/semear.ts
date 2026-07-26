/**
 * Popula o banco com um catálogo inicial e os dados da loja.
 *
 *   npm run db:semear
 *
 * Serve para o dono abrir o painel já com cortes de exemplo para editar, em
 * vez de encarar uma tela vazia. Não apaga nada: se já houver produtos, sai.
 */
import { db, bancoConfigurado } from "../src/lib/db";
import { configLoja, kitItens, produtos } from "../src/lib/db/schema";
import { estadoDemo } from "../src/lib/demo/armazem";

async function principal() {
  if (!bancoConfigurado) {
    console.error("\nDATABASE_URL não configurada. Nada para semear.\n");
    process.exit(1);
  }

  const existentes = await db().select({ id: produtos.id }).from(produtos).limit(1);
  if (existentes.length > 0) {
    console.log("\nJá existem produtos cadastrados. Nada foi alterado.\n");
    process.exit(0);
  }

  const demo = estadoDemo();

  // Os ids do banco são gerados na inserção, então guardamos o mapa
  // id-de-demonstração -> id-real para reconstruir a composição dos kits.
  const criados = await db()
    .insert(produtos)
    .values(
      demo.produtos.map((produto) => ({
        nome: produto.nome,
        categoria: produto.categoria,
        tipo: produto.tipo,
        precoCentavos: produto.precoCentavos,
        unidade: produto.unidade,
        descricao: produto.descricao,
        disponivel: produto.disponivel,
        emOferta: produto.emOferta,
        precoPromoCentavos: produto.precoPromoCentavos,
        ofertaAte: produto.ofertaAte,
        ordem: produto.ordem,
      })),
    )
    .returning({ id: produtos.id, nome: produtos.nome });

  const idPorNome = new Map(criados.map((linha) => [linha.nome, linha.id]));
  const nomePorIdDemo = new Map(demo.produtos.map((x) => [x.id, x.nome]));

  const composicoes = demo.kitItens
    .map((item) => {
      const kitId = idPorNome.get(nomePorIdDemo.get(item.kitId) ?? "");
      const produtoId = idPorNome.get(nomePorIdDemo.get(item.produtoId) ?? "");
      if (!kitId || !produtoId) return null;
      return { kitId, produtoId, quantidade: item.quantidade };
    })
    .filter((x): x is { kitId: number; produtoId: number; quantidade: number } => x !== null);

  if (composicoes.length > 0) {
    await db().insert(kitItens).values(composicoes);
  }

  await db()
    .insert(configLoja)
    .values({
      id: 1,
      nome: demo.config.nome,
      whatsapp: demo.config.whatsapp,
      endereco: demo.config.endereco,
      horario: demo.config.horario,
      horarios: demo.config.horarios,
      telefone: demo.config.telefone,
      instagram: demo.config.instagram,
      facebook: demo.config.facebook,
      mapsUrl: demo.config.mapsUrl,
      // A loja começa só com retirada; a entrega é ligada no painel quando existir.
      entregaAtiva: false,
      entregaTexto: demo.config.entregaTexto,
      taxaEntregaCentavos: demo.config.taxaEntregaCentavos,
      pedidoMinimoCentavos: demo.config.pedidoMinimoCentavos,
    })
    .onConflictDoNothing();

  console.log(
    `\n✓ ${criados.length} produtos, ${composicoes.length} item(ns) de kit e os dados da loja foram criados.\n`,
  );
  console.log("Abra /admin/produtos e ajuste preços, fotos e descrições.");
  console.log("Confira o WhatsApp e o horário em /admin/loja.\n");
  process.exit(0);
}

principal().catch((erro) => {
  console.error("\nFalhou:", erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
