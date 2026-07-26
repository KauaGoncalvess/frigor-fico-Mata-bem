import type { HorarioDia } from "@/lib/db/schema";

/**
 * Aberto/fechado tem que ser calculado no fuso da LOJA, não no do visitante.
 * Quem abre o site viajando (ou com o relógio do celular errado) não pode ver
 * "fechado" numa terça de manhã.
 */
export const FUSO_LOJA = "America/Sao_Paulo";

export const NOMES_DIA = [
  "domingo",
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
] as const;

/** Semana típica de açougue — ponto de partida para o dono ajustar. */
export const HORARIO_PADRAO: HorarioDia[] = [
  { dia: 0, fechado: false, abre: "08:00", fecha: "13:00" },
  { dia: 1, fechado: false, abre: "08:00", fecha: "19:00" },
  { dia: 2, fechado: false, abre: "08:00", fecha: "19:00" },
  { dia: 3, fechado: false, abre: "08:00", fecha: "19:00" },
  { dia: 4, fechado: false, abre: "08:00", fecha: "19:00" },
  { dia: 5, fechado: false, abre: "08:00", fecha: "19:00" },
  { dia: 6, fechado: false, abre: "08:00", fecha: "18:00" },
];

const RELOGIO = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function horaValida(valor: string): boolean {
  return RELOGIO.test(valor.trim());
}

/** "08:30" -> 510 minutos desde a meia-noite. */
export function emMinutos(valor: string): number {
  const partes = RELOGIO.exec(valor.trim());
  if (!partes) return 0;
  return Number(partes[1]) * 60 + Number(partes[2]);
}

/** "08:00" -> "8h"; "08:30" -> "8h30" (jeito que se fala em português). */
export function horaLegivel(valor: string): string {
  const partes = RELOGIO.exec(valor.trim());
  if (!partes) return valor;
  const hora = Number(partes[1]);
  const minuto = partes[2];
  return minuto === "00" ? `${hora}h` : `${hora}h${minuto}`;
}

/** Momento atual convertido para o dia da semana e o minuto da loja. */
function momentoNaLoja(agora: Date, fuso: string): { dia: number; minutos: number } {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: fuso,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(agora);

  const pegar = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? "";

  const mapa: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const dia = mapa[pegar("weekday")] ?? 0;
  // Em algumas plataformas meia-noite sai como "24".
  const hora = Number(pegar("hour")) % 24;
  const minuto = Number(pegar("minute"));

  return { dia, minutos: hora * 60 + minuto };
}

export function normalizarHorarios(horarios: HorarioDia[] | null | undefined): HorarioDia[] {
  if (!horarios || horarios.length === 0) return [];
  return Array.from({ length: 7 }, (_, dia) => {
    const encontrado = horarios.find((h) => Number(h.dia) === dia);
    if (!encontrado) return { dia, fechado: true, abre: "08:00", fecha: "18:00" };
    return {
      dia,
      fechado: Boolean(encontrado.fechado),
      abre: horaValida(encontrado.abre) ? encontrado.abre : "08:00",
      fecha: horaValida(encontrado.fecha) ? encontrado.fecha : "18:00",
    };
  });
}

export type SituacaoLoja = {
  /** `null` quando a loja não preencheu o horário estruturado ainda. */
  aberta: boolean | null;
  /** Ex: "Fecha às 19h" ou "Abre amanhã às 8h". */
  detalhe: string;
};

export function situacaoDaLoja(
  horarios: HorarioDia[] | null | undefined,
  agora: Date = new Date(),
  fuso: string = FUSO_LOJA,
): SituacaoLoja {
  const semana = normalizarHorarios(horarios);
  if (semana.length === 0) return { aberta: null, detalhe: "" };

  const { dia, minutos } = momentoNaLoja(agora, fuso);
  const hoje = semana[dia]!;

  if (!hoje.fechado) {
    const abre = emMinutos(hoje.abre);
    const fecha = emMinutos(hoje.fecha);
    if (minutos >= abre && minutos < fecha) {
      return { aberta: true, detalhe: `Fecha às ${horaLegivel(hoje.fecha)}` };
    }
    if (minutos < abre) {
      return { aberta: false, detalhe: `Abre hoje às ${horaLegivel(hoje.abre)}` };
    }
  }

  // Já passou do horário de hoje (ou hoje é fechado): procura o próximo dia.
  for (let adiante = 1; adiante <= 7; adiante += 1) {
    const alvo = semana[(dia + adiante) % 7]!;
    if (alvo.fechado) continue;
    const quando =
      adiante === 1 ? "amanhã" : `${NOMES_DIA[alvo.dia]}`;
    return { aberta: false, detalhe: `Abre ${quando} às ${horaLegivel(alvo.abre)}` };
  }

  return { aberta: false, detalhe: "Fechado" };
}

/**
 * Texto para o rodapé, agrupando dias seguidos com o mesmo horário —
 * "Segunda a sexta, 8h às 19h" em vez de sete linhas repetidas.
 */
export function textoDosHorarios(horarios: HorarioDia[] | null | undefined): string {
  const semana = normalizarHorarios(horarios);
  if (semana.length === 0) return "";

  const blocos: { inicio: number; fim: number; abre: string; fecha: string; fechado: boolean }[] =
    [];

  for (const item of semana) {
    const anterior = blocos[blocos.length - 1];
    const mesmo =
      anterior &&
      anterior.fechado === item.fechado &&
      anterior.abre === item.abre &&
      anterior.fecha === item.fecha;
    if (mesmo) anterior.fim = item.dia;
    else
      blocos.push({
        inicio: item.dia,
        fim: item.dia,
        abre: item.abre,
        fecha: item.fecha,
        fechado: item.fechado,
      });
  }

  return blocos
    .map((bloco) => {
      const faixa =
        bloco.inicio === bloco.fim
          ? capitalizar(NOMES_DIA[bloco.inicio]!)
          : `${capitalizar(NOMES_DIA[bloco.inicio]!)} a ${NOMES_DIA[bloco.fim]}`;
      if (bloco.fechado) return `${faixa}: fechado`;
      return `${faixa}, ${horaLegivel(bloco.abre)} às ${horaLegivel(bloco.fecha)}`;
    })
    .join(" · ");
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Formato que o Google entende no JSON-LD (`openingHoursSpecification`). */
export function horariosParaSchema(horarios: HorarioDia[] | null | undefined) {
  const semana = normalizarHorarios(horarios);
  const DIAS_SCHEMA = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return semana
    .filter((dia) => !dia.fechado)
    .map((dia) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DIAS_SCHEMA[dia.dia]}`,
      opens: dia.abre,
      closes: dia.fecha,
    }));
}
