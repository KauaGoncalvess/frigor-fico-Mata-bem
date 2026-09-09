"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Os elementos fixos que emolduram a página: grão de filme, barra de progresso
 * da leitura e o indicador do capítulo atual. A navegação é do cabeçalho.
 *
 * Tudo num só componente porque compartilham o mesmo listener de rolagem —
 * throttled em requestAnimationFrame para não disputar quadro com o parallax.
 */
export function Cromados() {
  const [progresso, setProgresso] = useState(0);
  const [capitulo, setCapitulo] = useState("00 · Abertura");
  const quadro = useRef<number | null>(null);

  useEffect(() => {
    const aoRolar = () => {
      if (quadro.current !== null) return;
      quadro.current = requestAnimationFrame(() => {
        quadro.current = null;

        const doc = document.documentElement;
        const altura = window.innerHeight;
        const percurso = doc.scrollHeight - altura;
        const y = doc.scrollTop || window.scrollY;
        setProgresso(percurso > 0 ? Math.min(100, (y / percurso) * 100) : 0);

        // O capítulo vigente é o último cujo topo já passou de 45% da tela.
        let atual: string | null = null;
        document.querySelectorAll<HTMLElement>("[data-ch]").forEach((secao) => {
          if (secao.getBoundingClientRect().top <= altura * 0.45) {
            atual = secao.dataset.ch ?? null;
          }
        });
        if (atual) setCapitulo(atual);
      });
    };

    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    aoRolar();

    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      if (quadro.current !== null) cancelAnimationFrame(quadro.current);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="grao pointer-events-none fixed inset-0 z-90 opacity-40 mix-blend-soft-light"
      />

      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-95 h-0.5 bg-osso/10"
      >
        <div
          className="h-full bg-terra-500 transition-[width] duration-100 ease-linear"
          style={{ width: `${progresso}%` }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed bottom-[22px] left-[clamp(14px,3vw,34px)] z-92 flex items-center gap-2.5"
      >
        <span className="h-[5px] w-[5px] animate-[piscar_2.6s_ease-in-out_infinite] rounded-full bg-terra-500" />
        <span className="rotulo text-osso/60 mix-blend-difference">{capitulo}</span>
      </div>

    </>
  );
}
