import { Cabecalho } from "@/components/loja/cabecalho";
import { CapturaEmail } from "@/components/loja/captura-email";
import { CarrinhoBarra } from "@/components/loja/carrinho-barra";
import { ProvedorCarrinho } from "@/components/loja/carrinho-contexto";
import { CarrinhoPainel } from "@/components/loja/carrinho-painel";
import { Catalogo } from "@/components/loja/catalogo";
import { DadosEstruturados } from "@/components/loja/dados-estruturados";
import { Hero } from "@/components/loja/hero";
import { Kits } from "@/components/loja/kits";
import { Ofertas } from "@/components/loja/ofertas";
import { RepetirPedido } from "@/components/loja/repetir-pedido";
import { Rodape } from "@/components/loja/rodape";
import { Selos } from "@/components/loja/selos";
import { situacaoDaLoja } from "@/lib/horario";
import { obterConfig } from "@/lib/repo/config";
import { listarItensDeKits } from "@/lib/repo/kits";
import { listarProdutos } from "@/lib/repo/produtos";
import { urlDoSite } from "@/lib/url";
import { montarVitrine } from "@/lib/vitrine";

// O dono muda preço no painel e espera ver no site na hora — sem cache estático.
export const dynamic = "force-dynamic";

export default async function PaginaLoja() {
  const [produtos, config] = await Promise.all([listarProdutos(), obterConfig()]);

  // Kits precisam da composição para saber preço cheio, economia e se alguma
  // peça faltou — por isso a vitrine é montada depois de buscar os dois.
  const kitIds = produtos.filter((produto) => produto.tipo === "kit").map((x) => x.id);
  const itensDeKits = await listarItensDeKits(kitIds);

  const agora = new Date();
  const vitrine = montarVitrine(produtos, itensDeKits, agora).filter((x) => x.disponivel);

  const ofertas = vitrine.filter((produto) => produto.emOferta && produto.tipo !== "kit");
  const kits = vitrine.filter((produto) => produto.tipo === "kit");
  const situacao = situacaoDaLoja(config.horarios, agora);

  return (
    <ProvedorCarrinho
      entrega={{
        ativa: config.entregaAtiva,
        taxaCentavos: config.taxaEntregaCentavos,
        minimoCentavos: config.pedidoMinimoCentavos,
      }}
    >
      <DadosEstruturados config={config} url={urlDoSite()} />

      <Cabecalho
        nomeLoja={config.nome}
        whatsapp={config.whatsapp}
        horarios={config.horarios}
        situacao={situacao}
      />

      <main>
        <Hero
          nomeLoja={config.nome}
          whatsapp={config.whatsapp}
          horarios={config.horarios}
          situacao={situacao}
          entregaAtiva={config.entregaAtiva}
          destaque={ofertas[0]}
        />
        <RepetirPedido produtos={vitrine} />
        <Selos entregaAtiva={config.entregaAtiva} />
        <Ofertas produtos={ofertas} />
        <Kits kits={kits} />
        <Catalogo produtos={vitrine} />
        <CapturaEmail />
      </main>

      <Rodape config={config} />

      <CarrinhoBarra />
      <CarrinhoPainel
        nomeLoja={config.nome}
        whatsapp={config.whatsapp}
        enderecoLoja={config.endereco}
        avisoEntrega={config.entregaTexto}
        produtos={vitrine}
      />
    </ProvedorCarrinho>
  );
}
