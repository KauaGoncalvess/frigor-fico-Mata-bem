"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { CATEGORIAS, ROTULO_CATEGORIA, type Produto } from "@/lib/db/schema";
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

export function FormularioProduto({ produto }: { produto?: Produto }) {
  const [estado, acao, pendente] = useActionState(salvarProduto, INICIAL);

  const [imagemUrl, setImagemUrl] = useState(produto?.imagemUrl ?? "");
  const [imagemPublicId, setImagemPublicId] = useState(produto?.imagemPublicId ?? "");
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState("");
  const entradaArquivo = useRef<HTMLInputElement>(null);

  const [emOferta, setEmOferta] = useState(produto?.emOferta ?? false);

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

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        {/* Foto */}
        <div className="flex flex-col gap-2">
          <span className={rotulo}>Foto do corte</span>
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
            <span className={rotulo}>Nome do corte *</span>
            <input
              name="nome"
              required
              maxLength={120}
              defaultValue={produto?.nome ?? ""}
              placeholder="Ex: Picanha maturada"
              className={campo}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
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
              <span className={rotulo}>Preço por quilo *</span>
              <span className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-creme-muted">
                  R$
                </span>
                <input
                  name="preco"
                  required
                  inputMode="decimal"
                  defaultValue={reais(produto?.precoCentavos ?? null)}
                  placeholder="49,90"
                  className={`${campo} pl-10`}
                />
              </span>
            </label>
          </div>

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

          <input type="hidden" name="unidade" value={produto?.unidade ?? "kg"} />

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
                Desmarque quando acabar o estoque — o corte fica visível, mas sem botão de
                pedir.
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
          {pendente ? "Salvando..." : produto ? "Salvar alterações" : "Cadastrar corte"}
        </button>
      </div>
    </form>
  );
}
