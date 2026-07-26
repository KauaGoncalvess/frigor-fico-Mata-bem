"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import {
  CATEGORIAS,
  ROTULO_CATEGORIA,
  UNIDADES,
  type KitItem,
  type Produto,
} from "@/lib/db/schema";
import { formatarPreco } from "@/lib/format";
import { precoEfetivo } from "@/lib/produto";
import type { RespostaAcao } from "@/lib/admin/guarda";
import { salvarProduto } from "./acoes";

const INICIAL: RespostaAcao = { ok: false, mensagem: "" };

const rotulo = "text-[12.5px] font-semibold text-creme-muted";
const campo =
  "h-12 w-full rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 text-sm text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none";

function paraCampoData(data: Date | null): string {
  if (!data) return "";
  const d = new Date(data);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function reais(centavos: number | null): string {
  if (centavos == null) return "";
  return (centavos / 100).toFixed(2).replace(".", ",");
}

/**
 * Reduz a foto no próprio navegador antes de subir.
 *
 * Foto de celular hoje passa fácil de 5 MB; no 4G do balcão isso é uma
 * eternidade. Reduzir aqui deixa o upload rápido e ainda economiza banda do
 * cliente. Se o navegador for antigo demais, manda o arquivo original.
 */
async function comprimir(arquivo: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(arquivo);
    const maximo = 1400;
    const escala = Math.min(1, maximo / Math.max(bitmap.width, bitmap.height));
    const largura = Math.round(bitmap.width * escala);
    const altura = Math.round(bitmap.height * escala);

    const tela = document.createElement("canvas");
    tela.width = largura;
    tela.height = altura;
    const contexto = tela.getContext("2d");
    if (!contexto) return arquivo;
    contexto.drawImage(bitmap, 0, 0, largura, altura);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolver) =>
      tela.toBlob(resolver, "image/webp", 0.82),
    );
    return blob && blob.size < arquivo.size ? blob : arquivo;
  } catch {
    return arquivo;
  }
}

type LinhaKit = { chave: number; produtoId: string; quantidade: string };

