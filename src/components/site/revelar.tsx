"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

// useLayoutEffect avisa no servidor; no cliente é ele quem evita o piscar.
const useEfeitoDeLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Revela o bloco quando ele entra na tela: sobe 30px e ganha opacidade.
 *
 * O bloco nasce VISÍVEL no HTML, e é o script que o esconde antes de animar.
 * O contrário — marcar `opacity: 0` no markup — deixaria a página em branco
 * para quem tem JS bloqueado, para o rastreador de busca e na impressão.
 */
export function Revelar({
  children,
  atraso = 0,
  className,
}: {
  children: ReactNode;
  atraso?: number;
  className?: string;
}) {
  const alvo = useRef<HTMLDivElement>(null);

  useEfeitoDeLayout(() => {
    const elemento = alvo.current;
    if (!elemento) return;

    // Quem pediu menos movimento recebe o conteúdo já posicionado.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    elemento.style.transition = `opacity 1s var(--ease-cinema) ${atraso}s, transform 1s var(--ease-cinema) ${atraso}s`;
    elemento.style.opacity = "0";
    elemento.style.transform = "translateY(30px)";

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          elemento.style.opacity = "1";
          elemento.style.transform = "none";
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, [atraso]);

  return (
    <div ref={alvo} className={className}>
      {children}
    </div>
  );
}
