/**
 * Cria (ou atualiza) o administrador do painel.
 *
 *   npm run admin:criar
 *
 * Com DATABASE_URL configurada, grava na tabela `admin_users`. Sem banco,
 * imprime as variáveis de ambiente para você colar na Vercel.
 *
 * A senha nunca é guardada em texto puro — só o hash bcrypt sai daqui.
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";

async function perguntar(rotulo: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout, terminal: true });
  const resposta = await rl.question(rotulo);
  rl.close();
  return resposta.trim();
}

/**
 * Lê a senha sem ecoar nada na tela.
 *
 * Em modo bruto o terminal entrega tecla a tecla e nada é impresso sozinho,
 * então a senha não fica visível nem sobra no scrollback do terminal.
 */
function perguntarSenha(rotulo: string): Promise<string> {
  return new Promise((resolver) => {
    stdout.write(rotulo);

    const eraBruto = stdin.isTTY ? stdin.isRaw : false;
    if (stdin.isTTY) stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let digitado = "";

    const encerrar = () => {
      if (stdin.isTTY) stdin.setRawMode(eraBruto);
      stdin.removeListener("data", aoDigitar);
      stdin.pause();
      stdout.write("\n");
    };

    const aoDigitar = (pedaco: string) => {
      for (const tecla of pedaco) {
        if (tecla === "\n" || tecla === "\r" || tecla === "\u0004") {
          encerrar();
          resolver(digitado.trim());
          return;
        }
        if (tecla === "\u0003") {
          // Ctrl+C
          encerrar();
          process.exit(1);
        }
        if (tecla === "\u007f" || tecla === "\b") {
          digitado = digitado.slice(0, -1);
          continue;
        }
        digitado += tecla;
      }
    };

    stdin.on("data", aoDigitar);
  });
}

function validarSenha(senha: string): string | null {
  if (senha.length < 10) return "A senha precisa ter pelo menos 10 caracteres.";
  if (!/[a-zA-Z]/.test(senha)) return "A senha precisa ter pelo menos uma letra.";
  if (!/\d/.test(senha)) return "A senha precisa ter pelo menos um número.";
  return null;
}

async function principal() {
  console.log("\n=== Criar administrador do painel ===\n");

  const nome = (await perguntar("Nome: ")) || "Administrador";
  const email = (await perguntar("E-mail: ")).toLowerCase();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    console.error("\nE-mail inválido.");
    process.exit(1);
  }

  const senha = await perguntarSenha("Senha: ");
  const erro = validarSenha(senha);
  if (erro) {
    console.error(`\n${erro}`);
    process.exit(1);
  }

  const confirmacao = await perguntarSenha("Confirme a senha: ");
  if (senha !== confirmacao) {
    console.error("\nAs senhas não são iguais.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(senha, 12);

  if (process.env.DATABASE_URL) {
    const { db } = await import("../src/lib/db");
    const { adminUsers } = await import("../src/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    const existente = await db()
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (existente.length > 0) {
      await db()
        .update(adminUsers)
        .set({ nome, senhaHash: hash })
        .where(eq(adminUsers.email, email));
      console.log(`\n✓ Senha do administrador ${email} atualizada.\n`);
    } else {
      await db().insert(adminUsers).values({ nome, email, senhaHash: hash });
      console.log(`\n✓ Administrador ${email} criado.\n`);
    }
    process.exit(0);
  }

  console.log("\nDATABASE_URL não configurada. Use estas variáveis de ambiente.\n");

  console.log("--- Para o arquivo .env.local (cifrões escapados com \\) ---\n");
  console.log(`ADMIN_NOME=${nome}`);
  console.log(`ADMIN_EMAIL=${email}`);
  // O leitor de .env do Next expande $VAR, e hash bcrypt é cheio de `$`.
  // Aspas NÃO resolvem (testado): só a barra invertida antes de cada cifrão.
  console.log(`ADMIN_SENHA_HASH=${hash.replace(/\$/g, "\\$")}`);

  console.log("\n--- Para o painel da Vercel (valor literal, sem escapar) ---\n");
  console.log(`ADMIN_NOME=${nome}`);
  console.log(`ADMIN_EMAIL=${email}`);
  console.log(`ADMIN_SENHA_HASH=${hash}`);

  console.log(
    "\nNão misture os dois: no .env sem as barras o valor chega vazio e o login\nrecusa até a senha certa; na Vercel com as barras o hash fica errado.\n",
  );
  process.exit(0);
}

principal().catch((erro) => {
  console.error("\nFalhou:", erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
