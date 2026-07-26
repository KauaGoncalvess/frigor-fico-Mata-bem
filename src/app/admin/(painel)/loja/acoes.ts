"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { exigirSessao, falha, sucesso, type RespostaAcao } from "@/lib/admin/guarda";
import { somenteDigitos } from "@/lib/format";
import { salvarConfig } from "@/lib/repo/config";

const Texto = z.string().trim();

const OpcionalUrl = Texto.max(300)
  .optional()
  .default("")
  .refine(
    (valor) => valor === "" || /^https?:\/\//i.test(valor),
    "Os links precisam começar com https://",
  );

const Formulario = z.object({
  nome: Texto.min(2, "Escreva o nome da loja.").max(120),
  whatsapp: Texto.min(8, "Informe o WhatsApp com DDD."),
  endereco: Texto.min(5, "Escreva o endereço da loja.").max(240),
  horario: Texto.min(3, "Escreva o horário de funcionamento.").max(240),
  telefone: Texto.max(40).optional().default(""),
  instagram: OpcionalUrl,
  facebook: OpcionalUrl,
  mapsUrl: OpcionalUrl,
  entregaTexto: Texto.max(240).optional().default(""),
});

export async function salvarDadosDaLoja(
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

  // wa.me só aceita número puro com país. Guardamos já no formato certo para
  // não depender de o dono digitar bonitinho.
  let whatsapp = somenteDigitos(dados.whatsapp);
  if (whatsapp.length < 10) {
    return falha("O WhatsApp precisa ter DDD e número. Ex: (11) 99999-9999.", "whatsapp");
  }
  if (!whatsapp.startsWith("55")) whatsapp = `55${whatsapp}`;

  try {
    await salvarConfig({
      nome: dados.nome,
      whatsapp,
      endereco: dados.endereco,
      horario: dados.horario,
      telefone: dados.telefone || null,
      instagram: dados.instagram || null,
      facebook: dados.facebook || null,
      mapsUrl: dados.mapsUrl || null,
      entregaTexto: dados.entregaTexto || null,
    });
  } catch {
    return falha("Não deu para salvar agora. Tente de novo em instantes.");
  }

  revalidatePath("/");
  revalidatePath("/admin/loja");
  return sucesso("Dados da loja salvos com sucesso.");
}
