const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Centavos -> "R$ 49,90". Dinheiro circula como inteiro em centavos. */
export function formatarPreco(centavos: number): string {
  return moeda.format(centavos / 100);
}

/** "49,90" ou "49.90" -> 4990. Retorna null quando não dá para interpretar. */
export function analisarPreco(entrada: string): number | null {
  const limpo = entrada
    .replace(/[R$\s]/gi, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  if (!limpo || !/^\d*\.?\d*$/.test(limpo)) return null;
  const valor = Number(limpo);
  if (!Number.isFinite(valor) || valor < 0) return null;
  return Math.round(valor * 100);
}

/** Quantidade em kg com vírgula decimal: 1.5 -> "1,5 kg" */
export function formatarQuantidade(qtd: number, unidade: string): string {
  const texto = Number.isInteger(qtd)
    ? String(qtd)
    : qtd.toFixed(3).replace(/0+$/, "").replace(/\.$/, "").replace(".", ",");
  return `${texto} ${unidade}`;
}

export function formatarData(data: Date | string | null | undefined): string {
  if (!data) return "—";
  const d = typeof data === "string" ? new Date(data) : data;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function formatarDataHora(data: Date | string | null | undefined): string {
  if (!data) return "—";
  const d = typeof data === "string" ? new Date(data) : data;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Mantém só os dígitos — usado no link do WhatsApp (wa.me exige só números). */
export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function formatarTelefone(valor: string): string {
  const d = somenteDigitos(valor).replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return valor;
}
