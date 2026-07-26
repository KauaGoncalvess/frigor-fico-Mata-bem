"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

type Estado = "parado" | "enviando" | "ok" | "erro";

/**
 * Captura de contato para a lista de ofertas.
 *
 * LGPD: o consentimento é opt-in explícito (checkbox desmarcado por padrão),
 * a finalidade está escrita ao lado e todo e-mail enviado leva link de
 * descadastro. Sem a marcação, o formulário não envia.
 */
export function CapturaEmail() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [consentimento, setConsentimento] = useState(false);
  // Consentimento de WhatsApp é separado: finalidade diferente, autorização
  // diferente. O campo de telefone só existe depois que a pessoa marca.
  const [querWhatsapp, setQuerWhatsapp] = useState(false);
  const [telefone, setTelefone] = useState("");
  const [estado, setEstado] = useState<Estado>("parado");
  const [mensagem, setMensagem] = useState("");

  // Honeypot: campo invisível para humano. Bot preenche tudo que encontra.
  const iscaRef = useRef<HTMLInputElement>(null);
  const abertoEm = useRef(Date.now());

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (estado === "enviando") return;

    if (!consentimento) {
      setEstado("erro");
      setMensagem("Marque a autorização para receber as ofertas.");
      return;
    }

    setEstado("enviando");
    setMensagem("");

    try {
      const resposta = await fetch("/api/contatos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          consentimento,
          telefone: querWhatsapp ? telefone : "",
          consentimentoWhatsapp: querWhatsapp,
          isca: iscaRef.current?.value ?? "",
          tempoNaPagina: Date.now() - abertoEm.current,
        }),
      });

      const dados = (await resposta.json().catch(() => ({}))) as { mensagem?: string };

      if (!resposta.ok) {
        setEstado("erro");
        setMensagem(dados.mensagem ?? "Não conseguimos cadastrar agora. Tente de novo.");
        return;
      }

      setEstado("ok");
      setMensagem(dados.mensagem ?? "Pronto! Você entrou na lista.");
      setNome("");
      setEmail("");
      setConsentimento(false);
      setQuerWhatsapp(false);
      setTelefone("");
    } catch {
      setEstado("erro");
      setMensagem("Sem conexão no momento. Tente de novo em instantes.");
    }
  };

  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grao relative overflow-hidden rounded-card border border-carvao-700 bg-carvao-900 px-5 py-8 sm:px-10 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 120% at 100% 0%, rgba(233,161,59,0.16) 0%, transparent 60%)",
            }}
          />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
            <div>
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-ambar-500/25 bg-ambar-500/10 text-ambar-400">
                <Mail size={19} />
              </span>
              <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                Receba as ofertas da semana
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-creme-muted">
                Toda semana mandamos os cortes em promoção antes de acabar. Um e-mail por
                semana, no máximo — e você sai quando quiser.
              </p>
            </div>

            {estado === "ok" ? (
              <div className="flex items-center gap-3 rounded-xl border border-sucesso/40 bg-sucesso/10 px-4 py-5">
                <CheckCircle2 className="shrink-0 text-sucesso" size={22} />
                <p className="text-sm text-creme">{mensagem}</p>
              </div>
            ) : (
              <form onSubmit={enviar} className="flex flex-col gap-3" noValidate>
                {/* Honeypot — escondido de gente, visível para robô */}
                <input
                  ref={iscaRef}
                  type="text"
                  name="empresa"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="sr-only">Seu nome</span>
                    <input
                      value={nome}
                      onChange={(evento) => setNome(evento.target.value)}
                      required
                      maxLength={80}
                      placeholder="Seu nome"
                      autoComplete="name"
                      className="h-12 rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 text-sm text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="sr-only">Seu e-mail</span>
                    <input
                      value={email}
                      onChange={(evento) => setEmail(evento.target.value)}
                      required
                      type="email"
                      maxLength={160}
                      placeholder="seu@email.com"
                      autoComplete="email"
                      className="h-12 rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 text-sm text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none"
                    />
                  </label>
                </div>

                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={consentimento}
                    onChange={(evento) => setConsentimento(evento.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brasa-500"
                  />
                  <span className="text-[12px] leading-snug text-creme-muted">
                    Autorizo o {""}
                    <strong className="font-semibold text-creme">
                      envio de ofertas por e-mail
                    </strong>{" "}
                    e o uso do meu nome e e-mail só para isso. Posso cancelar a qualquer
                    momento pelo link no rodapé do e-mail.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={querWhatsapp}
                    onChange={(evento) => setQuerWhatsapp(evento.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brasa-500"
                  />
                  <span className="text-[12px] leading-snug text-creme-muted">
                    Quero receber também{" "}
                    <strong className="font-semibold text-creme">no WhatsApp</strong>{" "}
                    (opcional)
                  </span>
                </label>

                {querWhatsapp && (
                  <label className="flex flex-col gap-1.5">
                    <span className="sr-only">Seu WhatsApp</span>
                    <input
                      value={telefone}
                      onChange={(evento) => setTelefone(evento.target.value)}
                      type="tel"
                      inputMode="tel"
                      maxLength={30}
                      placeholder="(11) 99999-9999"
                      autoComplete="tel"
                      className="h-12 rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 text-sm text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-creme-muted">
                      Guardamos seu número só para avisar das ofertas. Você pode pedir para
                      sair quando quiser.
                    </span>
                  </label>
                )}

                {estado === "erro" && (
                  <p role="alert" className="text-[12.5px] text-erro">
                    {mensagem}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={estado === "enviando"}
                  className="h-12 rounded-xl bg-creme text-[14px] font-bold text-carvao-950 transition hover:bg-white active:scale-[0.99] disabled:opacity-60"
                >
                  {estado === "enviando" ? "Cadastrando..." : "Quero receber as ofertas"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
