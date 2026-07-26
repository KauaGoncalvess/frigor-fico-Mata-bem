"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { exigirSessao, falha, sucesso, type RespostaAcao } from "@/lib/admin/guarda";
import { CATEGORIAS, TIPOS_PRODUTO, UNIDADES } from "@/lib/db/schema";
import { analisarPreco } from "@/lib/format";
import { excluirItensDoKit, salvarItensDoKit } from "@/lib/repo/kits";
import {
  atualizarProduto,
  criarProduto,
  definirDisponibilidade,
  encerrarOfertas,
  excluirProduto,
} from "@/lib/repo/produtos";

/** Recarrega loja e painel: preço trocado tem que aparecer na hora nos dois. */
function revalidarTudo() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
  revalidatePath("/admin/ofertas");
}

const Texto = z.string().trim();

const Formulario = z.object({
  id: Texto.optional(),
  nome: Texto.min(2, "Escreva o nome do corte.").max(120),
  categoria: z.enum(CATEGORIAS, { message: "Escolha uma categoria." }),
  tipo: z.enum(TIPOS_PRODUTO).optional().default("corte"),
  preco: Texto.min(1, "Informe o preço."),
  unidade: z.enum(UNIDADES, { message: "Escolha a unidade de venda." }).optional().default("kg"),
  descricao: Texto.max(400, "A descrição ficou longa demais.").optional().default(""),
  imagemUrl: Texto.max(600).optional().default(""),
  imagemPublicId: Texto.max(300).optional().default(""),
  disponivel: Texto.optional(),
  emOferta: Texto.optional(),
  precoPromo: Texto.optional().default(""),
  ofertaAte: Texto.optional().default(""),
});

/**
 * Salva um corte (novo ou existente) numa tela só.
 *
 * As mensagens falam a língua do açougue, não a do banco de dados: quem usa
 * isso é o dono ou o atendente, no meio do expediente.
 */
export async function salvarProduto(
  _anterior: RespostaAcao,
  formData: FormData,
): Promise<RespostaAcao> {
  await exigirSessao();

  const analise = Formulario.safeParse(Object.fromEntries(formData));
  if (!analise.success) {
    const primeiro = analise.error.issues[0];
    return falha(primeiro?.message ?? "Confira os campos.", String(primeiro?.path[0] ?? ""));
  }

  const dados = analise.data;

  const precoCentavos = analisarPreco(dados.preco);
  if (precoCentavos === null || precoCentavos <= 0) {
    return falha("O preço precisa ser um valor como 49,90.", "preco");
  }

  const emOferta = dados.emOferta === "on" || dados.emOferta === "true";
  let precoPromoCentavos: number | null = null;
  let ofertaAte: Date | null = null;

  if (emOferta) {
    precoPromoCentavos = dados.precoPromo ? analisarPreco(dados.precoPromo) : null;
    if (precoPromoCentavos === null || precoPromoCentavos <= 0) {
      return falha("Para colocar em oferta, informe o preço promocional.", "precoPromo");
    }
    if (precoPromoCentavos >= precoCentavos) {
      return falha(
        "O preço da oferta precisa ser menor que o preço normal.",
        "precoPromo",
      );
    }
    if (dados.ofertaAte) {
      const data = new Date(`${dados.ofertaAte}T23:59:59`);
      if (Number.isNaN(data.getTime())) {
        return falha("A data de validade da oferta não é válida.", "ofertaAte");
      }
      ofertaAte = data;
    }
  }

  // Kit sempre é vendido por peça: meio kit não existe.
  const unidade = dados.tipo === "kit" ? "un" : dados.unidade;

  // Composição do kit vem em dois campos paralelos do formulário.
  const componentes = formData
    .getAll("kitProdutoId")
    .map((valor, indice) => ({
      produtoId: Number(valor),
      quantidade: Number(
        String(formData.getAll("kitQuantidade")[indice] ?? "").replace(",", "."),
      ),
    }))
    .filter((x) => Number.isInteger(x.produtoId) && x.produtoId > 0 && x.quantidade > 0);

  if (dados.tipo === "kit" && componentes.length === 0) {
    return falha(
      "Um kit precisa de pelo menos um corte na composição — o cliente tem que saber o que está levando.",
      "kit",
    );
  }

  const valores = {
    nome: dados.nome,
    categoria: dados.categoria,
    tipo: dados.tipo,
    precoCentavos,
    unidade,
    descricao: dados.descricao || null,
    imagemUrl: dados.imagemUrl || null,
    imagemPublicId: dados.imagemPublicId || null,
    disponivel: dados.disponivel === "on" || dados.disponivel === "true",
    emOferta,
    precoPromoCentavos,
    ofertaAte,
  };

  try {
    let idSalvo: number;

    if (dados.id) {
      const id = Number(dados.id);
      if (!Number.isInteger(id)) return falha("Produto não encontrado.");
      const atualizado = await atualizarProduto(id, valores);
      if (!atualizado) return falha("Esse produto não existe mais.");
      idSalvo = atualizado.id;
    } else {
      const criado = await criarProduto(valores);
      idSalvo = criado.id;
    }

    if (dados.tipo === "kit") {
      await salvarItensDoKit(idSalvo, componentes);
    } else {
      // Deixou de ser kit: a composição antiga não pode ficar pendurada.
      await excluirItensDoKit(idSalvo);
    }
  } catch {
    return falha("Não deu para salvar agora. Tente de novo em instantes.");
  }

  revalidarTudo();
  redirect("/admin/produtos?salvo=1");
}

export async function apagarProduto(formData: FormData): Promise<void> {
  await exigirSessao();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await excluirItensDoKit(id);
  await excluirProduto(id);
  revalidarTudo();
  redirect("/admin/produtos?apagado=1");
}

const OPERACOES = ["disponibilizar", "indisponibilizar", "encerrar_oferta"] as const;

/** Ação em massa: o dono marca vários cortes e resolve tudo de uma vez. */
export async function acaoEmMassa(
  _anterior: RespostaAcao,
  formData: FormData,
): Promise<RespostaAcao> {
  await exigirSessao();

  const operacao = String(formData.get("operacao") ?? "");
  if (!OPERACOES.includes(operacao as (typeof OPERACOES)[number])) {
    return falha("Escolha o que fazer com os itens marcados.");
  }

  const ids = formData
    .getAll("ids")
    .map((valor) => Number(valor))
    .filter((valor) => Number.isInteger(valor));

  if (ids.length === 0) return falha("Marque pelo menos um produto.");

  try {
    let total = 0;
    let texto = "";
    if (operacao === "disponibilizar") {
      total = await definirDisponibilidade(ids, true);
      texto = "voltaram para a vitrine";
    } else if (operacao === "indisponibilizar") {
      total = await definirDisponibilidade(ids, false);
      texto = "saíram da vitrine";
    } else {
      total = await encerrarOfertas(ids);
      texto = "saíram da oferta";
    }

    revalidarTudo();
    return sucesso(`${total} produto(s) ${texto}.`);
  } catch {
    return falha("Não deu para aplicar a alteração agora.");
  }
}
