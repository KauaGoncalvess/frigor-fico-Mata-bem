"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Modalidade } from "@/lib/db/schema";

export type ItemCarrinho = {
  produtoId: number;
  nome: string;
  unidade: string;
  precoUnitarioCentavos: number;
  quantidade: number;
};

/** O que a loja oferece hoje. Vem do painel, não fica chumbado no código. */
export type ConfigEntrega = {
  ativa: boolean;
  taxaCentavos: number | null;
  minimoCentavos: number | null;
};

/**
 * Passo do botão +/-. Carne se compra em meio quilo; frango inteiro e carvão
 * se compram por peça, e meia peça não existe.
 */
export function passoDaUnidade(unidade: string): number {
  return unidade === "kg" ? 0.5 : 1;
}

type Carrinho = {
  itens: ItemCarrinho[];
  totalItens: number;
  subtotalCentavos: number;
  taxaCentavos: number;
  totalCentavos: number;

  entrega: ConfigEntrega;
  modalidade: Modalidade;
  definirModalidade: (valor: Modalidade) => void;
  enderecoEntrega: string;
  definirEnderecoEntrega: (valor: string) => void;

  /** Quanto falta para bater o mínimo (0 quando já bateu ou não se aplica). */
  faltaParaMinimoCentavos: number;
  podeFechar: boolean;
  impedimento: string | null;

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

export function ProvedorCarrinho({
  children,
  entrega,
}: {
  children: React.ReactNode;
  entrega: ConfigEntrega;
}) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [painelAberto, setPainelAberto] = useState(false);
  const [hidratado, setHidratado] = useState(false);
  // Retirada é o padrão mesmo quando a entrega está ligada: é o que a loja
  // sempre consegue cumprir.
  const [modalidade, setModalidade] = useState<Modalidade>("retirada");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");

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

  // Se o dono desligar a entrega enquanto alguém está com a tela aberta,
  // o pedido não pode continuar marcado como entrega.
  useEffect(() => {
    if (!entrega.ativa && modalidade === "entrega") setModalidade("retirada");
  }, [entrega.ativa, modalidade]);

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
    (item: Omit<ItemCarrinho, "quantidade">, quantidade?: number) => {
      const passo = quantidade ?? passoDaUnidade(item.unidade) * (item.unidade === "kg" ? 2 : 1);
      setItens((atuais) => {
        const existente = atuais.find((x) => x.produtoId === item.produtoId);
        if (existente) {
          return atuais.map((x) =>
            x.produtoId === item.produtoId
              ? { ...x, quantidade: Number((x.quantidade + passo).toFixed(3)) }
              : x,
          );
        }
        return [...atuais, { ...item, quantidade: passo }];
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
    const subtotalCentavos = itens.reduce(
      (soma, x) => soma + Math.round(x.precoUnitarioCentavos * x.quantidade),
      0,
    );

    const paraEntrega = entrega.ativa && modalidade === "entrega";
    const taxaCentavos = paraEntrega ? (entrega.taxaCentavos ?? 0) : 0;

    const minimo = paraEntrega ? (entrega.minimoCentavos ?? 0) : 0;
    const faltaParaMinimoCentavos = Math.max(0, minimo - subtotalCentavos);

    const enderecoOk = !paraEntrega || enderecoEntrega.trim().length >= 8;

    let impedimento: string | null = null;
    if (itens.length === 0) impedimento = "Seu pedido está vazio.";
    else if (faltaParaMinimoCentavos > 0) impedimento = "minimo";
    else if (!enderecoOk) impedimento = "Informe o endereço da entrega.";

    return {
      itens,
      totalItens: itens.length,
      subtotalCentavos,
      taxaCentavos,
      totalCentavos: subtotalCentavos + taxaCentavos,

      entrega,
      modalidade,
      definirModalidade: setModalidade,
      enderecoEntrega,
      definirEnderecoEntrega: setEnderecoEntrega,

      faltaParaMinimoCentavos,
      podeFechar: impedimento === null,
      impedimento,

      adicionar,
      definirQuantidade,
      remover,
      limpar,
      quantidadeDe: (id) => itens.find((x) => x.produtoId === id)?.quantidade ?? 0,

      painelAberto,
      abrirPainel: () => setPainelAberto(true),
      fecharPainel: () => setPainelAberto(false),
    };
  }, [
    itens,
    entrega,
    modalidade,
    enderecoEntrega,
    adicionar,
    definirQuantidade,
    remover,
    limpar,
    painelAberto,
  ]);

  return <CarrinhoContexto.Provider value={valor}>{children}</CarrinhoContexto.Provider>;
}

export function useCarrinho(): Carrinho {
  const contexto = useContext(CarrinhoContexto);
  if (!contexto) {
    throw new Error("useCarrinho precisa estar dentro de <ProvedorCarrinho>.");
  }
  return contexto;
}
