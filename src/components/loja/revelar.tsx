"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Revela o bloco quando ele entra na tela. `once` evita reanimar a cada
 * rolagem, e quem configurou "reduzir movimento" no sistema recebe o conteúdo
 * já posicionado, sem deslocamento.
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
  const semMovimento = useReducedMotion();

  if (semMovimento) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
