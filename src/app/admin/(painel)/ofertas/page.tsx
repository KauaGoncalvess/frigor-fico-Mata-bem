import { CabecalhoPagina } from "@/components/admin/ui";
import { exigirSessao } from "@/lib/admin/guarda";
import { listarProdutos } from "@/lib/repo/produtos";
import { PainelOfertas } from "./painel";

export const dynamic = "force-dynamic";

export const metadata = { title: "Ofertas da semana" };

export default async function PaginaOfertas() {
  await exigirSessao();
  const produtos = await listarProdutos();

  // "Em oferta" aqui inclui a oferta vencida de propósito: ela sumiu da loja,
  // mas continua marcada no cadastro e o dono precisa ver isso para resolver.
  const emOferta = produtos.filter((x) => x.emOferta);
  const disponiveis = produtos.filter((x) => !x.emOferta && x.disponivel);

  return (
    <>
      <CabecalhoPagina
        titulo="Ofertas da semana"
        descricao="O bloco de destaque da loja. Só entram cortes disponíveis e com preço promocional válido."
      />
      <PainelOfertas emOferta={emOferta} disponiveis={disponiveis} />
    </>
  );
}
