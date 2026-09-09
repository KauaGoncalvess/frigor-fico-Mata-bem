# Frigorífico Mata Bem

Landing page institucional do Frigorífico Mata Bem — Sete Lagoas/MG.

Não é um sistema: não há carrinho, painel, banco de dados nem formulário. A página
apresenta a empresa a compradores profissionais (casas de carnes, supermercados,
distribuidores e indústrias) e leva ao telefone da equipe comercial.

## Rodar

```bash
npm install
npm run dev
```

Não é preciso configurar nada: o site sobe sem nenhuma variável de ambiente.
Para publicar em domínio próprio, defina `NEXT_PUBLIC_SITE_URL` (ver `.env.example`).

## Testes

```bash
npm test
```

Sobe o build de produção e roda a suíte em celular e desktop. Se o ambiente tiver
o Chromium numa build diferente da esperada pelo Playwright, aponte o binário:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/caminho/para/chrome npm test
```

## Onde mexer

| Para mudar | Arquivo |
| --- | --- |
| Textos e dados da empresa | `src/conteudo/*.ts` |
| Menu e rodape | `src/conteudo/navegacao.ts` |
| Cores, fontes e animacoes | `src/app/globals.css` |
| Uma secao | `src/components/site/<secao>.tsx` |
| Uma pagina | `src/app/<rota>/page.tsx` |

Nenhum texto e escrito direto no JSX.

## Paginas

`/` - `/frigorifico` - `/produtos` - `/qualidade` - `/sustentabilidade` - `/mercado` - `/contato`

## O que ainda falta confirmar

```bash
npm run pendencias
```

Lista tudo que veio de pesquisa publica e ainda nao foi validado pela empresa
— hoje **25 itens**. Cada um aparece na propria pagina com a etiqueta
"A confirmar", que some quando o dado vira `confirmado: true` em `src/conteudo/`.

Duas regras que o site cumpre sozinho:

- A faixa de numeros **nao vai ao ar** enquanto nenhum numero estiver
  confirmado. Cinco caixinhas escritas "a confirmar" fazem a empresa parecer
  menor, nao maior.
- O **numero do SIF nao aparece em lugar nenhum**. O briefing trazia 4127; a
  pesquisa publica aponta 585 para este frigorifico. A pagina afirma so que ha
  Inspecao Federal permanente na unidade.

## Imagens

As fotos ainda não existem. Cada `<figure>` usa o componente `Moldura`, que desenha
um gradiente com grão e **reserva a altura exata da foto** — assim a página não pula
quando ela entrar. Para colocar a foto real, passe `src`:

```tsx
<Moldura alt="..." src="/fotos/planta.jpg" className="h-[clamp(340px,56vw,620px)] w-full" />
```

Recomendação: ensaio na própria unidade. Para um comprador B2B, a foto do galpão
inspecionado vale mais que imagem genérica de rebanho.

## Antes de publicar

Os dados regulatórios vieram de pesquisa em fontes públicas, **não da empresa**.
Em `src/conteudo/empresa.ts` cada evidência carrega `confirmado: false`.

### Confere com a pesquisa pública

CNPJ, razão social, endereço, telefone (31) 2106-3355, fundação em 24/09/2004,
abate de bovinos e suínos, atendimento a casas de carnes, supermercados e
distribuidores, e a presença na lista de frigoríficos credenciados ao protocolo
de carne Wagyu certificada.

### Não confere — precisa do dono

- **Número do SIF.** O briefing trazia SIF 4127; a pesquisa pública associa este
  frigorífico ao **SIF 585**. Por isso o número **não aparece na página**: a seção
  "O rigor" afirma apenas "Inspeção Federal permanente na unidade". Confirmado o
  número correto, é uma linha em `EVIDENCIAS` para ele voltar.
- **Segundo telefone.** Um diretório lista (31) 3773-26xx além do número em uso.
- **Área construída de 6.000 m²** — sem confirmação fora da apresentação da FIEMG.
- **Licenciamento ambiental** LAC 2 deferido em 26/05/2023 e validade até 22/02/2031.
- **"Primeiro de Minas a certificar Wagyu"** — a página já atribui à FIEMG no corpo
  do texto, mas o título afirma seco.
- **Ano de fundação.** O cadastro diz 2004; há parecer ambiental de 2021 que
  menciona atuação no local desde 1995.

Para uma empresa sob inspeção federal, um número errado no site é pior que
número nenhum.
