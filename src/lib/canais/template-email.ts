import { formatarPreco } from "@/lib/format";
import { ofertaAtiva, percentualDesconto } from "@/lib/produto";
import type { Produto } from "@/lib/db/schema";

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type DadosEmail = {
  nomeContato: string;
  assunto: string;
  corpo: string;
  produtos: Produto[];
  nomeLoja: string;
  urlLoja: string;
  urlDescadastro: string;
  whatsapp: string;
};

/**
 * HTML de e-mail com tabelas e estilo inline: é o que sobrevive ao Gmail,
 * Outlook e afins, que ignoram boa parte de CSS moderno.
 */
export function montarEmailHtml(dados: DadosEmail): string {
  const linhasProdutos = dados.produtos
    .map((produto) => {
      const promo = ofertaAtiva(produto);
      const preco = promo
        ? `<span style="color:#8a8078;text-decoration:line-through;font-size:13px">${formatarPreco(
            produto.precoCentavos,
          )}</span> <strong style="color:#c2371a;font-size:17px">${formatarPreco(
            produto.precoPromoCentavos!,
          )}</strong>`
        : `<strong style="color:#231a16;font-size:17px">${formatarPreco(
            produto.precoCentavos,
          )}</strong>`;
      const selo = promo
        ? `<span style="display:inline-block;background:#c2371a;color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:99px;margin-left:6px">-${percentualDesconto(
            produto,
          )}%</span>`
        : "";
      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #ece5dc">
            <div style="font-size:16px;font-weight:600;color:#231a16">${escapar(
              produto.nome,
            )}${selo}</div>
            <div style="font-size:13px;color:#7a6c62;margin-top:2px">${escapar(
              produto.descricao ?? "",
            )}</div>
            <div style="margin-top:6px">${preco} <span style="color:#7a6c62;font-size:13px">/ ${escapar(
              produto.unidade,
            )}</span></div>
          </td>
        </tr>`;
    })
    .join("");

  const blocoProdutos = dados.produtos.length
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">${linhasProdutos}</table>`
    : "";

  const corpoHtml = escapar(dados.corpo)
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#3d3029">${p.replace(
          /\n/g,
          "<br>",
        )}</p>`,
    )
    .join("");

  return `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapar(dados.assunto)}</title></head>
<body style="margin:0;padding:0;background:#f5f1ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1ea;padding:24px 12px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.07)">
        <tr>
          <td style="background:#120d0a;padding:26px 28px">
            <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#e9a13b">Ofertas da semana</div>
            <div style="font-size:24px;font-weight:700;color:#f6efe6;margin-top:6px">${escapar(
              dados.nomeLoja,
            )}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px">
            <p style="margin:0 0 14px;font-size:15px;color:#3d3029">Olá, ${escapar(
              dados.nomeContato,
            )}!</p>
            ${corpoHtml}
            ${blocoProdutos}
            <table cellpadding="0" cellspacing="0" style="margin-top:26px">
              <tr><td style="background:#c2371a;border-radius:10px">
                <a href="${escapar(dados.urlLoja)}"
                   style="display:inline-block;padding:14px 26px;color:#fff;font-weight:700;font-size:15px;text-decoration:none">
                  Fazer meu pedido
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px;background:#faf7f2;border-top:1px solid #ece5dc">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#8a8078">
              Você recebe este e-mail porque autorizou o contato em nosso site.<br>
              <a href="${escapar(
                dados.urlDescadastro,
              )}" style="color:#8a8078;text-decoration:underline">Cancelar o recebimento destes e-mails</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function montarEmailTexto(dados: DadosEmail): string {
  const produtos = dados.produtos
    .map((p) => {
      const preco = ofertaAtiva(p)
        ? `${formatarPreco(p.precoPromoCentavos!)} (de ${formatarPreco(p.precoCentavos)})`
        : formatarPreco(p.precoCentavos);
      return `- ${p.nome}: ${preco} / ${p.unidade}`;
    })
    .join("\n");

  return [
    `Olá, ${dados.nomeContato}!`,
    "",
    dados.corpo,
    produtos ? `\n${produtos}` : "",
    "",
    `Faça seu pedido: ${dados.urlLoja}`,
    "",
    "---",
    "Você recebe este e-mail porque autorizou o contato em nosso site.",
    `Para cancelar: ${dados.urlDescadastro}`,
  ].join("\n");
}
