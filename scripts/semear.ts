/**
 * Popula o banco com um catálogo inicial e os dados da loja.
 *
 *   npm run db:semear
 *
 * Serve para o dono abrir o painel já com cortes de exemplo para editar, em
 * vez de encarar uma tela vazia. Não apaga nada: se já houver produtos, sai.
 */
import { db, bancoConfigurado } from "../src/lib/db";
import { configLoja, produtos } from "../src/lib/db/schema";
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

  await db()
    .insert(produtos)
    .values(
      demo.produtos.map((produto) => ({
        nome: produto.nome,
        categoria: produto.categoria,
        precoCentavos: produto.precoCentavos,
        unidade: produto.unidade,
        descricao: produto.descricao,
        disponivel: produto.disponivel,
        emOferta: produto.emOferta,
        precoPromoCentavos: produto.precoPromoCentavos,
        ofertaAte: produto.ofertaAte,
        ordem: produto.ordem,
      })),
    );

  await db()
    .insert(configLoja)
    .values({
      id: 1,
      nome: demo.config.nome,
      whatsapp: demo.config.whatsapp,
      endereco: demo.config.endereco,
      horario: demo.config.horario,
      telefone: demo.config.telefone,
      instagram: demo.config.instagram,
      facebook: demo.config.facebook,
      mapsUrl: demo.config.mapsUrl,
      entregaTexto: demo.config.entregaTexto,
    })
    .onConflictDoNothing();

  console.log(`\n✓ ${demo.produtos.length} produtos e os dados da loja foram criados.\n`);
  console.log("Abra /admin/produtos e ajuste preços, fotos e descrições.\n");
  process.exit(0);
}

principal().catch((erro) => {
  console.error("\nFalhou:", erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
