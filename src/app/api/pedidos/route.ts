import { NextResponse } from "next/server";
import { z } from "zod";
import type { ItemPedido } from "@/lib/db/schema";
import { precoEfetivo } from "@/lib/produto";
import { registrarPedido } from "@/lib/repo/pedidos";
import { obterProdutosPorIds } from "@/lib/repo/produtos";
import { ipDaRequisicao, limitar } from "@/lib/seguranca/rate-limit";

const Entrada = z.object({
  itens: z
    .array(
      z.object({
        produtoId: z.number().int().positive(),
        quantidade: z.number().positive().max(500),
      }),
    )
    .min(1)
    .max(60),
  clienteNome: z.string().trim().max(80).nullable().optional(),
  observacoes: z.string().trim().max(400).nullable().optional(),
});

/**
 * Registra o pedido que o cliente está mandando para o WhatsApp.
 *
 * O navegador manda só id e quantidade: preço e nome vêm do banco. Se o preço
 * viesse do cliente, qualquer pessoa poderia editar o JSON e registrar uma
 * picanha por R$ 1 — e o painel do dono passaria a mentir.
 */
export async function POST(req: Request) {
  const ip = ipDaRequisicao(req);
  const limite = await limitar(`pedido:${ip}`, 20, 300);
  if (!limite.permitido) {
    return NextResponse.json(
      { mensagem: "Muitos pedidos seguidos. Aguarde um pouco." },
      { status: 429, headers: { "Retry-After": String(limite.esperarSegundos) } },
    );
  }

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ mensagem: "Requisição inválida." }, { status: 400 });
  }

  const analise = Entrada.safeParse(corpo);
  if (!analise.success) {
    return NextResponse.json({ mensagem: "Pedido inválido." }, { status: 400 });
  }

  const { itens, clienteNome, observacoes } = analise.data;

  try {
    const produtos = await obterProdutosPorIds(itens.map((x) => x.produtoId));
    const porId = new Map(produtos.map((produto) => [produto.id, produto]));
    const agora = new Date();

    const itensPedido: ItemPedido[] = [];
    for (const item of itens) {
      const produto = porId.get(item.produtoId);
      if (!produto) continue; // produto saiu do ar entre a escolha e o envio

      const preco = precoEfetivo(produto, agora);
      itensPedido.push({
        produtoId: produto.id,
        nome: produto.nome,
        quantidade: item.quantidade,
        unidade: produto.unidade,
        precoUnitarioCentavos: preco,
        subtotalCentavos: Math.round(preco * item.quantidade),
      });
    }

    if (itensPedido.length === 0) {
      return NextResponse.json(
        { mensagem: "Nenhum item disponível no pedido." },
        { status: 400 },
      );
    }

    const totalCentavos = itensPedido.reduce((soma, x) => soma + x.subtotalCentavos, 0);

    const pedido = await registrarPedido({
      itens: itensPedido,
      totalCentavos,
      clienteNome: clienteNome ?? null,
      observacoes: observacoes ?? null,
    });

    return NextResponse.json({ id: pedido.id, totalCentavos });
  } catch {
    // O cliente já está indo para o WhatsApp: não vale travar a venda por isso.
    return NextResponse.json({ mensagem: "Pedido não registrado." }, { status: 500 });
  }
}
