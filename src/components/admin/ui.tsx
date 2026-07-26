import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function CabecalhoPagina({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{titulo}</h1>
        {descricao && (
          <p className="mt-1 max-w-xl text-[13.5px] leading-snug text-creme-muted">
            {descricao}
          </p>
        )}
      </div>
      {acao}
    </header>
  );
}

/** Confirmação visível depois de salvar — o dono precisa ver que deu certo. */
export function AvisoSucesso({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 flex items-center gap-2 rounded-xl border border-sucesso/40 bg-sucesso/10 px-4 py-3 text-[13.5px] text-creme">
      <CheckCircle2 size={17} className="shrink-0 text-sucesso" />
      {children}
    </p>
  );
}

export function BotaoPrimario({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-11 items-center justify-center gap-2 rounded-xl bg-brasa-600 px-5 text-[13.5px] font-bold text-white transition hover:bg-brasa-500 active:scale-[0.99]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Cartao({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-carvao-800 bg-carvao-900 p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Estatistica({
  rotulo,
  valor,
  detalhe,
  tom = "neutro",
}: {
  rotulo: string;
  valor: string | number;
  detalhe?: string;
  tom?: "neutro" | "alerta" | "bom";
}) {
  return (
    <Cartao>
      <p className="text-[11.5px] font-semibold uppercase tracking-wider text-creme-muted">
        {rotulo}
      </p>
      <p
        className={cn(
          "mt-1.5 font-display text-3xl font-semibold",
          tom === "alerta" && "text-alerta",
          tom === "bom" && "text-sucesso",
          tom === "neutro" && "text-creme",
        )}
      >
        {valor}
      </p>
      {detalhe && <p className="mt-1 text-[12px] text-creme-muted">{detalhe}</p>}
    </Cartao>
  );
}

export function VazioEstado({
  titulo,
  texto,
  acao,
}: {
  titulo: string;
  texto: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-carvao-700 bg-carvao-900/50 px-6 py-14 text-center">
      <p className="font-display text-xl font-semibold text-creme">{titulo}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] leading-snug text-creme-muted">
        {texto}
      </p>
      {acao && <div className="mt-5 flex justify-center">{acao}</div>}
    </div>
  );
}
