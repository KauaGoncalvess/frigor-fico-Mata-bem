import { ImageResponse } from "next/og";
import { obterConfig } from "@/lib/repo/config";

/**
 * Imagem que aparece quando alguém compartilha o link da loja.
 *
 * Sem isso o link cai no grupo da família como um retângulo cinza, e é
 * justamente o boca a boca no WhatsApp que traz cliente para açougue de bairro.
 */
export const alt = "Frigorífico — cortes selecionados, pedido pelo WhatsApp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Imagem() {
  // Nome vem do painel; se o banco estiver fora, a imagem ainda é gerada.
  let nome = "Frigorífico Mata Bem";
  let endereco = "";
  try {
    const config = await obterConfig();
    nome = config.nome;
    endereco = config.endereco;
  } catch {
    // Segue com o padrão: melhor imagem genérica que link sem preview.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(120% 90% at 50% 115%, #e04b23 0%, #7a1424 34%, #120d0a 72%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "#c2371a",
              color: "#fff",
              fontSize: "44px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {nome.trim().charAt(0).toUpperCase() || "M"}
          </div>
          <div
            style={{
              color: "#f5b855",
              fontSize: "24px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Carnes selecionadas
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              color: "#f6efe6",
              fontSize: "86px",
              fontWeight: 700,
              lineHeight: 1.03,
              letterSpacing: "-2px",
            }}
          >
            {nome}
          </div>
          <div style={{ color: "#f5b855", fontSize: "40px", fontWeight: 600 }}>
            Peça sua carne pelo WhatsApp
          </div>
          {endereco ? (
            <div style={{ color: "#b7a89b", fontSize: "28px" }}>{endereco}</div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
