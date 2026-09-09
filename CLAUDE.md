# Frigorífico Mata Bem

Landing page institucional estática. **Não é um sistema**: sem carrinho, sem painel
administrativo, sem banco de dados, sem formulário. A página existe para apresentar a
empresa a compradores profissionais (casas de carnes, supermercados, distribuidores e
indústrias) e levá-los ao telefone da equipe comercial.

Base visual: design "Editorial Cinematográfico" — capítulos numerados, Instrument Serif
sobre fundo quase preto, um único acento terracota, e uma seção clara no meio como clímax.

## Ao responder ao usuário

Respostas curtas. Poucas palavras, sem textão. Ele não lê blocos longos.

## Convenções

- Código e comentários em português.
- Todo texto e dado da empresa vive em `src/conteudo/empresa.ts` — nunca escrever
  conteúdo direto no JSX.
- Dados regulatórios (SIF, licenciamento, certificados) carregam `confirmado: boolean`.
  Vieram de pesquisa pública, não da empresa. Nada com `confirmado: false` deve ir ao ar
  sem o dono validar.
- Tamanhos em `clamp()`. O design é fluido e não tem breakpoint.
