import { gerarIcone } from "@/lib/icone";

/** Ícone que o iPhone usa ao salvar o site na tela inicial. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return gerarIcone(180);
}
