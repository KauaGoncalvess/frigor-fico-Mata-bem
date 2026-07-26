import { CabecalhoPagina, Cartao } from "@/components/admin/ui";
import { exigirSessao } from "@/lib/admin/guarda";
import { situacaoDosCanais } from "@/lib/canais";
import { formatarDataHora } from "@/lib/format";
import { listarCampanhas } from "@/lib/repo/campanhas";
import { listarInscritosAtivos, listarInscritosWhatsapp } from "@/lib/repo/contatos";
import { listarDisponiveis } from "@/lib/repo/produtos";
import { FormularioCampanha } from "./formulario";

export const dynamic = "force-dynamic";

export const metadata = { title: "Campanhas" };

export default async function PaginaCampanhas() {
  await exigirSessao();

  const [produtos, contatos, contatosWhatsapp, campanhas] = await Promise.all([
    listarDisponiveis(),
    listarInscritosAtivos(),
    listarInscritosWhatsapp(),
    listarCampanhas(),
  ]);

  const canais = situacaoDosCanais();
  const desligados = canais.filter((x) => !x.ativo);

  return (
    <>
      <CabecalhoPagina
        titulo="Campanhas"
        descricao="Avise sua lista sobre as ofertas da semana."
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <FormularioCampanha
          produtos={produtos}
          canais={canais}
          totalPorRequisito={{
            email: contatos.length,
            telefone: contatosWhatsapp.length,
          }}
        />

        <aside className="flex flex-col gap-5">
          <Cartao>
            <h2 className="text-[15px] font-semibold text-creme">Canais</h2>
            <ul className="mt-3 flex flex-col gap-3">
              {canais.map((canal) => (
                <li key={canal.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-creme">
                      {canal.rotulo}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
                        canal.ativo
                          ? "bg-sucesso/15 text-sucesso"
                          : "bg-carvao-800 text-creme-muted"
                      }`}
                    >
                      {canal.ativo ? "ligado" : "desligado"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-creme-muted">
                    alcança{" "}
                    {canal.requer === "telefone" ? contatosWhatsapp.length : contatos.length}{" "}
                    contato(s)
                  </p>
                  {canal.motivo && (
                    <p className="mt-1 text-[11.5px] leading-snug text-creme-muted">
                      {canal.motivo}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            {desligados.length > 0 && (
              <p className="mt-4 border-t border-carvao-800 pt-3 text-[11.5px] leading-snug text-creme-muted">
                Os canais de WhatsApp já estão prontos no código e podem ser ligados por
                configuração quando fizer sentido para o negócio.
              </p>
            )}
          </Cartao>

          <Cartao>
            <h2 className="text-[15px] font-semibold text-creme">Últimos envios</h2>
            {campanhas.length === 0 ? (
              <p className="mt-2 text-[13px] text-creme-muted">
                Nenhuma campanha enviada ainda.
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-3">
                {campanhas.slice(0, 8).map((campanha) => (
                  <li key={campanha.id} className="border-b border-carvao-800 pb-3 last:border-0 last:pb-0">
                    <p className="truncate text-[13px] font-medium text-creme">
                      {campanha.assunto}
                    </p>
                    <p className="text-[11.5px] text-creme-muted">
                      {formatarDataHora(campanha.enviadoEm ?? campanha.criadoEm)} ·{" "}
                      {campanha.totalEnviados} enviado(s)
                      {campanha.totalFalhas > 0 && ` · ${campanha.totalFalhas} falha(s)`}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Cartao>
        </aside>
      </div>
    </>
  );
}
