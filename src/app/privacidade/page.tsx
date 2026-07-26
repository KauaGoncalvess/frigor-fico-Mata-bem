import Link from "next/link";
import { obterConfig } from "@/lib/repo/config";

export const dynamic = "force-dynamic";

export const metadata = { title: "Política de privacidade" };

export default async function PaginaPrivacidade() {
  const config = await obterConfig();

  return (
    <main className="mx-auto max-w-2xl px-4 py-14">
      <Link
        href="/"
        className="text-[13px] font-semibold text-ambar-400 underline-offset-2 hover:underline"
      >
        ← Voltar para a loja
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">Política de privacidade</h1>
      <p className="mt-2 text-sm text-creme-muted">
        Como o {config.nome} trata os seus dados.
      </p>

      <div className="mt-8 flex flex-col gap-6 text-[14px] leading-relaxed text-creme-muted">
        <section>
          <h2 className="mb-1.5 text-lg font-semibold text-creme">Quais dados coletamos</h2>
          <p>
            Só o que você digita: nome e e-mail, quando se cadastra para receber as ofertas
            da semana. O telefone é guardado apenas se você marcar que também quer
            receber no WhatsApp — sem essa autorização, o número não é salvo. O pedido montado no site (itens, quantidades e observações) fica
            registrado para o nosso atendimento conferir. Não pedimos CPF, endereço nem
            dados de pagamento neste site.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-lg font-semibold text-creme">Para que usamos</h2>
          <p>
            O nome e o e-mail são usados exclusivamente para enviar nossas ofertas por
            e-mail. O telefone, quando autorizado, serve somente para avisar de ofertas no
            WhatsApp. São autorizações separadas: aceitar uma não liga a outra. Não
            vendemos, alugamos nem compartilhamos sua lista com terceiros para publicidade.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-lg font-semibold text-creme">Consentimento</h2>
          <p>
            O cadastro só acontece se você marcar a autorização no formulário. Guardamos a
            data em que essa autorização foi dada.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-lg font-semibold text-creme">
            Como cancelar ou apagar seus dados
          </h2>
          <p>
            Todo e-mail que enviamos tem um link de cancelamento no rodapé — um clique e
            você sai da lista. Se preferir que a gente apague seu cadastro por completo,
            inclusive o telefone,
            fale com a loja pelo WhatsApp{" "}
            {config.telefone ? <>ou pelo telefone {config.telefone}</> : null} e resolvemos.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-lg font-semibold text-creme">WhatsApp</h2>
          <p>
            Ao enviar o pedido, você é levado para o WhatsApp com a mensagem já escrita. A
            conversa a partir daí acontece dentro do WhatsApp e segue as políticas de
            privacidade do próprio aplicativo.
          </p>
        </section>
      </div>
    </main>
  );
}
