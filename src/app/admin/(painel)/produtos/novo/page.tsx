import { CabecalhoPagina } from "@/components/admin/ui";
import { exigirSessao } from "@/lib/admin/guarda";
import { listarProdutos } from "@/lib/repo/produtos";
import { FormularioProduto } from "../formulario";

export const dynamic = "force-dynamic";

export const metadata = { title: "Novo item" };

export default async function PaginaNovoProduto() {
  await exigirSessao();

  // Só cortes podem compor um kit — kit dentro de kit não faz sentido.
  const cortes = (await listarProdutos()).filter((produto) => produto.tipo !== "kit");

  return (
    <>
      <CabecalhoPagina
        titulo="Novo item"
        descricao="Cadastre um corte ou monte um kit. Você pode ajustar preço e foto depois, quando quiser."
      />
      <FormularioProduto cortes={cortes} />
    </>
  );
}
