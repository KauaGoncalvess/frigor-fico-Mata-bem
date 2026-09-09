"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EMPRESA } from "@/conteudo/empresa";
import { CTA_COMERCIAL, MENU, WHATSAPP } from "@/conteudo/navegacao";
import { cn } from "@/lib/cn";

/**
 * Cabeçalho fixo.
 *
 * Transparente sobre o hero e sólido depois — assim a foto de abertura não
 * disputa espaço com a navegação. No celular vira logo + hambúrguer + o botão
 * de contato direto, que é o que interessa a quem está com o telefone na mão.
 */
export function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const rota = usePathname();

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Trocar de página fecha o menu; senão ele fica aberto por cima do destino.
  useEffect(() => setAberto(false), [rota]);

  // Com o menu aberto a página atrás não deve rolar junto.
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-96 transition-colors duration-500",
        rolou || aberto
          ? "border-b border-osso/12 bg-noite-950/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-[clamp(18px,5vw,60px)] py-4">
        <Link href="/" className="font-display text-[clamp(20px,3vw,26px)] leading-none whitespace-nowrap">
          {EMPRESA.nome}
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {MENU.map((item) => {
              const ativo = item.href === "/" ? rota === "/" : rota.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={ativo ? "page" : undefined}
                    className={cn(
                      "rotulo transition-colors",
                      ativo ? "text-terra-500" : "text-osso/65 hover:text-osso",
                    )}
                  >
                    {item.rotulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={CTA_COMERCIAL.href}
            className="rotulo hidden border border-osso/30 px-4 py-2.5 text-osso transition-colors hover:border-terra-500 hover:bg-terra-500 sm:inline-block"
          >
            {CTA_COMERCIAL.rotulo} →
          </Link>

          {/* No celular o contato direto vem antes de qualquer navegação. */}
          <a
            href={WHATSAPP.href}
            className="rotulo border border-terra-500 bg-terra-500 px-4 py-2.5 text-noite-950 sm:hidden"
          >
            {WHATSAPP.numero ? "WhatsApp" : "Ligar"}
          </a>

          <button
            type="button"
            onClick={() => setAberto((estava) => !estava)}
            aria-expanded={aberto}
            aria-controls="menu-celular"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              className={cn(
                "block h-px w-5 bg-osso transition-transform duration-300",
                aberto && "translate-y-[6px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-px w-5 bg-osso transition-opacity duration-300",
                aberto && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-px w-5 bg-osso transition-transform duration-300",
                aberto && "-translate-y-[6px] -rotate-45",
              )}
            />
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        hidden={!aberto}
        className="border-t border-osso/12 bg-noite-950/95 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Principal (celular)" className="px-[clamp(18px,5vw,60px)] py-6">
          <ul className="flex flex-col">
            {MENU.map((item) => (
              <li key={item.href} className="border-b border-osso/10 last:border-b-0">
                <Link
                  href={item.href}
                  className="block py-4 font-display text-[26px] leading-tight text-osso"
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={CTA_COMERCIAL.href}
            className="rotulo mt-6 block border border-terra-500 bg-terra-500 px-4 py-4 text-center text-noite-950"
          >
            {CTA_COMERCIAL.rotulo} →
          </Link>
        </nav>
      </div>
    </header>
  );
}
