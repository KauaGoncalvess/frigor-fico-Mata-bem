import { CabecalhoPagina } from "@/components/admin/ui";
import { exigirSessao } from "@/lib/admin/guarda";
import { FormularioProduto } from "../formulario";

export const dynamic = "force-dynamic";

export const metadata = { title: "Novo corte" };

export default async function PaginaNovoProduto() {
  await exigirSessao();

  return (
    <>
      <CabecalhoPagina
        titulo="Novo corte"
        descricao="Preencha os dados e salve. Você pode ajustar preço e foto depois, quando quiser."
      />
      <FormularioProduto />
    </>
  );
}
