"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { exigirSessao, falha, sucesso, type RespostaAcao } from "@/lib/admin/guarda";
import { CATEGORIAS } from "@/lib/db/schema";
import { analisarPreco } from "@/lib/format";
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
  preco: Texto.min(1, "Informe o preço por quilo."),
  unidade: Texto.default("kg"),
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

  const valores = {
    nome: dados.nome,
    categoria: dados.categoria,
    precoCentavos,
    unidade: dados.unidade || "kg",
    descricao: dados.descricao || null,
    imagemUrl: dados.imagemUrl || null,
    imagemPublicId: dados.imagemPublicId || null,
    disponivel: dados.disponivel === "on" || dados.disponivel === "true",
    emOferta,
    precoPromoCentavos,
    ofertaAte,
  };

  try {
    if (dados.id) {
      const id = Number(dados.id);
      if (!Number.isInteger(id)) return falha("Produto não encontrado.");
      const atualizado = await atualizarProduto(id, valores);
      if (!atualizado) return falha("Esse produto não existe mais.");
    } else {
      await criarProduto(valores);
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
