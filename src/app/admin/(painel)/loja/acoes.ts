"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { exigirSessao, falha, sucesso, type RespostaAcao } from "@/lib/admin/guarda";
import type { HorarioDia } from "@/lib/db/schema";
import { analisarPreco, somenteDigitos } from "@/lib/format";
import { horaValida, textoDosHorarios } from "@/lib/horario";
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
  telefone: Texto.max(40).optional().default(""),
  instagram: OpcionalUrl,
  facebook: OpcionalUrl,
  mapsUrl: OpcionalUrl,
  entregaAtiva: Texto.optional(),
  entregaTexto: Texto.max(240).optional().default(""),
  taxaEntrega: Texto.optional().default(""),
  pedidoMinimo: Texto.optional().default(""),
});

/** Lê os 7 dias do formulário e valida cada janela. */
function lerHorarios(formData: FormData): { horarios: HorarioDia[]; erro: string | null } {
  const horarios: HorarioDia[] = [];

  for (let dia = 0; dia < 7; dia += 1) {
    const fechado = formData.get(`fechado_${dia}`) === "on";
    const abre = String(formData.get(`abre_${dia}`) ?? "").trim();
    const fecha = String(formData.get(`fecha_${dia}`) ?? "").trim();

    if (fechado) {
      horarios.push({ dia, fechado: true, abre: abre || "08:00", fecha: fecha || "18:00" });
      continue;
    }

    if (!horaValida(abre) || !horaValida(fecha)) {
      return { horarios: [], erro: "Preencha os horários no formato 08:00." };
    }
    if (abre >= fecha) {
      return {
        horarios: [],
        erro: "Em algum dia o horário de fechar é anterior ao de abrir. Confira a grade.",
      };
    }

    horarios.push({ dia, fechado: false, abre, fecha });
  }

  return { horarios, erro: null };
}

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

  const { horarios, erro } = lerHorarios(formData);
  if (erro) return falha(erro, "horarios");

  const entregaAtiva = dados.entregaAtiva === "on" || dados.entregaAtiva === "true";

  const taxaEntregaCentavos = dados.taxaEntrega ? analisarPreco(dados.taxaEntrega) : null;
  if (dados.taxaEntrega && taxaEntregaCentavos === null) {
    return falha("A taxa de entrega precisa ser um valor como 8,00.", "taxaEntrega");
  }

  const pedidoMinimoCentavos = dados.pedidoMinimo ? analisarPreco(dados.pedidoMinimo) : null;
  if (dados.pedidoMinimo && pedidoMinimoCentavos === null) {
    return falha("O pedido mínimo precisa ser um valor como 60,00.", "pedidoMinimo");
  }

  try {
    await salvarConfig({
      nome: dados.nome,
      whatsapp,
      endereco: dados.endereco,
      // Mantém o texto legível em sincronia com a grade, para quem lê o rodapé
      // e para o fallback de quem consumir só este campo.
      horario: textoDosHorarios(horarios),
      horarios,
      telefone: dados.telefone || null,
      instagram: dados.instagram || null,
      facebook: dados.facebook || null,
      mapsUrl: dados.mapsUrl || null,
      entregaAtiva,
      entregaTexto: dados.entregaTexto || null,
      taxaEntregaCentavos,
      pedidoMinimoCentavos,
    });
  } catch {
    return falha("Não deu para salvar agora. Tente de novo em instantes.");
  }

  revalidatePath("/");
  revalidatePath("/admin/loja");

  return sucesso(
    entregaAtiva
      ? "Dados salvos. A entrega está ligada e já aparece na loja."
      : "Dados salvos. A loja está funcionando só com retirada no local.",
  );
}
