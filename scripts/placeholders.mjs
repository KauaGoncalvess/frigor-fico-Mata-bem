/**
 * Gera os espaços de foto do site em public/placeholders/.
 *
 * As fotos definitivas serão feitas na própria unidade. Até lá cada espaço
 * precisa de três coisas: parecer decisão e não defeito, dizer que foto vai
 * ali, e não roubar a cor de acento da página — por isso grafite frio, e
 * nenhum marrom.
 *
 * Trocar por foto real é soltar um arquivo com o mesmo nome nesta pasta.
 *
 *   node scripts/placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DESTINO = join(process.cwd(), "public", "placeholders");

/**
 * Cada espaço: nome do arquivo, legenda, proporção e tema.
 *
 * Hero e CTA são de sangria e ficam atrás de texto: neles a legenda vira um
 * fantasma por trás do título, então saem com tema "limpo" — sem escrita.
 */
const ESPACOS = [
  ["hero", "Estrutura da unidade", 16, 9, "limpo"],
  ["institucional", "Planta e equipe", 4, 3],
  ["cta", "Unidade em operação", 16, 9, "limpo"],

  ["produto-cortes", "Cortes bovinos", 4, 3],
  ["produto-suinos", "Cortes suínos", 4, 3],
  ["produto-resfriados", "Carne resfriada", 4, 3],
  ["produto-congelados", "Carne congelada", 4, 3],
  ["produto-miudos", "Miúdos", 4, 3],
  ["produto-subprodutos", "Subprodutos", 4, 3],

  ["estrutura-planta", "Planta industrial", 4, 3],
  ["estrutura-linha", "Linha de produção", 4, 3],
  ["estrutura-camaras", "Câmaras frias", 4, 3],
  ["estrutura-expedicao", "Expedição", 4, 3],
  ["estrutura-controle", "Controle de qualidade", 4, 3],
  ["estrutura-equipe", "Equipe", 4, 3],

  // A galeria Wagyu fica sobre o linho. Placeholder escuro ali vira buraco
  // preto e rouba a seção inteira — por isso estes três saem claros.
  ["wagyu-1", "Rebanho", 4, 3, "claro"],
  ["wagyu-2", "Pastagem", 4, 3, "claro"],
  ["wagyu-3", "Suínos", 4, 3, "claro"],
];

/** Hash estável do nome: seis espaços lado a lado não podem sair idênticos. */
function semente(texto) {
  let h = 2166136261;
  for (const letra of texto) {
    h ^= letra.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const escapar = (texto) =>
  texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svg(nome, legenda, propW, propH, tema = "escuro") {
  const s = semente(nome);
  const largura = 1200;
  const altura = Math.round((largura * propH) / propW);

  // Grafite frio, variando pouco: presença suficiente para ler como espaço
  // reservado, sem nenhum marrom disputando com o acento terracota.
  const sobreClaro = tema === "claro";
  const comLegenda = tema !== "limpo";
  const base = sobreClaro ? 196 + (s % 10) : 16 + (s % 7);
  const fundo = sobreClaro ? 176 + (s % 8) : 8 + (s % 4);
  const tomClaro = `rgb(${base + 1},${base - 2},${base - 7})`;
  const tomEscuro = `rgb(${fundo},${fundo - 3},${fundo - 9})`;
  const tinta = sobreClaro ? "#14120f" : "#f0e9dd";
  const veu = sobreClaro ? "#000000" : "#ffffff";

  const angulo = (s % 4) * 30 + 15; // 15, 45, 75 ou 105 graus
  const focoX = 24 + (s % 5) * 13; // 24..76
  const focoY = 22 + ((s >> 3) % 5) * 12; // 22..70

  const corpo = Math.max(15, Math.round(largura * 0.019));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largura} ${altura}" width="${largura}" height="${altura}" role="img" aria-label="${escapar(legenda)}">
  <defs>
    <linearGradient id="base" gradientTransform="rotate(${angulo})">
      <stop offset="0%" stop-color="${tomClaro}"/>
      <stop offset="100%" stop-color="${tomEscuro}"/>
    </linearGradient>
    <radialGradient id="foco" cx="${focoX}%" cy="${focoY}%" r="78%">
      <stop offset="0%" stop-color="${veu}" stop-opacity=".07"/>
      <stop offset="100%" stop-color="${veu}" stop-opacity="0"/>
    </radialGradient>
    <filter id="grao">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="4"/>
    </filter>
  </defs>

  <rect width="${largura}" height="${altura}" fill="url(#base)"/>
  <rect width="${largura}" height="${altura}" fill="url(#foco)"/>
  <rect width="${largura}" height="${altura}" filter="url(#grao)" opacity=".05"/>

  <rect x=".5" y=".5" width="${largura - 1}" height="${altura - 1}" fill="none"
        stroke="${tinta}" stroke-opacity=".14"/>

${
    comLegenda
      ? `  <g fill="${tinta}" fill-opacity=".42"
     font-family="'Space Grotesk',system-ui,sans-serif" font-size="${corpo}"
     font-weight="500" letter-spacing="${(corpo * 0.22).toFixed(1)}"
     text-anchor="middle">
    <text x="${largura / 2}" y="${altura / 2 + corpo / 3}">${escapar(legenda.toUpperCase())}</text>
  </g>`
      : ""
  }
</svg>
`;
}

mkdirSync(DESTINO, { recursive: true });

for (const [nome, legenda, propW, propH, tema] of ESPACOS) {
  writeFileSync(join(DESTINO, `${nome}.svg`), svg(nome, legenda, propW, propH, tema));
}

console.log(`${ESPACOS.length} espaços de foto gerados em public/placeholders/`);
