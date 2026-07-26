import { NextResponse } from "next/server";
import { z } from "zod";
import { inscreverContato } from "@/lib/repo/contatos";
import { ipDaRequisicao, limitar } from "@/lib/seguranca/rate-limit";

const Entrada = z.object({
  nome: z.string().trim().min(2, "Informe seu nome.").max(80),
  email: z.string().trim().email("E-mail inválido.").max(160),
  consentimento: z.literal(true, {
    message: "É preciso autorizar o envio das ofertas.",
  }),
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

  const { nome, email, isca, tempoNaPagina } = analise.data;

  // Anti-spam: campo isca preenchido, ou formulário enviado rápido demais para
  // alguém ter digitado. Responde como sucesso para não ensinar o bot.
  if (isca.trim() !== "" || tempoNaPagina < 1500) {
    return NextResponse.json({ mensagem: "Pronto! Você entrou na lista." });
  }

  try {
    const resultado = await inscreverContato({ nome, email, origem: "site" });
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
