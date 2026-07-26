import { gerarIcone } from "@/lib/icone";

/** Ícone do manifest (Android / "adicionar à tela inicial"). */
export function GET() {
  return gerarIcone(192);
}
