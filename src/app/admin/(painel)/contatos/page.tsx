import { Download } from "lucide-react";
import { CabecalhoPagina, VazioEstado } from "@/components/admin/ui";
import { exigirSessao } from "@/lib/admin/guarda";
import { listarContatos } from "@/lib/repo/contatos";
import { TabelaContatos } from "./tabela";

export const dynamic = "force-dynamic";

export const metadata = { title: "Contatos" };

export default async function PaginaContatos() {
  await exigirSessao();
  const contatos = await listarContatos();
  const ativos = contatos.filter((x) => !x.descadastradoEm);
  const comWhatsapp = ativos.filter((x) => x.consentimentoWhatsapp && x.telefone);

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
            {contatos.length - ativos.length} descadastrado(s) ·{" "}
            <strong className="text-creme">{comWhatsapp.length}</strong> autorizaram
            WhatsApp
          </p>

          <TabelaContatos contatos={contatos} />
        </>
      )}
    </>
  );
}
