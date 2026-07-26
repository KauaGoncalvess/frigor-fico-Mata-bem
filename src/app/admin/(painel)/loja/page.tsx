import { CabecalhoPagina } from "@/components/admin/ui";
import { exigirSessao } from "@/lib/admin/guarda";
import { obterConfig } from "@/lib/repo/config";
import { FormularioLoja } from "./formulario";

export const dynamic = "force-dynamic";

export const metadata = { title: "Minha loja" };

export default async function PaginaLoja() {
  await exigirSessao();
  const config = await obterConfig();

  return (
    <>
      <CabecalhoPagina
        titulo="Minha loja"
        descricao="Os dados que aparecem no site e para onde vão os pedidos."
      />
      <FormularioLoja config={config} />
    </>
  );
}
