import { Award, Clock, MessageCircle, Truck } from "lucide-react";
import { Revelar } from "./revelar";

const SELOS = [
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
  {
    icone: Truck,
    titulo: "Entrega na região",
    texto: "Sai refrigerado e chega no mesmo dia.",
  },
  {
    icone: Clock,
    titulo: "Pedido em 3 passos",
    texto: "Escolher, revisar e enviar. Só isso.",
  },
];

export function Selos() {
  return (
    <section className="border-y border-carvao-800 bg-carvao-900/50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-8 sm:gap-6 lg:grid-cols-4">
        {SELOS.map((selo, indice) => (
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
