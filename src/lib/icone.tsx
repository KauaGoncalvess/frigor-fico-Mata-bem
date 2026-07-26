import { ImageResponse } from "next/og";

/**
 * Ícone do app gerado em tempo de execução.
 *
 * Gerar em vez de versionar PNG evita ter binário no repositório e mantém o
 * ícone alinhado à paleta da marca num só lugar. É o ícone que aparece quando
 * o cliente salva a loja na tela inicial do celular.
 */
export function gerarIcone(tamanho: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #e04b23 0%, #7a1424 100%)",
          color: "#fff",
          fontSize: tamanho * 0.58,
          fontWeight: 700,
          fontFamily: "serif",
        }}
      >
        M
      </div>
    ),
    { width: tamanho, height: tamanho },
  );
}