export function FormularioProduto({
  produto,
  cortes,
  componentes = [],
}: {
  produto?: Produto;
  /** Cortes que podem virar item de kit (kit dentro de kit não faz sentido). */
  cortes: Produto[];
  componentes?: KitItem[];
}) {
  const [estado, acao, pendente] = useActionState(salvarProduto, INICIAL);

  const [imagemUrl, setImagemUrl] = useState(produto?.imagemUrl ?? "");
  const [imagemPublicId, setImagemPublicId] = useState(produto?.imagemPublicId ?? "");
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState("");
  const entradaArquivo = useRef<HTMLInputElement>(null);

  const [emOferta, setEmOferta] = useState(produto?.emOferta ?? false);
  const [tipo, setTipo] = useState(produto?.tipo ?? "corte");
  const [unidade, setUnidade] = useState(produto?.unidade ?? "kg");
  const [preco, setPreco] = useState(reais(produto?.precoCentavos ?? null));

  const [linhasKit, setLinhasKit] = useState<LinhaKit[]>(() =>
    componentes.length > 0
      ? componentes.map((item, indice) => ({
          chave: indice,
          produtoId: String(item.produtoId),
          quantidade: String(item.quantidade).replace(".", ","),
        }))
      : [{ chave: 0, produtoId: "", quantidade: "1" }],
  );

  const porId = useMemo(() => new Map(cortes.map((x) => [x.id, x])), [cortes]);

  /** Soma o que as peças custariam avulsas — mostra ao dono o desconto que ele está dando. */
  const somaAvulsa = useMemo(() => {
    return linhasKit.reduce((soma, linha) => {
      const peca = porId.get(Number(linha.produtoId));
      const quantidade = Number(linha.quantidade.replace(",", "."));
      if (!peca || !Number.isFinite(quantidade) || quantidade <= 0) return soma;
      return soma + Math.round(precoEfetivo(peca) * quantidade);
    }, 0);
  }, [linhasKit, porId]);

  const precoKitCentavos = Math.round(
    Number(preco.replace(/\./g, "").replace(",", ".")) * 100,
  );
  const economia =
    Number.isFinite(precoKitCentavos) && precoKitCentavos > 0
      ? somaAvulsa - precoKitCentavos
      : 0;

  const enviarFoto = async (arquivo: File) => {
    setErroFoto("");
    setEnviandoFoto(true);
    try {
      const comprimida = await comprimir(arquivo);
      const corpo = new FormData();
      corpo.append("arquivo", comprimida, "produto.webp");

      const resposta = await fetch("/api/admin/upload", { method: "POST", body: corpo });
      const dados = (await resposta.json().catch(() => ({}))) as {
        url?: string;
        publicId?: string;
        mensagem?: string;
      };

      if (!resposta.ok || !dados.url) {
        setErroFoto(dados.mensagem ?? "Não conseguimos enviar a foto.");
        return;
      }
      setImagemUrl(dados.url);
      setImagemPublicId(dados.publicId ?? "");
    } catch {
      setErroFoto("Sem conexão para enviar a foto agora.");
    } finally {
      setEnviandoFoto(false);
      if (entradaArquivo.current) entradaArquivo.current.value = "";
    }
  };

  const ehKit = tipo === "kit";

  return (
    <form action={acao} className="flex flex-col gap-5">
      {produto && <input type="hidden" name="id" value={produto.id} />}
      <input type="hidden" name="imagemUrl" value={imagemUrl} />
      <input type="hidden" name="imagemPublicId" value={imagemPublicId} />

      {estado.mensagem && !estado.ok && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-erro/40 bg-erro/10 px-4 py-3 text-[13px] text-creme"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-erro" />
          {estado.mensagem}
        </p>
      )}

      {/* Corte solto ou kit fechado */}
      <div className="flex flex-col gap-2">
        <span className={rotulo}>O que você está cadastrando?</span>
        <div className="grid gap-2 sm:max-w-md sm:grid-cols-2">
          {(
            [
              { valor: "corte", titulo: "Corte", texto: "Vendido por peso ou peça." },
              { valor: "kit", titulo: "Kit", texto: "Vários cortes, preço fechado." },
            ] as const
          ).map((opcao) => (
            <label
              key={opcao.valor}
              className={`cursor-pointer rounded-xl border px-4 py-3 transition ${
                tipo === opcao.valor
                  ? "border-ambar-500 bg-ambar-500/10"
                  : "border-carvao-700 bg-carvao-850 hover:border-carvao-500"
              }`}
            >
              <input
                type="radio"
                name="tipo"
                value={opcao.valor}
                checked={tipo === opcao.valor}
                onChange={() => setTipo(opcao.valor)}
                className="sr-only"
              />
              <span className="block text-[13.5px] font-semibold text-creme">
                {opcao.titulo}
              </span>
              <span className="block text-[12px] text-creme-muted">{opcao.texto}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        {/* Foto */}
        <div className="flex flex-col gap-2">
          <span className={rotulo}>Foto</span>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-dashed border-carvao-600 bg-carvao-850">
            {imagemUrl ? (
              <Image src={imagemUrl} alt="Prévia" fill sizes="260px" className="object-cover" />
            ) : (
              <div className="grid h-full place-items-center px-4 text-center">
                <span className="text-[12px] leading-snug text-creme-muted">
                  Sem foto ainda.
                  <br />
                  Produto com foto vende bem mais.
                </span>
              </div>
            )}

            {enviandoFoto && (
              <div className="absolute inset-0 grid place-items-center bg-carvao-950/70">
                <Loader2 size={22} className="animate-spin text-ambar-400" />
              </div>
            )}
          </div>

          <input
            ref={entradaArquivo}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(evento) => {
              const arquivo = evento.target.files?.[0];
              if (arquivo) void enviarFoto(arquivo);
            }}
          />

          <div className="flex gap-2">
            <button
              type="button"
              disabled={enviandoFoto}
              onClick={() => entradaArquivo.current?.click()}
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-carvao-600 text-[13px] font-semibold text-creme transition hover:border-carvao-500 hover:bg-carvao-850 disabled:opacity-50"
            >
              <ImagePlus size={15} />
              {imagemUrl ? "Trocar" : "Enviar foto"}
            </button>
            {imagemUrl && (
              <button
                type="button"
                onClick={() => {
                  setImagemUrl("");
                  setImagemPublicId("");
                }}
                aria-label="Remover foto"
                className="grid h-10 w-10 place-items-center rounded-lg border border-carvao-600 text-creme-muted transition hover:border-erro/50 hover:text-erro"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          {erroFoto && <p className="text-[12px] text-erro">{erroFoto}</p>}
        </div>

        {/* Dados */}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={rotulo}>{ehKit ? "Nome do kit *" : "Nome do corte *"}</span>
            <input
              name="nome"
              required
              maxLength={120}
              defaultValue={produto?.nome ?? ""}
              placeholder={ehKit ? "Ex: Kit churrasco 5 pessoas" : "Ex: Picanha maturada"}
              className={campo}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className={rotulo}>Categoria *</span>
              <select
                name="categoria"
                required
                defaultValue={produto?.categoria ?? "bovino"}
                className={campo}
              >
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {ROTULO_CATEGORIA[categoria]}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={rotulo}>Vendido por *</span>
              <select
                name="unidade"
                value={ehKit ? "un" : unidade}
                onChange={(evento) => setUnidade(evento.target.value)}
                disabled={ehKit}
                className={`${campo} disabled:opacity-60`}
              >
                {UNIDADES.map((valor) => (
                  <option key={valor} value={valor}>
                    {valor === "kg" ? "Quilo (kg)" : "Peça (un)"}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-creme-muted">
                {ehKit
                  ? "Kit sai sempre por peça."
                  : unidade === "kg"
                    ? "Cliente escolhe de meio em meio quilo."
                    : "Ex: frango inteiro, carvão, bandeja."}
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={rotulo}>
                {ehKit ? "Preço do kit *" : `Preço por ${unidade === "kg" ? "quilo" : "peça"} *`}
              </span>
              <span className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-creme-muted">
                  R$
                </span>
                <input
                  name="preco"
                  required
                  inputMode="decimal"
                  value={preco}
                  onChange={(evento) => setPreco(evento.target.value)}
                  placeholder="49,90"
                  className={`${campo} pl-10`}
                />
              </span>
            </label>
          </div>

          {/* Composição do kit */}
          {ehKit && (
            <div className="rounded-xl border border-ambar-500/30 bg-carvao-850 p-4">
              <div className="mb-3">
                <h2 className="text-[14px] font-semibold text-creme">O que vai no kit *</h2>
                <p className="text-[12px] text-creme-muted">
                  Se qualquer peça ficar sem estoque, o kit sai da loja sozinho.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {linhasKit.map((linha, indice) => (
                  <div key={linha.chave} className="flex items-center gap-2">
                    <select
                      name="kitProdutoId"
                      value={linha.produtoId}
                      onChange={(evento) =>
                        setLinhasKit((atuais) =>
                          atuais.map((x, i) =>
                            i === indice ? { ...x, produtoId: evento.target.value } : x,
                          ),
                        )
                      }
                      className="h-11 min-w-0 flex-1 rounded-lg border border-carvao-700 bg-carvao-900 px-3 text-[13px] text-creme focus:border-ambar-500 focus:outline-none"
                    >
                      <option value="">Escolha o corte...</option>
                      {cortes.map((corte) => (
                        <option key={corte.id} value={corte.id}>
                          {corte.nome} ({formatarPreco(precoEfetivo(corte))}/{corte.unidade})
                        </option>
                      ))}
                    </select>

                    <input
                      name="kitQuantidade"
                      inputMode="decimal"
                      value={linha.quantidade}
                      onChange={(evento) =>
                        setLinhasKit((atuais) =>
                          atuais.map((x, i) =>
                            i === indice ? { ...x, quantidade: evento.target.value } : x,
                          ),
                        )
                      }
                      aria-label="Quantidade"
                      className="h-11 w-20 rounded-lg border border-carvao-700 bg-carvao-900 px-3 text-center text-[13px] text-creme focus:border-ambar-500 focus:outline-none"
                    />
                    <span className="w-6 text-[12px] text-creme-muted">
                      {porId.get(Number(linha.produtoId))?.unidade ?? ""}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setLinhasKit((atuais) =>
                          atuais.length === 1
                            ? atuais
                            : atuais.filter((_, i) => i !== indice),
                        )
                      }
                      aria-label="Remover item do kit"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-carvao-700 text-creme-muted transition hover:border-erro/50 hover:text-erro"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setLinhasKit((atuais) => [
                    ...atuais,
                    { chave: Date.now(), produtoId: "", quantidade: "1" },
                  ])
                }
                className="mt-3 flex items-center gap-1.5 rounded-lg border border-carvao-600 px-3 py-2 text-[12.5px] font-semibold text-creme transition hover:border-ambar-500/60 hover:text-ambar-400"
              >
                <Plus size={14} />
                Adicionar corte
              </button>

              {somaAvulsa > 0 && (
                <div className="mt-4 border-t border-carvao-700 pt-3 text-[12.5px]">
                  <p className="flex justify-between text-creme-muted">
                    <span>Comprando as peças separadas</span>
                    <span className="tabular-nums">{formatarPreco(somaAvulsa)}</span>
                  </p>
                  {precoKitCentavos > 0 && (
                    <p
                      className={`mt-1 flex justify-between font-semibold ${
                        economia > 0 ? "text-sucesso" : "text-alerta"
                      }`}
                    >
                      <span>
                        {economia > 0
                          ? "Cliente economiza"
                          : "Atenção: o kit está mais caro que as peças"}
                      </span>
                      <span className="tabular-nums">
                        {economia > 0 ? formatarPreco(economia) : formatarPreco(-economia)}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className={rotulo}>Descrição curta</span>
            <textarea
              name="descricao"
              rows={3}
              maxLength={400}
              defaultValue={produto?.descricao ?? ""}
              placeholder="Ex: peça inteira, maturada 21 dias, capa de gordura generosa."
              className="w-full resize-none rounded-xl border border-carvao-700 bg-carvao-850 px-3.5 py-3 text-sm text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none"
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-carvao-700 bg-carvao-850 px-4 py-3">
            <input
              type="checkbox"
              name="disponivel"
              defaultChecked={produto?.disponivel ?? true}
              className="h-4 w-4 accent-sucesso"
            />
            <span className="text-[13px]">
              <span className="block font-semibold text-creme">Disponível para venda</span>
              <span className="block text-creme-muted">
                Desmarque quando acabar o estoque — o item sai do site na hora.
              </span>
            </span>
          </label>

          {/* Oferta */}
          <div className="rounded-xl border border-carvao-700 bg-carvao-850 px-4 py-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="emOferta"
                checked={emOferta}
                onChange={(evento) => setEmOferta(evento.target.checked)}
                className="h-4 w-4 accent-brasa-500"
              />
              <span className="text-[13px]">
                <span className="block font-semibold text-creme">Oferta da semana</span>
                <span className="block text-creme-muted">
                  Aparece com preço riscado no destaque da loja.
                </span>
              </span>
            </label>

            {emOferta && (
              <div className="mt-4 grid gap-4 border-t border-carvao-700 pt-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className={rotulo}>Preço promocional *</span>
                  <span className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-creme-muted">
                      R$
                    </span>
                    <input
                      name="precoPromo"
                      inputMode="decimal"
                      defaultValue={reais(produto?.precoPromoCentavos ?? null)}
                      placeholder="39,90"
                      className={`${campo} pl-10`}
                    />
                  </span>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={rotulo}>Vale até</span>
                  <input
                    name="ofertaAte"
                    type="date"
                    defaultValue={paraCampoData(produto?.ofertaAte ?? null)}
                    className={campo}
                  />
                  <span className="text-[11px] text-creme-muted">
                    Depois dessa data o preço normal volta sozinho.
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-carvao-800 pt-5 sm:flex-row sm:justify-end">
        <Link
          href="/admin/produtos"
          className="flex h-12 items-center justify-center rounded-xl border border-carvao-600 px-6 text-[14px] font-semibold text-creme-muted transition hover:text-creme"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pendente || enviandoFoto}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brasa-600 px-8 text-[14px] font-bold text-white transition hover:bg-brasa-500 active:scale-[0.99] disabled:opacity-60"
        >
          {pendente && <Loader2 size={16} className="animate-spin" />}
          {pendente
            ? "Salvando..."
            : produto
              ? "Salvar alterações"
              : ehKit
                ? "Cadastrar kit"
                : "Cadastrar corte"}
        </button>
      </div>
    </form>
  );
}
