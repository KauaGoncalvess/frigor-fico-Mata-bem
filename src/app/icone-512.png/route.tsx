import { gerarIcone } from "@/lib/icone";

/** Ícone grande do manifest, usado na splash do Android. */
export function GET() {
  return gerarIcone(512);
}
