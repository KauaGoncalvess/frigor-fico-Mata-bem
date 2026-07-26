import { Award, Clock, MessageCircle, Store, Truck } from "lucide-react";
import { Revelar } from "./revelar";

/**
 * Selos de confiança.
 *
 * O selo de logística acompanha a realidade da loja: enquanto a entrega não
 * existe, o site fala de retirada. Prometer entrega que a loja não faz é o
 * jeito mais rápido de perder o cliente na primeira compra.
 */
export function Selos({ entregaAtiva }: { entregaAtiva: boolean }) {
  const selos = [
    {
      icone: Award,
      titulo: "Cortes selecionados",
      texto: "Escolhidos peça a peça, com procedência conferida.",
    },
    {
      icone: MessageCircle,
      titulo: "Atendimento humano",
      texto: "Quem responde é o açougueiro, não um robô.",
    },
    entregaAtiva
      ? {
          icone: Truck,
          titulo: "Entrega na região",
          texto: "Sai refrigerado e chega no mesmo dia.",
        }
      : {
          icone: Store,
          titulo: "Retire no balcão",
          texto: "A gente separa e embala; você passa e leva.",
        },
    {
      icone: Clock,
      titulo: "Pedido em 3 passos",
      texto: "Escolher, revisar e enviar. Só isso.",
    },
  ];

  return (
    <section className="border-y border-carvao-800 bg-carvao-900/50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-8 sm:gap-6 lg:grid-cols-4">
        {selos.map((selo, indice) => (
          <Revelar key={selo.titulo} atraso={indice * 0.06}>
            <div className="flex flex-col gap-2 p-2 sm:p-0">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-ambar-500/25 bg-ambar-500/10 text-ambar-400">
                <selo.icone size={18} />
              </span>
              <h3 className="text-[15px] font-semibold text-creme">{selo.titulo}</h3>
              <p className="text-[12.5px] leading-snug text-creme-muted">{selo.texto}</p>
            </div>
          </Revelar>
        ))}
      </div>
    </section>
  );
}
