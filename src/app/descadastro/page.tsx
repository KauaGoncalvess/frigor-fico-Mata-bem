import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { descadastrarPorToken } from "@/lib/repo/contatos";
import { obterConfig } from "@/lib/repo/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cancelar recebimento",
  robots: { index: false, follow: false },
};

/**
 * Descadastro por token — exigido pela LGPD e pelo cabeçalho List-Unsubscribe.
 * Sem login e sem pedir o e-mail: o token do link já identifica a pessoa.
 */
export default async function PaginaDescadastro({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const config = await obterConfig();
  const contato = token ? await descadastrarPorToken(token) : null;
  const sucesso = Boolean(contato);

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-16">
      <div className="w-full max-w-md rounded-card border border-carvao-700 bg-carvao-900 p-8 text-center">
        <span
          className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${
            sucesso ? "bg-sucesso/15 text-sucesso" : "bg-erro/15 text-erro"
          }`}
        >
          {sucesso ? <CheckCircle2 size={26} /> : <XCircle size={26} />}
        </span>

        <h1 className="mt-5 text-2xl font-semibold">
          {sucesso ? "Pronto, cancelamos" : "Link inválido"}
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-creme-muted">
          {sucesso ? (
            <>
              O e-mail <strong className="text-creme">{contato!.email}</strong> não vai mais
              receber nossas ofertas. Se mudar de ideia, é só se cadastrar de novo no site.
            </>
          ) : (
            <>
              Este link de cancelamento não é válido ou já foi usado. Se continuar recebendo
              nossos e-mails, fale com a gente que resolvemos na hora.
            </>
          )}
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-brasa-600 px-6 text-sm font-bold text-white transition hover:bg-brasa-500"
        >
          Voltar para {config.nome}
        </Link>
      </div>
    </main>
  );
}
