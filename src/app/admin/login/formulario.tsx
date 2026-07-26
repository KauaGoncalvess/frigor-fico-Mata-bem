"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { entrar, type EstadoLogin } from "./acoes";

const INICIAL: EstadoLogin = { erro: null };

export function FormularioLogin({ proximo }: { proximo: string }) {
  const [estado, acao, pendente] = useActionState(entrar, INICIAL);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <form
      action={acao}
      className="flex flex-col gap-4 rounded-card border border-carvao-700 bg-carvao-900 p-6"
    >
      <input type="hidden" name="proximo" value={proximo} />

      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-creme-muted">E-mail</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          // O React zera os campos quando a action termina; devolver o e-mail
          // aqui evita que quem errou só a senha tenha que redigitar tudo.
          defaultValue={estado.email ?? ""}
          className="h-12 rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 text-sm text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none"
          placeholder="voce@sualoja.com.br"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-creme-muted">Senha</span>
        <span className="relative">
          <input
            name="senha"
            type={mostrarSenha ? "text" : "password"}
            required
            autoComplete="current-password"
            className="h-12 w-full rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 pr-12 text-sm text-creme focus:border-ambar-500 focus:outline-none"
            placeholder="••••••••••"
          />
          <button
            type="button"
            onClick={() => setMostrarSenha((v) => !v)}
            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-creme-muted transition hover:bg-carvao-800 hover:text-creme"
          >
            {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </span>
      </label>

      {estado.erro && (
        <p
          role="alert"
          className="rounded-xl border border-erro/40 bg-erro/10 px-3 py-2.5 text-[13px] leading-snug text-creme"
        >
          {estado.erro}
        </p>
      )}

      <button
        type="submit"
        disabled={pendente}
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brasa-600 text-[14px] font-bold text-white transition hover:bg-brasa-500 active:scale-[0.99] disabled:opacity-60"
      >
        <LogIn size={17} />
        {pendente ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
