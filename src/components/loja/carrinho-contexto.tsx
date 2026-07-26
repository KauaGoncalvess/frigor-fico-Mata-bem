"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ItemCarrinho = {
  produtoId: number;
  nome: string;
  unidade: string;
  precoUnitarioCentavos: number;
  quantidade: number;
};

type Carrinho = {
  itens: ItemCarrinho[];
  totalItens: number;
  totalCentavos: number;
  adicionar: (item: Omit<ItemCarrinho, "quantidade">, quantidade?: number) => void;
  definirQuantidade: (produtoId: number, quantidade: number) => void;
  remover: (produtoId: number) => void;
  limpar: () => void;
  quantidadeDe: (produtoId: number) => number;
  painelAberto: boolean;
  abrirPainel: () => void;
  fecharPainel: () => void;
};

const CarrinhoContexto = createContext<Carrinho | null>(null);

const CHAVE = "matabem:carrinho:v1";
export const PASSO_KG = 0.5;

function carregar(): ItemCarrinho[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return [];
    const dados = JSON.parse(bruto);
    if (!Array.isArray(dados)) return [];
    return dados.filter(
      (x): x is ItemCarrinho =>
        typeof x?.produtoId === "number" &&
        typeof x?.nome === "string" &&
        typeof x?.precoUnitarioCentavos === "number" &&
        typeof x?.quantidade === "number" &&
        x.quantidade > 0,
    );
  } catch {
    return [];
  }
}

export function ProvedorCarrinho({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [painelAberto, setPainelAberto] = useState(false);
  const [hidratado, setHidratado] = useState(false);

  // Só lê o localStorage depois da montagem: no servidor ele não existe, e ler
  // durante o render faria o HTML do servidor divergir do cliente.
  useEffect(() => {
    setItens(carregar());
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify(itens));
    } catch {
      // Modo privado do Safari bloqueia escrita: o carrinho segue só em memória.
    }
  }, [itens, hidratado]);

  // Trava a rolagem do fundo enquanto o painel do carrinho está aberto.
  useEffect(() => {
    if (!painelAberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [painelAberto]);

  const adicionar = useCallback(
    (item: Omit<ItemCarrinho, "quantidade">, quantidade = 1) => {
      setItens((atuais) => {
        const existente = atuais.find((x) => x.produtoId === item.produtoId);
        if (existente) {
          return atuais.map((x) =>
            x.produtoId === item.produtoId
              ? { ...x, quantidade: Number((x.quantidade + quantidade).toFixed(3)) }
              : x,
          );
        }
        return [...atuais, { ...item, quantidade }];
      });
    },
    [],
  );

  const definirQuantidade = useCallback((produtoId: number, quantidade: number) => {
    setItens((atuais) => {
      if (quantidade <= 0) return atuais.filter((x) => x.produtoId !== produtoId);
      return atuais.map((x) =>
        x.produtoId === produtoId ? { ...x, quantidade: Number(quantidade.toFixed(3)) } : x,
      );
    });
  }, []);

  const remover = useCallback((produtoId: number) => {
    setItens((atuais) => atuais.filter((x) => x.produtoId !== produtoId));
  }, []);

  const limpar = useCallback(() => setItens([]), []);

  const valor = useMemo<Carrinho>(() => {
    const totalCentavos = itens.reduce(
      (soma, x) => soma + Math.round(x.precoUnitarioCentavos * x.quantidade),
      0,
    );
    return {
      itens,
      totalItens: itens.length,
      totalCentavos,
      adicionar,
      definirQuantidade,
      remover,
      limpar,
      quantidadeDe: (id) => itens.find((x) => x.produtoId === id)?.quantidade ?? 0,
      painelAberto,
      abrirPainel: () => setPainelAberto(true),
      fecharPainel: () => setPainelAberto(false),
    };
  }, [itens, adicionar, definirQuantidade, remover, limpar, painelAberto]);

  return <CarrinhoContexto.Provider value={valor}>{children}</CarrinhoContexto.Provider>;
}

export function useCarrinho(): Carrinho {
  const contexto = useContext(CarrinhoContexto);
  if (!contexto) {
    throw new Error("useCarrinho precisa estar dentro de <ProvedorCarrinho>.");
  }
  return contexto;
}
