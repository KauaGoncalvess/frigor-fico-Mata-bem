"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { conferirSenha, queimarTempo } from "@/lib/auth/senha";
import { criarCookieSessao, segredoConfigurado } from "@/lib/auth/sessao";
import {
  autenticacaoConfigurada,
  buscarCredencial,
  diagnosticoAdmin,
  registrarLogin,
} from "@/lib/repo/admin";
import { limitar } from "@/lib/seguranca/rate-limit";

const Entrada = z.object({
  email: z.string().trim().email(),
  senha: z.string().min(1),
});

/**
 * O React limpa os campos não controlados assim que a action termina. Sem
 * devolver o e-mail digitado, quem erra a senha precisa redigitar o e-mail
 * também — por isso ele volta junto do erro e vira o defaultValue do campo.
 */
export type EstadoLogin = { erro: string | null; email?: string };

/** Só aceita caminho interno — evita virar redirecionador para site de fora. */
function destinoSeguro(valor: FormDataEntryValue | null): string {
  const texto = typeof valor === "string" ? valor : "";
  if (texto.startsWith("/") && !texto.startsWith("//") && texto.startsWith("/admin")) {
    return texto;
  }
  return "/admin";
}

export async function entrar(
  _anterior: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  if (!segredoConfigurado()) {
    return {
      erro: "O acesso ainda não foi configurado no servidor (AUTH_SECRET). Fale com quem cuida do site.",
    };
  }
  const diagnostico = diagnosticoAdmin();
  if (!autenticacaoConfigurada() || diagnostico) {
    return {
      erro:
        diagnostico ??
        "Nenhum administrador cadastrado. Configure ADMIN_EMAIL e ADMIN_SENHA_HASH.",
    };
  }

  const cabecalhos = await headers();
  const ip = cabecalhos.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconhecido";

  const emailDigitado = String(formData.get("email") ?? "").trim();

  const analise = Entrada.safeParse({
    email: formData.get("email"),
    senha: formData.get("senha"),
  });

  // Dois limites: um por IP (força bruta distribuída num alvo) e um por e-mail
  // (força bruta numa conta a partir de vários IPs).
  const emailTentado = analise.success ? analise.data.email.toLowerCase() : "invalido";
  const porIp = await limitar(`login:ip:${ip}`, 8, 900);
  const porEmail = await limitar(`login:email:${emailTentado}`, 8, 900);

  if (!porIp.permitido || !porEmail.permitido) {
    const espera = Math.max(porIp.esperarSegundos, porEmail.esperarSegundos);
    return {
      erro: `Muitas tentativas de acesso. Aguarde ${Math.ceil(espera / 60)} minuto(s) e tente de novo.`,
      email: emailDigitado,
    };
  }

  if (!analise.success) {
    await queimarTempo("x");
    return { erro: "E-mail ou senha incorretos.", email: emailDigitado };
  }

  const credencial = await buscarCredencial(analise.data.email);

  if (!credencial) {
    // Gasta o mesmo tempo de uma verificação real: sem isso, a resposta
    // instantânea revelaria que aquele e-mail não existe.
    await queimarTempo(analise.data.senha);
    return { erro: "E-mail ou senha incorretos.", email: emailDigitado };
  }

  const confere = await conferirSenha(analise.data.senha, credencial.senhaHash);
  if (!confere) {
    // Mensagem idêntica à de e-mail inexistente, de propósito.
    return { erro: "E-mail ou senha incorretos.", email: emailDigitado };
  }

  await criarCookieSessao({
    sub: String(credencial.id),
    nome: credencial.nome,
    email: credencial.email,
  });
  await registrarLogin(credencial.id);

  redirect(destinoSeguro(formData.get("proximo")));
}
