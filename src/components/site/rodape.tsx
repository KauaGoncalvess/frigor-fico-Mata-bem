import Link from "next/link";
import { EMPRESA } from "@/conteudo/empresa";
import { RODAPE } from "@/conteudo/navegacao";

/**
 * Rodapé institucional em quatro colunas. Fecha a página com o que um
 * comprador procura quando desce até o fim: como falar com alguém, e quem
 * é a empresa no papel.
 */
export function Rodape() {
  return (
    <footer className="border-t border-osso/12 bg-noite-950">
      <div className="mx-auto max-w-[1240px] px-[clamp(18px,5vw,60px)] py-[clamp(40px,5vw,72px)]">
        <div className="grid gap-[clamp(28px,3.4vw,48px)] [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          {RODAPE.map((coluna) => (
            <nav key={coluna.titulo} aria-label={coluna.titulo}>
              <h2 className="rotulo mb-4 text-osso/45">{coluna.titulo}</h2>
              <ul className="flex flex-col gap-2.5">
                {coluna.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-osso/80 transition-colors hover:text-terra-500"
                    >
                      {link.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="rotulo mb-4 text-osso/45">Contato</h2>
            <ul className="flex flex-col gap-2.5 text-[15px]">
              <li>
                <a
                  href={EMPRESA.telefoneLink}
                  className="text-osso/80 transition-colors hover:text-terra-500"
                >
                  {EMPRESA.telefone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMPRESA.email}`}
                  className="break-all text-osso/80 transition-colors hover:text-terra-500"
                >
                  {EMPRESA.email}
                </a>
              </li>
              <li className="leading-[1.6] text-osso/60">
                {EMPRESA.endereco.linha1}
                <br />
                {EMPRESA.endereco.linha2}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-[clamp(32px,4vw,56px)] flex flex-wrap items-baseline justify-between gap-x-[30px] gap-y-3.5 border-t border-osso/12 pt-7">
          <span className="font-display text-[22px]">{EMPRESA.nome}</span>
          <span className="rotulo text-osso/40" style={{ letterSpacing: ".18em" }}>
            {EMPRESA.razaoSocial} · CNPJ {EMPRESA.cnpj}
          </span>
        </div>
      </div>
    </footer>
  );
}
