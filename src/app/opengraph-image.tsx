import { ImageResponse } from "next/og";
import { EMPRESA } from "@/conteudo/empresa";

/**
 * Cartão que aparece quando alguém cola o link no WhatsApp, no LinkedIn ou
 * num e-mail. Mesma gramática da abertura: quase preto, o nome em serifada
 * grande, e a credencial embaixo — que é o que interessa a um comprador.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Frigorífico Mata Bem — Sete Lagoas, Minas Gerais";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0a09",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(240,233,221,0.8)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {EMPRESA.local}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 190, color: "#f0e9dd", lineHeight: 1 }}>
            Mata Bem
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 30,
              color: "rgba(240,233,221,0.72)",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Abate, industrialização e preparação de subprodutos
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            borderTop: "1px solid rgba(240,233,221,0.2)",
            paddingTop: 26,
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#c2653c",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Inspeção federal permanente · Sete Lagoas MG
        </div>
      </div>
    ),
    size,
  );
}
