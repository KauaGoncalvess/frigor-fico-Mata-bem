import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { sessaoAtual } from "@/lib/auth/sessao";
import { limitar } from "@/lib/seguranca/rate-limit";

export const runtime = "nodejs";

const TAMANHO_MAXIMO = 8 * 1024 * 1024; // 8 MB

/**
 * Confere a assinatura real do arquivo (magic bytes).
 *
 * O `type` que o navegador manda e a extensão do nome são só texto: qualquer
 * um edita. Um .php renomeado para .jpg passaria pelos dois. O que não dá para
 * falsificar sem ser de fato uma imagem são os primeiros bytes.
 */
function formatoDaImagem(buffer: Buffer): "jpeg" | "png" | "webp" | "avif" | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpeg";

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "png";
  }

  const inicio = buffer.subarray(0, 4).toString("ascii");
  if (inicio === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") {
    return "webp";
  }

  if (buffer.subarray(4, 8).toString("ascii") === "ftyp") {
    const marca = buffer.subarray(8, 12).toString("ascii");
    if (marca === "avif" || marca === "avis") return "avif";
  }

  return null;
}

function cloudinaryConfigurado(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export async function POST(req: Request) {
  // 1) Sessão válida — a rota é do painel, não do público.
  const sessao = await sessaoAtual();
  if (!sessao) {
    return NextResponse.json({ mensagem: "Sessão expirada. Entre de novo." }, { status: 401 });
  }

  // 2) A requisição precisa ter saído do próprio site. Server Actions já fazem
  //    essa checagem sozinhas; numa rota de API ela é por conta da gente.
  const origem = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origem && host) {
    try {
      if (new URL(origem).host !== host) {
        return NextResponse.json({ mensagem: "Origem não autorizada." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ mensagem: "Origem não autorizada." }, { status: 403 });
    }
  }

  const limite = await limitar(`upload:${sessao.sub}`, 40, 600);
  if (!limite.permitido) {
    return NextResponse.json(
      { mensagem: "Muitos envios seguidos. Espere um pouco." },
      { status: 429 },
    );
  }

  if (!cloudinaryConfigurado()) {
    return NextResponse.json(
      {
        mensagem:
          "O envio de fotos ainda não foi configurado (Cloudinary). Fale com quem cuida do site.",
      },
      { status: 503 },
    );
  }

  let arquivo: File | null = null;
  try {
    const formulario = await req.formData();
    const bruto = formulario.get("arquivo");
    if (bruto instanceof File) arquivo = bruto;
  } catch {
    return NextResponse.json({ mensagem: "Não recebemos o arquivo." }, { status: 400 });
  }

  if (!arquivo) {
    return NextResponse.json({ mensagem: "Escolha uma foto para enviar." }, { status: 400 });
  }

  if (arquivo.size > TAMANHO_MAXIMO) {
    return NextResponse.json(
      { mensagem: "A foto passa de 8 MB. Tente uma imagem menor." },
      { status: 413 },
    );
  }

  const buffer = Buffer.from(await arquivo.arrayBuffer());
  const formato = formatoDaImagem(buffer);
  if (!formato) {
    return NextResponse.json(
      { mensagem: "Esse arquivo não é uma foto válida. Use JPG, PNG, WebP ou AVIF." },
      { status: 415 },
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    const resultado = await new Promise<{ secure_url: string; public_id: string }>(
      (resolver, rejeitar) => {
        const fluxo = cloudinary.uploader.upload_stream(
          {
            folder: process.env.CLOUDINARY_PASTA?.trim() || "frigorifico/produtos",
            resource_type: "image",
            // Nome do arquivo do usuário nunca vira nome no CDN.
            use_filename: false,
            unique_filename: true,
            overwrite: false,
            transformation: [
              { width: 1400, height: 1400, crop: "limit" },
              { quality: "auto:good", fetch_format: "auto" },
            ],
          },
          (erro, resposta) => {
            if (erro || !resposta) {
              rejeitar(erro ?? new Error("Falha no upload."));
              return;
            }
            resolver({ secure_url: resposta.secure_url, public_id: resposta.public_id });
          },
        );
        fluxo.end(buffer);
      },
    );

    return NextResponse.json({
      url: resultado.secure_url,
      publicId: resultado.public_id,
    });
  } catch {
    return NextResponse.json(
      { mensagem: "Não conseguimos enviar a foto agora. Tente de novo." },
      { status: 502 },
    );
  }
}
