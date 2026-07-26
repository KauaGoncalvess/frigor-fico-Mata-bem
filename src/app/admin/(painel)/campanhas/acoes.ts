"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { exigirSessao, falha, sucesso, type RespostaAcao } from "@/lib/admin/guarda";
import { obterCanal } from "@/lib/canais";
import { concluirCampanha, criarCampanha, registrarEnvios } from "@/lib/repo/campanhas";
import { listarInscritosAtivos, listarInscritosWhatsapp } from "@/lib/repo/contatos";
import { obterProdutosPorIds } from "@/lib/repo/produtos";
import { limitar } from "@/lib/seguranca/rate-limit";

const Formulario = z.object({
  assunto: z.string().trim().min(4, "Escreva um assunto para o e-mail.").max(140),
  conteudo: z.string().trim().min(10, "Escreva a mensagem da campanha.").max(4000),
  canal: z.string().trim().min(1),
});

/** Envia em blocos: dispara rápido sem estourar o limite do provedor de uma vez. */
const TAMANHO_DO_BLOCO = 5;

export async function dispararCampanha(
  _anterior: RespostaAcao,
  formData: FormData,
): Promise<RespostaAcao> {
  const sessao = await exigirSessao();

  // Trava de segurança e de bolso: disparo em massa é caro e irreversível.
  const limite = await limitar(`campanha:${sessao.sub}`, 5, 3600);
  if (!limite.permitido) {
    return falha(
      "Você já disparou várias campanhas nesta hora. Aguarde um pouco antes da próxima.",
    );
  }

  const analise = Formulario.safeParse({
    assunto: formData.get("assunto"),
    conteudo: formData.get("conteudo"),
    canal: formData.get("canal"),
  });

  if (!analise.success) {
    return falha(analise.error.issues[0]?.message ?? "Confira os campos.");
  }

  const { assunto, conteudo, canal: canalId } = analise.data;

  const canal = obterCanal(canalId);
  if (!canal) return falha("Canal de envio desconhecido.");
  if (!canal.ativo()) {
    return falha(
      canal.motivoInativo() ?? "Esse canal está desligado no momento.",
    );
  }

  const produtosIds = formData
    .getAll("produtos")
    .map((valor) => Number(valor))
    .filter((valor) => Number.isInteger(valor));

  // A lista de destinatários sai do que o canal exige, não de uma lista única:
  // quem autorizou e-mail não autorizou WhatsApp, e vice-versa.
  const [produtos, contatos] = await Promise.all([
    obterProdutosPorIds(produtosIds),
    canal.requer === "telefone" ? listarInscritosWhatsapp() : listarInscritosAtivos(),
  ]);

  if (contatos.length === 0) {
    return falha(
      canal.requer === "telefone"
        ? "Nenhum contato autorizou receber mensagem no WhatsApp ainda."
        : "Nenhum contato ativo na lista. Ninguém para receber esta campanha ainda.",
    );
  }

  const campanha = await criarCampanha({
    assunto,
    conteudo,
    produtosIds,
    canal: canalId,
  });

  const mensagem = { assunto, corpo: conteudo, produtos };
  let enviados = 0;
  let falhas = 0;
  const auditoria: {
    campanhaId: number;
    contatoId: number;
    canal: string;
    status: string;
    erro?: string | null;
  }[] = [];

  for (let i = 0; i < contatos.length; i += TAMANHO_DO_BLOCO) {
    const bloco = contatos.slice(i, i + TAMANHO_DO_BLOCO);

    const resultados = await Promise.all(
      bloco.map((contato) =>
        canal.enviar(
          {
            id: contato.id,
            nome: contato.nome,
            email: contato.email,
            telefone: contato.telefone,
            tokenDescadastro: contato.tokenDescadastro,
          },
          mensagem,
        ),
      ),
    );

    resultados.forEach((resultado, indice) => {
      const contato = bloco[indice]!;
      if (resultado.ok) enviados += 1;
      else falhas += 1;

      auditoria.push({
        campanhaId: campanha.id,
        contatoId: contato.id,
        canal: canalId,
        status: resultado.ok ? "enviado" : "falhou",
        erro: resultado.erro ?? null,
      });
    });
  }

  await concluirCampanha(campanha.id, { enviados, falhas });
  await registrarEnvios(auditoria);

  revalidatePath("/admin/campanhas");
  revalidatePath("/admin");

  if (enviados === 0) {
    const primeiroErro = auditoria.find((x) => x.erro)?.erro;
    return falha(
      `Nenhum e-mail saiu. ${primeiroErro ?? "Confira a configuração do canal de envio."}`,
    );
  }

  return sucesso(
    falhas > 0
      ? `Campanha enviada para ${enviados} contato(s). ${falhas} não receberam — confira a lista de envios.`
      : `Campanha enviada para ${enviados} contato(s).`,
  );
}
