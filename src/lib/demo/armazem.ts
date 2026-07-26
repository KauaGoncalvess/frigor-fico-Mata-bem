import type {
  Campanha,
  ConfigLoja,
  Contato,
  KitItem,
  Pedido,
  Produto,
} from "@/lib/db/schema";
import { HORARIO_PADRAO, textoDosHorarios } from "@/lib/horario";

/**
 * Armazém em memória usado quando DATABASE_URL não está configurada.
 *
 * Existe por um motivo prático: o site precisa subir na Vercel e ser
 * navegável (inclusive o admin) antes do dono provisionar o Neon. Os dados
 * NÃO persistem entre reinícios — o painel mostra um aviso claro disso.
 */

const agora = () => new Date();
const emDias = (d: number) => new Date(Date.now() + d * 86_400_000);

function p(
  id: number,
  nome: string,
  categoria: string,
  precoCentavos: number,
  descricao: string,
  extras: Partial<Produto> = {},
): Produto {
  return {
    id,
    nome,
    categoria,
    tipo: "corte",
    precoCentavos,
    unidade: "kg",
    descricao,
    imagemUrl: null,
    imagemPublicId: null,
    disponivel: true,
    emOferta: false,
    precoPromoCentavos: null,
    ofertaAte: null,
    ordem: id,
    criadoEm: agora(),
    atualizadoEm: agora(),
    ...extras,
  };
}

const PRODUTOS_INICIAIS: Produto[] = [
  p(1, "Picanha Maturada", "bovino", 8990, "Peça inteira, maturação a vácuo por 21 dias. Capa de gordura generosa.", {
    emOferta: true,
    precoPromoCentavos: 7490,
    ofertaAte: emDias(6),
  }),
  p(2, "Costela Bovina Ripa", "bovino", 3990, "Corte tradicional de fogo de chão, com osso e marmoreio."),
  p(3, "Contrafilé", "bovino", 5490, "Maciez e sabor equilibrados. Ideal para bife alto na grelha.", {
    emOferta: true,
    precoPromoCentavos: 4690,
    ofertaAte: emDias(6),
  }),
  p(4, "Fraldinha", "bovino", 4890, "Fibras longas e suculentas. Excelente no churrasco ou na cerveja."),
  p(5, "Alcatra em Peça", "bovino", 5290, "Versátil: bife, cubos ou assado de forno."),
  p(6, "Maminha", "bovino", 5690, "Corte macio da alcatra, dourada por fora e rosada por dentro."),
  p(7, "Carne Moída Patinho", "bovino", 3490, "Moída na hora, baixo teor de gordura."),
  p(8, "Pernil Suíno sem Osso", "suino", 2790, "Peça limpa, pronta para temperar e assar."),
  p(9, "Costelinha Suína", "suino", 3290, "Barbecue ou na brasa. Camada de gordura na medida.", {
    emOferta: true,
    precoPromoCentavos: 2690,
    ofertaAte: emDias(6),
  }),
  p(10, "Bisteca Suína", "suino", 2490, "Corte com osso, clássico da chapa."),
  p(11, "Panceta Fresca", "suino", 3890, "Barriga suína em manta, para pururuca perfeita."),
  p(12, "Frango Caipira Inteiro", "aves", 4290, "Criação solta, carne firme e saborosa. Peça de 1,5 kg a 2 kg.", {
    unidade: "un",
  }),
  p(13, "Coxa e Sobrecoxa", "aves", 1690, "Com pele, ótimo custo-benefício para o dia a dia."),
  p(14, "Filé de Peito de Frango", "aves", 2490, "Limpo, sem pele, embalado em porções."),
  p(15, "Linguiça Toscana Artesanal", "embutidos", 2990, "Produção própria, tripa natural, só pernil e temperos.", {
    emOferta: true,
    precoPromoCentavos: 2390,
    ofertaAte: emDias(6),
  }),
  p(16, "Linguiça Cuiabana", "embutidos", 3190, "Apimentada na medida, feita na casa."),
  p(17, "Bacon em Manta", "embutidos", 4290, "Defumado na lenha, fatiar como preferir."),
  p(18, "Picanha Suína", "suino", 3590, "Alternativa econômica com capa de gordura saborosa.", {
    disponivel: false,
  }),
  p(19, "Carvão Vegetal 5 kg", "embutidos", 2990, "Saco de 5 kg, queima longa e pouca fumaça.", {
    unidade: "un",
  }),
  // Kit: preço fechado, composição definida em KIT_ITENS_INICIAIS.
  p(20, "Kit Churrasco 5 Pessoas", "bovino", 13990, "Picanha, fraldinha, linguiça toscana e pão de alho. Sai pronto para a brasa.", {
    tipo: "kit",
    unidade: "un",
    ordem: 0,
  }),
];

const KIT_ITENS_INICIAIS: KitItem[] = [
  { id: 1, kitId: 20, produtoId: 1, quantidade: 1.2 },
  { id: 2, kitId: 20, produtoId: 4, quantidade: 1 },
  { id: 3, kitId: 20, produtoId: 15, quantidade: 1 },
];

const CONFIG_INICIAL: ConfigLoja = {
  id: 1,
  nome: "Frigorífico Mata Bem",
  whatsapp: "5511999999999",
  endereco: "Av. das Carnes, 1200 — Centro, São Paulo/SP",
  horario: textoDosHorarios(HORARIO_PADRAO),
  telefone: "(11) 99999-9999",
  instagram: "https://instagram.com",
  facebook: null,
  mapsUrl: "https://maps.google.com/?q=Av.+das+Carnes+1200",
  // A loja começa só com retirada no balcão. Nada no site promete entrega
  // enquanto isto estiver desligado.
  entregaAtiva: false,
  entregaTexto: null,
  taxaEntregaCentavos: null,
  pedidoMinimoCentavos: null,
  horarios: HORARIO_PADRAO,
  atualizadoEm: agora(),
};

type Estado = {
  produtos: Produto[];
  kitItens: KitItem[];
  contatos: Contato[];
  pedidos: Pedido[];
  campanhas: Campanha[];
  config: ConfigLoja;
  proximoId: number;
};

const cache = globalThis as unknown as { __demo?: Estado };

export function estadoDemo(): Estado {
  if (!cache.__demo) {
    cache.__demo = {
      produtos: PRODUTOS_INICIAIS.map((x) => ({ ...x })),
      kitItens: KIT_ITENS_INICIAIS.map((x) => ({ ...x })),
      contatos: [],
      pedidos: [],
      campanhas: [],
      config: { ...CONFIG_INICIAL },
      proximoId: 100,
    };
  }
  return cache.__demo;
}

export function proximoIdDemo(): number {
  const estado = estadoDemo();
  estado.proximoId += 1;
  return estado.proximoId;
}
