"use server";

import { revalidatePath } from "next/cache";
import { exigirSessao, falha, sucesso, type RespostaAcao } from "@/lib/admin/guarda";
import { analisarPreco } from "@/lib/format";
import { atualizarProduto, encerrarOfertas, obterProduto } from "@/lib/repo/produtos";

function revalidar() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/ofertas");
  revalidatePath("/admin/produtos");
}

/** Coloca um corte em oferta com preço e validade. */
export async function colocarEmOferta(
  _anterior: RespostaAcao,
  formData: FormData,
): Promise<RespostaAcao> {
  await exigirSessao();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return falha("Produto não encontrado.");

  const produto = await obterProduto(id);
  if (!produto) return falha("Esse produto não existe mais.");

  const precoPromoCentavos = analisarPreco(String(formData.get("precoPromo") ?? ""));
  if (precoPromoCentavos === null || precoPromoCentavos <= 0) {
    return falha(`Informe o preço da oferta de ${produto.nome} (ex: 39,90).`);
  }
  if (precoPromoCentavos >= produto.precoCentavos) {
    return falha(
      `A oferta de ${produto.nome} precisa ser menor que o preço normal.`,
    );
  }

  const textoData = String(formData.get("ofertaAte") ?? "").trim();
  let ofertaAte: Date | null = null;
  if (textoData) {
    const data = new Date(`${textoData}T23:59:59`);
    if (Number.isNaN(data.getTime())) return falha("A data de validade não é válida.");
    ofertaAte = data;
  }

  await atualizarProduto(id, { emOferta: true, precoPromoCentavos, ofertaAte });
  revalidar();
  return sucesso(`${produto.nome} entrou nas ofertas da semana.`);
}

export async function encerrarOferta(
  _anterior: RespostaAcao,
  formData: FormData,
): Promise<RespostaAcao> {
  await exigirSessao();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return falha("Produto não encontrado.");

  await encerrarOfertas([id]);
  revalidar();
  return sucesso("Oferta encerrada. O preço normal voltou na loja.");
}
