/**
 * A operação em seis etapas.
 *
 * Frigorífico não se apresenta como "empresa que vende carne": é operação
 * industrial. Mostrar o encadeamento é o que prova qualidade — melhor que
 * qualquer adjetivo na home.
 *
 * O texto aqui descreve o que qualquer planta sob inspeção federal faz. Não
 * afirma capacidade, volume nem tecnologia específica: isso depende do dono.
 */
export const ETAPAS = [
  {
    numero: "01",
    titulo: "Origem",
    texto: "Seleção e relacionamento com produtores da cidade e da região.",
  },
  {
    numero: "02",
    titulo: "Recepção",
    texto: "Controle e inspeção da matéria-prima na chegada à unidade.",
  },
  {
    numero: "03",
    titulo: "Processamento",
    texto: "Procedimentos padronizados, com controle de qualidade em linha.",
  },
  {
    numero: "04",
    titulo: "Inspeção",
    texto: "Monitoramento dos processos e segurança dos alimentos.",
  },
  {
    numero: "05",
    titulo: "Embalagem",
    texto: "Preparação adequada para armazenamento e distribuição.",
  },
  {
    numero: "06",
    titulo: "Distribuição",
    texto: "Logística para atender casas de carnes, supermercados e indústrias.",
  },
] as const;

/** A cadeia da rastreabilidade, do produtor ao cliente. */
export const RASTREIO = [
  {
    etapa: "Produtor",
    detalhe:
      "Cada lote entra com identificação de origem. O relacionamento com o " +
      "produtor é o primeiro elo do controle.",
  },
  {
    etapa: "Transporte",
    detalhe:
      "O deslocamento até a unidade é documentado, com atenção ao bem-estar " +
      "do animal durante o trajeto.",
  },
  {
    etapa: "Frigorífico",
    detalhe:
      "Recepção sob Inspeção Federal permanente, com conferência da " +
      "documentação sanitária do lote.",
  },
  {
    etapa: "Processamento",
    detalhe:
      "Cada etapa é registrada, o que permite reconstituir o caminho de um " +
      "produto até a sua origem.",
  },
  {
    etapa: "Embalagem",
    detalhe:
      "A identificação acompanha o produto embalado, ligando o que sai da " +
      "unidade ao lote que entrou.",
  },
  {
    etapa: "Cliente",
    detalhe:
      "O cliente recebe o produto com a informação necessária para o seu " +
      "próprio controle de qualidade.",
  },
] as const;
