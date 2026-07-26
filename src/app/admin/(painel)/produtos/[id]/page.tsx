import { notFound } from "next/navigation";
import { CabecalhoPagina } from "@/components/admin/ui";
import { exigirSessao } from "@/lib/admin/guarda";
import { listarItensDoKit } from "@/lib/repo/kits";
import { listarProdutos, obterProduto } from "@/lib/repo/produtos";
import { FormularioProduto } from "../formulario";

export const dynamic = "force-dynamic";

export const metadata = { title: "Editar item" };

export default async function PaginaEditarProduto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirSessao();

  const { id } = await params;
  const numero = Number(id);
  if (!Number.isInteger(numero)) notFound();

  const [produto, todos, componentes] = await Promise.all([
    obterProduto(numero),
    listarProdutos(),
    listarItensDoKit(numero),
  ]);
  if (!produto) notFound();

  // O próprio item nunca entra na lista de composição dele mesmo.
  const cortes = todos.filter((x) => x.tipo !== "kit" && x.id !== produto.id);

  return (
    <>
      <CabecalhoPagina
        titulo={produto.nome}
        descricao="Alterações aparecem na loja assim que você salvar."
      />
      <FormularioProduto produto={produto} cortes={cortes} componentes={componentes} />
    </>
  );
}
