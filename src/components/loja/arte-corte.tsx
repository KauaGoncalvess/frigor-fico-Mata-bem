import { cn } from "@/lib/cn";

/**
 * Arte de fallback para produto sem foto.
 *
 * Existe para que catálogo recém-cadastrado não fique com buraco cinza de
 * "imagem quebrada": cada categoria ganha uma composição de corte marmorizado
 * com sua própria temperatura de cor. Quando o dono sobe a foto real no
 * Cloudinary, a foto assume o lugar.
 */

const TONS: Record<string, { de: string; para: string; carne: string; gordura: string }> = {
  bovino: { de: "#3a1218", para: "#170a0b", carne: "#8e1f2c", gordura: "#f0dfc8" },
  suino: { de: "#3c1c1a", para: "#180c0b", carne: "#b8555a", gordura: "#f4e6d4" },
  aves: { de: "#3a2a12", para: "#170f08", carne: "#d69a4e", gordura: "#f7ecd8" },
  embutidos: { de: "#37150f", para: "#160907", carne: "#a83a22", gordura: "#eeddc4" },
};

/** Ruído determinístico: mesma peça sempre desenha igual, peças diferentes variam. */
function variar(semente: number, minimo: number, maximo: number, sal: number): number {
  const x = Math.sin((semente + 1) * 12.9898 + sal * 78.233) * 43758.5453;
  const fracao = x - Math.floor(x);
  return minimo + fracao * (maximo - minimo);
}

export function ArteCorte({
  categoria,
  semente = 0,
  className,
}: {
  categoria: string;
  /** Normalmente o id do produto — evita que o catálogo vire um carimbo repetido. */
  semente?: number;
  className?: string;
}) {
  const tom = TONS[categoria] ?? TONS.bovino;
  const id = `arte-${categoria}-${semente}`;

  const giro = variar(semente, -12, 12, 1);
  const escala = variar(semente, 0.92, 1.12, 2);
  const deslocaX = variar(semente, -8, 8, 3);
  const deslocaY = variar(semente, -5, 5, 4);
  const giroMarmoreio = variar(semente, -6, 6, 5);

  return (
    <svg
      viewBox="0 0 160 120"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-fundo`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={tom.de} />
          <stop offset="100%" stopColor={tom.para} />
        </linearGradient>
        <radialGradient id={`${id}-carne`} cx="42%" cy="35%" r="75%">
          <stop offset="0%" stopColor={tom.carne} stopOpacity="0.95" />
          <stop offset="100%" stopColor={tom.para} stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id={`${id}-brilho`} cx="30%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="160" height="120" fill={`url(#${id}-fundo)`} />

      {/* Corte: massa orgânica com capa de gordura e marmoreio */}
      <g
        transform={`translate(${80 + deslocaX} ${60 + deslocaY}) rotate(${giro}) scale(${escala})`}
      >
        <path
          d="M -46 -6 C -50 -30, -26 -44, 2 -42 C 30 -40, 50 -28, 50 -6 C 50 18, 28 34, 0 34 C -28 34, -42 18, -46 -6 Z"
          fill={`url(#${id}-carne)`}
        />
        <path
          d="M -46 -6 C -50 -30, -26 -44, 2 -42 C 12 -41, 21 -39, 29 -36 C 14 -34, -2 -28, -14 -18 C -28 -6, -36 8, -38 22 C -44 14, -45 4, -46 -6 Z"
          fill={tom.gordura}
          opacity="0.5"
        />
        <g
          stroke={tom.gordura}
          strokeOpacity="0.42"
          strokeLinecap="round"
          fill="none"
          transform={`rotate(${giroMarmoreio})`}
        >
          <path d="M -24 -14 C -12 -20, 4 -18, 16 -8" strokeWidth="2.4" />
          <path d="M -18 4 C -4 -2, 14 2, 26 10" strokeWidth="1.8" />
          <path d="M -6 20 C 6 14, 22 16, 32 22" strokeWidth="1.4" />
          <path d="M 6 -28 C 18 -26, 30 -20, 38 -12" strokeWidth="1.6" />
        </g>
      </g>

      <rect width="160" height="120" fill={`url(#${id}-brilho)`} />
    </svg>
  );
}
