"use server";

import { revalidatePath } from "next/cache";
import { exigirSessao } from "@/lib/admin/guarda";
import { excluirContato } from "@/lib/repo/contatos";

/**
 * Apaga o contato de vez.
 *
 * A política de privacidade promete que quem pedir tem os dados apagados —
 * isto é o que torna a promessa cumprível sem mexer no banco na mão. Diferente
 * do descadastro, aqui não sobra registro: é exclusão, não opt-out.
 */
export async function apagarContato(formData: FormData): Promise<void> {
  await exigirSessao();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await excluirContato(id);
  revalidatePath("/admin/contatos");
  revalidatePath("/admin");
}
