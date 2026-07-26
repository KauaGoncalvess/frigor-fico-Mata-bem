import { Download } from "lucide-react";
import { CabecalhoPagina, Cartao, VazioEstado } from "@/components/admin/ui";
import { exigirSessao } from "@/lib/admin/guarda";
import { formatarData } from "@/lib/format";
import { listarContatos } from "@/lib/repo/contatos";

export const dynamic = "force-dynamic";

export const metadata = { title: "Contatos" };

export default async function PaginaContatos() {
  await exigirSessao();
  const contatos = await listarContatos();
  const ativos = contatos.filter((x) => !x.descadastradoEm);

  return (
    <>
      <CabecalhoPagina
        titulo="Base de contatos"
        descricao="Quem autorizou receber suas ofertas por e-mail. Esta lista é sua — não compartilhe."
        acao={
          contatos.length > 0 ? (
            <a
              href="/admin/contatos/exportar"
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-carvao-600 px-5 text-[13.5px] font-semibold text-creme transition hover:border-ambar-500/60 hover:text-ambar-400"
            >
              <Download size={16} />
              Baixar CSV
            </a>
          ) : undefined
        }
      />

      {contatos.length === 0 ? (
        <VazioEstado
          titulo="Ninguém cadastrado ainda"
          texto="Quando um cliente preencher o formulário de ofertas na loja, o contato aparece aqui."
        />
      ) : (
        <>
          <p className="mb-4 text-[13.5px] text-creme-muted">
            <strong className="text-creme">{ativos.length}</strong> ativo(s) ·{" "}
            {contatos.length - ativos.length} descadastrado(s)
          </p>

          <Cartao className="overflow-x-auto p-0">
            <table className="w-full min-w-[520px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-carvao-800 text-[11.5px] uppercase tracking-wider text-creme-muted">
                  <th className="px-5 py-3 font-semibold">Nome</th>
                  <th className="px-5 py-3 font-semibold">E-mail</th>
                  <th className="px-5 py-3 font-semibold">Cadastro</th>
                  <th className="px-5 py-3 font-semibold">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carvao-800">
                {contatos.map((contato) => (
                  <tr key={contato.id}>
                    <td className="px-5 py-3 font-medium text-creme">{contato.nome}</td>
                    <td className="px-5 py-3 text-creme-muted">{contato.email}</td>
                    <td className="px-5 py-3 text-creme-muted">
                      {formatarData(contato.criadoEm)}
                    </td>
                    <td className="px-5 py-3">
                      {contato.descadastradoEm ? (
                        <span className="rounded-full bg-carvao-800 px-2.5 py-0.5 text-[11px] font-semibold text-creme-muted">
                          saiu da lista
                        </span>
                      ) : (
                        <span className="rounded-full bg-sucesso/15 px-2.5 py-0.5 text-[11px] font-semibold text-sucesso">
                          recebe ofertas
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Cartao>
        </>
      )}
    </>
  );
}
