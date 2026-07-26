import { Plus } from "lucide-react";
import { AvisoSucesso, BotaoPrimario, CabecalhoPagina, VazioEstado } from "@/components/admin/ui";
import { exigirSessao } from "@/lib/admin/guarda";
import { listarProdutos } from "@/lib/repo/produtos";
import { ListaProdutos } from "./lista";

export const dynamic = "force-dynamic";

export const metadata = { title: "Produtos" };

export default async function PaginaProdutos({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string; apagado?: string }>;
}) {
  await exigirSessao();
  const [{ salvo, apagado }, produtos] = await Promise.all([
    searchParams,
    listarProdutos(),
  ]);

  return (
    <>
      <CabecalhoPagina
        titulo="Produtos"
        descricao="Cadastre cortes, ajuste preços e controle o que está disponível hoje."
        acao={
          <BotaoPrimario href="/admin/produtos/novo">
            <Plus size={16} />
            Novo corte
          </BotaoPrimario>
        }
      />

      {salvo && <AvisoSucesso>Produto salvo com sucesso.</AvisoSucesso>}
      {apagado && <AvisoSucesso>Produto excluído.</AvisoSucesso>}

      {produtos.length === 0 ? (
        <VazioEstado
          titulo="Nenhum corte cadastrado ainda"
          texto="Cadastre o primeiro corte para a loja começar a vender. Leva menos de um minuto."
          acao={
            <BotaoPrimario href="/admin/produtos/novo">
              <Plus size={16} />
              Cadastrar primeiro corte
            </BotaoPrimario>
          }
        />
      ) : (
        <ListaProdutos produtos={produtos} />
      )}
    </>
  );
}
