import { notFound } from "next/navigation";
import { CabecalhoPagina } from "@/components/admin/ui";
import { exigirSessao } from "@/lib/admin/guarda";
import { obterProduto } from "@/lib/repo/produtos";
import { FormularioProduto } from "../formulario";

export const dynamic = "force-dynamic";

export const metadata = { title: "Editar corte" };

export default async function PaginaEditarProduto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirSessao();

  const { id } = await params;
  const numero = Number(id);
  if (!Number.isInteger(numero)) notFound();

  const produto = await obterProduto(numero);
  if (!produto) notFound();

  return (
    <>
      <CabecalhoPagina
        titulo={produto.nome}
        descricao="Alterações aparecem na loja assim que você salvar."
      />
      <FormularioProduto produto={produto} />
    </>
  );
}
