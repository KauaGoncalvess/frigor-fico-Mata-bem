import { redirect } from "next/navigation";
import { sessaoAtual } from "@/lib/auth/sessao";
import { FormularioLogin } from "./formulario";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Entrar no painel",
  robots: { index: false, follow: false },
};

export default async function PaginaLogin({
  searchParams,
}: {
  searchParams: Promise<{ proximo?: string }>;
}) {
  const { proximo } = await searchParams;

  // Já logado não precisa ver tela de login.
  if (await sessaoAtual()) redirect("/admin");

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, rgba(122,20,36,0.30) 0%, transparent 65%)",
        }}
      />

      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brasa-600 font-display text-xl font-bold text-white">
            M
          </span>
          <h1 className="mt-4 text-2xl font-semibold">Painel da loja</h1>
          <p className="mt-1 text-sm text-creme-muted">
            Entre para cuidar dos cortes, preços e ofertas.
          </p>
        </div>

        <FormularioLogin proximo={proximo ?? "/admin"} />
      </div>
    </main>
  );
}
