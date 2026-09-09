/**
 * Lista tudo que ainda não foi confirmado pela empresa.
 *
 * É a folha que vai para o dono do Mata Bem: ele responde item por item, e
 * cada resposta vira um `confirmado: true` em src/conteudo/. Enquanto isso, a
 * etiqueta "A confirmar" aparece na própria página.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PASTA = join(process.cwd(), "src", "conteudo");

const arquivos = readdirSync(PASTA).filter((nome) => nome.endsWith(".ts"));
let total = 0;

for (const arquivo of arquivos) {
  const linhas = readFileSync(join(PASTA, arquivo), "utf8").split("\n");
  const achados: string[] = [];

  linhas.forEach((linha, i) => {
    if (!linha.includes("aConfirmar(")) return;

    // O rótulo mais próximo acima costuma ser o nome do campo ou do item.
    let contexto = linha.trim();
    for (let volta = i; volta >= 0 && volta > i - 6; volta -= 1) {
      const anterior = linhas[volta].trim();
      const rotulo = anterior.match(/^(titulo|nome|unidade|sigla|rotulo|etapa):\s*"([^"]+)"/);
      if (rotulo) {
        contexto = `${rotulo[2]} — ${contexto}`;
        break;
      }
    }
    achados.push(`  linha ${i + 1}: ${contexto.replace(/\s+/g, " ").slice(0, 120)}`);
  });

  if (achados.length === 0) continue;
  total += achados.length;
  console.log(`\n${arquivo}  (${achados.length})`);
  achados.forEach((linha) => console.log(linha));
}

console.log(
  total === 0
    ? "\nNada pendente: todo dado do site foi confirmado pela empresa."
    : `\n${total} itens aguardando confirmação da empresa.`,
);
