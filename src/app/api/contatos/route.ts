import { NextResponse } from "next/server";
import { z } from "zod";
import { somenteDigitos } from "@/lib/format";
import { inscreverContato } from "@/lib/repo/contatos";
import { ipDaRequisicao, limitar } from "@/lib/seguranca/rate-limit";

const Entrada = z.object({
  nome: z.string().trim().min(2, "Informe seu nome.").max(80),
  email: z.string().trim().email("E-mail inválido.").max(160),
  consentimento: z.literal(true, {
    message: "É preciso autorizar o envio das ofertas.",
  }),
  /** Opcional: só serve se vier junto do consentimento de WhatsApp. */
  telefone: z.string().trim().max(30).optional().default(""),
  consentimentoWhatsapp: z.boolean().optional().default(false),
  isca: z.string().optional().default(""),
  tempoNaPagina: z.number().optional().default(0),
});

export async function POST(req: Request) {
  const ip = ipDaRequisicao(req);

  // 5 cadastros por IP a cada 10 minutos: sobra para uma família, não para um bot.
  const limite = await limitar(`contato:${ip}`, 5, 600);
  if (!limite.permitido) {
    return NextResponse.json(
      { mensagem: "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo." },
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
    return NextResponse.json(
      { mensagem: analise.error.issues[0]?.message ?? "Confira os dados informados." },
      { status: 400 },
    );
  }

  const { nome, email, isca, tempoNaPagina, consentimentoWhatsapp } = analise.data;

  // Telefone brasileiro com DDD: 10 ou 11 dígitos (com ou sem o 55 na frente).
  const digitos = somenteDigitos(analise.data.telefone).replace(/^55/, "");
  const telefoneValido = digitos.length === 10 || digitos.length === 11;

  if (consentimentoWhatsapp && analise.data.telefone && !telefoneValido) {
    return NextResponse.json(
      { mensagem: "Confira o telefone: informe DDD e número." },
      { status: 400 },
    );
  }

  // Sem o consentimento específico o telefone é descartado aqui mesmo.
  const telefone =
    consentimentoWhatsapp && telefoneValido ? `55${digitos}` : null;

  // Anti-spam: campo isca preenchido, ou formulário enviado rápido demais para
  // alguém ter digitado. Responde como sucesso para não ensinar o bot.
  if (isca.trim() !== "" || tempoNaPagina < 1500) {
    return NextResponse.json({ mensagem: "Pronto! Você entrou na lista." });
  }

  try {
    const resultado = await inscreverContato({
      nome,
      email,
      origem: "site",
      telefone,
      consentimentoWhatsapp: Boolean(telefone),
    });
    const mensagem =
      resultado === "ja_inscrito"
        ? "Você já está na nossa lista. Fique de olho no e-mail!"
        : "Pronto! Você entrou na lista das ofertas da semana.";
    return NextResponse.json({ mensagem });
  } catch {
    return NextResponse.json(
      { mensagem: "Não conseguimos cadastrar agora. Tente de novo em instantes." },
      { status: 500 },
    );
  }
}
