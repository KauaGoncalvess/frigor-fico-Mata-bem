import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Database,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  ReceiptText,
  Store,
  Tag,
  Users,
} from "lucide-react";
import { apagarCookieSessao } from "@/lib/auth/sessao";
import { exigirSessao } from "@/lib/admin/guarda";
import { bancoConfigurado } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { default: "Painel", template: "%s · Painel" },
  robots: { index: false, follow: false },
};

const MENU = [
  { href: "/admin", rotulo: "Início", icone: LayoutDashboard },
  { href: "/admin/produtos", rotulo: "Produtos", icone: Store },
  { href: "/admin/ofertas", rotulo: "Ofertas", icone: Tag },
  { href: "/admin/pedidos", rotulo: "Pedidos", icone: ReceiptText },
  { href: "/admin/contatos", rotulo: "Contatos", icone: Users },
  { href: "/admin/campanhas", rotulo: "Campanhas", icone: Megaphone },
  { href: "/admin/loja", rotulo: "Minha loja", icone: Mail },
];

async function sair() {
  "use server";
  await apagarCookieSessao();
  redirect("/admin/login");
}

export default async function LayoutPainel({
  children,
}: {
  children: React.ReactNode;
}) {
  // Autorização de verdade: no servidor, antes de qualquer dado ser lido.
  const sessao = await exigirSessao();

  return (
    <div className="min-h-dvh bg-carvao-950">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-carvao-800 lg:min-h-dvh lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-5">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brasa-600 font-display text-lg font-bold text-white">
                M
              </span>
              <span className="leading-tight">
                <span className="block text-[14px] font-semibold text-creme">Painel</span>
                <span className="block text-[11px] text-creme-muted">{sessao.nome}</span>
              </span>
            </Link>

            <form action={sair}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg border border-carvao-700 px-2.5 py-2 text-[12px] font-semibold text-creme-muted transition hover:border-erro/50 hover:text-erro"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>

          <nav className="rolagem-oculta flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
            {MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-creme-muted transition hover:bg-carvao-850 hover:text-creme"
              >
                <item.icone size={16} />
                {item.rotulo}
              </Link>
            ))}
            <Link
              href="/"
              target="_blank"
              className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-ambar-400 transition hover:bg-carvao-850"
            >
              Ver a loja ↗
            </Link>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {!bancoConfigurado && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-alerta/40 bg-alerta/10 px-4 py-3">
              <Database size={17} className="mt-0.5 shrink-0 text-alerta" />
              <div className="text-[13px] leading-snug">
                <p className="font-semibold text-creme">Modo demonstração</p>
                <p className="text-creme-muted">
                  O banco de dados ainda não foi conectado. Você pode navegar e testar
                  tudo, mas as alterações somem quando o servidor reinicia. Configure a
                  variável <code className="text-ambar-400">DATABASE_URL</code> para valer
                  de verdade.
                </p>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
