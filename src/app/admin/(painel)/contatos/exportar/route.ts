import { NextResponse } from "next/server";
import { sessaoAtual } from "@/lib/auth/sessao";
import { listarContatos } from "@/lib/repo/contatos";

export const dynamic = "force-dynamic";

/**
 * Escapa um campo para CSV.
 *
 * Além das aspas, neutraliza fórmula: Excel e LibreOffice executam células que
 * começam com = + - @. Um contato cadastrado como `=HYPERLINK(...)` viraria
 * código rodando na máquina do dono quando ele abrisse o arquivo.
 */
function campoCsv(valor: string | null | undefined): string {
  const texto = String(valor ?? "");
  const seguro = /^[=+\-@\t\r]/.test(texto) ? `'${texto}` : texto;
  return `"${seguro.replace(/"/g, '""')}"`;
}

export async function GET() {
  // O middleware já barra, mas a checagem aqui é a que realmente vale:
  // esta rota entrega a base de contatos inteira.
  const sessao = await sessaoAtual();
  if (!sessao) {
    return NextResponse.json({ mensagem: "Não autorizado." }, { status: 401 });
  }

  const contatos = await listarContatos();

  const linhas = [
    ["nome", "email", "consentimento", "data_consentimento", "origem", "situacao", "cadastro"]
      .map(campoCsv)
      .join(","),
    ...contatos.map((contato) =>
      [
        campoCsv(contato.nome),
        campoCsv(contato.email),
        campoCsv(contato.consentimento ? "sim" : "nao"),
        campoCsv(contato.consentimentoEm?.toISOString() ?? ""),
        campoCsv(contato.origem),
        campoCsv(contato.descadastradoEm ? "descadastrado" : "ativo"),
        campoCsv(contato.criadoEm.toISOString()),
      ].join(","),
    ),
  ];

  // BOM na frente: sem ele o Excel abre os acentos errados.
  const corpo = `﻿${linhas.join("\r\n")}`;
  const data = new Date().toISOString().slice(0, 10);

  return new NextResponse(corpo, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contatos-${data}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
