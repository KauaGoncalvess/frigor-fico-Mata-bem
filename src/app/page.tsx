import { Cabecalho } from "@/components/loja/cabecalho";
import { CapturaEmail } from "@/components/loja/captura-email";
import { CarrinhoBarra } from "@/components/loja/carrinho-barra";
import { ProvedorCarrinho } from "@/components/loja/carrinho-contexto";
import { CarrinhoPainel } from "@/components/loja/carrinho-painel";
import { Catalogo } from "@/components/loja/catalogo";
import { Hero } from "@/components/loja/hero";
import { Ofertas } from "@/components/loja/ofertas";
import { Rodape } from "@/components/loja/rodape";
import { Selos } from "@/components/loja/selos";
import { obterConfig } from "@/lib/repo/config";
import { listarDisponiveis } from "@/lib/repo/produtos";
import { paraVitrine } from "@/lib/vitrine";

// O dono muda preço no painel e espera ver no site na hora — sem cache estático.
export const dynamic = "force-dynamic";

export default async function PaginaLoja() {
  const [produtos, config] = await Promise.all([listarDisponiveis(), obterConfig()]);

  const agora = new Date();
  const vitrine = produtos.map((produto) => paraVitrine(produto, agora));
  const ofertas = vitrine.filter((produto) => produto.emOferta);

  return (
    <ProvedorCarrinho>
      <Cabecalho nomeLoja={config.nome} whatsapp={config.whatsapp} />

      <main>
        <Hero nomeLoja={config.nome} whatsapp={config.whatsapp} />
        <Selos />
        <Ofertas produtos={ofertas} />
        <Catalogo produtos={vitrine} />
        <CapturaEmail />
      </main>

      <Rodape config={config} />

      <CarrinhoBarra />
      <CarrinhoPainel
        nomeLoja={config.nome}
        whatsapp={config.whatsapp}
        avisoEntrega={config.entregaTexto}
      />
    </ProvedorCarrinho>
  );
}
