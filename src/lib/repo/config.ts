import "server-only";
import { eq } from "drizzle-orm";
import { bancoConfigurado, db } from "@/lib/db";
import { configLoja, type ConfigLoja } from "@/lib/db/schema";
import { estadoDemo } from "@/lib/demo/armazem";
import { HORARIO_PADRAO } from "@/lib/horario";

const PADRAO: ConfigLoja = {
  id: 1,
  nome: "Frigorífico Mata Bem",
  whatsapp: "5511999999999",
  endereco: "Cadastre o endereço no painel",
  horario: "Cadastre o horário no painel",
  telefone: null,
  instagram: null,
  facebook: null,
  mapsUrl: null,
  entregaAtiva: false,
  entregaTexto: null,
  taxaEntregaCentavos: null,
  pedidoMinimoCentavos: null,
  horarios: HORARIO_PADRAO,
  atualizadoEm: new Date(),
};

/** Sempre devolve algo renderizável — a loja não pode quebrar por config faltando. */
export async function obterConfig(): Promise<ConfigLoja> {
  if (!bancoConfigurado) return estadoDemo().config;
  try {
    const [linha] = await db().select().from(configLoja).where(eq(configLoja.id, 1)).limit(1);
    return linha ?? PADRAO;
  } catch {
    return PADRAO;
  }
}

export async function salvarConfig(dados: Partial<ConfigLoja>): Promise<ConfigLoja> {
  if (!bancoConfigurado) {
    const estado = estadoDemo();
    estado.config = { ...estado.config, ...dados, id: 1, atualizadoEm: new Date() };
    return estado.config;
  }
  const atual = await obterConfig();
  const valores = { ...atual, ...dados, id: 1, atualizadoEm: new Date() };
  const [linha] = await db()
    .insert(configLoja)
    .values(valores)
    .onConflictDoUpdate({ target: configLoja.id, set: valores })
    .returning();
  return linha;
}
