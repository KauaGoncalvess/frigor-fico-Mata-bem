# Frigorífico Mata Bem

Site de vendas para frigorífico/açougue: o cliente monta o pedido no site e
envia pronto para o WhatsApp da loja. O dono cuida de cortes, preços, ofertas e
comunicação num painel separado, sem precisar de código.

- **Loja** (`/`) — vitrine, catálogo com busca e filtro, kits prontos, carrinho
  sempre à vista, atalho de recompra e fechamento no WhatsApp.
- **Painel** (`/admin`) — login, dashboard, cadastro de produtos e kits, ofertas
  da semana, histórico de pedidos, base de contatos e disparo de campanhas.

## Retirada hoje, entrega quando quiser

A loja opera **só com retirada no balcão**, e o site inteiro fala essa língua:
nenhum texto promete entrega. A entrega está implementada e desligada por uma
chave em **Painel → Minha loja → Também fazemos entrega**. Ao ligar, aparecem
a escolha "retirar / receber em casa" no carrinho, o campo de endereço, a taxa
somada ao total e o aviso de quanto falta para o pedido mínimo — e a modalidade
passa a viajar na mensagem do WhatsApp.

Prometer entrega antes de a entrega existir é o jeito mais rápido de queimar a
confiança na primeira compra; por isso a chave começa desligada e o servidor
ignora pedido marcado como entrega enquanto ela estiver assim.

---

## Como rodar

```bash
npm install
cp .env.example .env.local     # preencha o que for usar
npm run dev                    # http://localhost:3000
```

O site **sobe mesmo sem banco de dados**. Sem `DATABASE_URL` ele entra em modo
demonstração: o catálogo de exemplo aparece, o painel funciona inteiro e um
aviso avisa que as alterações somem quando o servidor reinicia. Isso existe para
você conseguir publicar e mostrar o site antes de contratar o banco.

### Criar o acesso ao painel

```bash
npm run admin:criar
```

O comando pede nome, e-mail e senha, gera o hash bcrypt e imprime as variáveis
prontas. Com `DATABASE_URL` configurada ele grava direto na tabela
`admin_users`.

> **Cuidado com o hash no arquivo `.env`:** ele é cheio de cifrões
> (`$2b$12$...`) e o leitor de `.env` do Next expande `$VAR`. Num arquivo
> `.env` **cada cifrão precisa de barra invertida** (`\$2b\$12\$...`) — aspas
> não resolvem. No painel da Vercel é o contrário: cole o hash cru. O comando
> acima já imprime as duas versões. Se errar, a tela de login diz exatamente o
> que corrigir em vez de só recusar a senha.

### Banco de dados

```bash
npm run db:gerar     # gera a migração a partir do schema
npm run db:migrar    # aplica no banco
npm run db:semear    # (opcional) catálogo inicial para editar
```

---

## Publicar na Vercel

1. Importe o repositório na Vercel.
2. Cadastre as variáveis de ambiente (veja `.env.example`). O mínimo para
   funcionar de verdade: `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL` e
   `ADMIN_SENHA_HASH`.
3. `AUTH_SECRET` precisa de no mínimo 32 caracteres — gere com
   `openssl rand -base64 32`.
4. Rode `npm run db:migrar` apontando para o banco de produção.
5. Entre em `/admin`, ajuste os dados em **Minha loja** (principalmente o
   número do WhatsApp) e cadastre os cortes.

Use a connection string **com pooler** do Neon (o host tem `-pooler` no nome):
é a que aguenta o modelo serverless da Vercel.

---

## O que ajuda a vender

- **Kits com preço fechado.** Um kit é composto por cortes reais com
  quantidade; o site mostra a composição e calcula a economia frente às peças
  avulsas. Se qualquer peça acaba, o kit sai da loja sozinho — melhor sumir do
  que o cliente descobrir a falta no balcão. No cadastro, o painel avisa se o
  kit ficou mais caro que a soma das peças.
- **Repetir último pedido.** O pedido anterior fica no aparelho do cliente (só
  id e quantidade, nunca preço) e o atalho remonta o carrinho com os preços de
  hoje, avisando o que saiu de estoque. Carne é compra semanal e quase sempre
  a mesma.
- **Venda por quilo ou por peça.** Frango inteiro, carvão e bandeja se vendem
  por unidade; o botão +/- respeita isso (0,5 kg para peso, 1 un para peça).
- **Aberto ou fechado agora.** Horário estruturado por dia da semana, calculado
  no fuso da loja — não no do visitante. Fora do horário, o cliente vê quando a
  loja abre em vez de mandar pedido no vazio.
- **Achado no Google e no WhatsApp.** JSON-LD de loja local com endereço,
  telefone e horário; `sitemap`, `robots` e imagem de preview gerada, para o
  link não cair no grupo da família como um retângulo cinza.
- **Ícone na tela inicial.** Manifest e ícones prontos: um toque para pedir de
  novo, sem procurar link.

## Fotos dos produtos

Enquanto um corte não tem foto, o site desenha uma arte própria de fallback —
cada categoria com sua temperatura de cor e cada produto com uma variação, para
o catálogo não virar um carimbo repetido. Não fica buraco cinza de imagem
quebrada, mas **foto de verdade é o que vende**: configure o Cloudinary e suba
as fotos pelo painel. O upload já comprime a imagem no navegador antes de
enviar, o que economiza o 4G de quem cadastra no balcão.

---

## Comunicação: um canal ligado, dois prontos

Toda comunicação passa por uma interface única (`MessageChannel`, em
`src/lib/canais/tipos.ts`). A tela de campanhas não sabe qual canal está ativo:
ela chama `enviar()` e segue. Trocar ou somar canal é acrescentar uma
implementação e virar uma flag — nada muda no resto do sistema.

| Canal | Situação | Por quê |
|---|---|---|
| **E-mail** (Resend) | **Ativo** | Custo baixo, sem risco de bloqueio de conta. Serve para começar e construir a base. Converte pouco nesse público — o valor real aqui é capturar contatos. |
| **WhatsApp via Evolution API** | Pronto, desligado | API **não oficial** (roda sobre o WhatsApp Web). Disparo de ofertas em massa tem risco real de banimento — e o número da loja é o canal de venda. Só considerar com número secundário, volume baixo e risco assumido por escrito. |
| **WhatsApp Cloud API** (Meta) | Pronto, desligado | Caminho recomendado quando a recorrência virar prioridade: oficial, sem risco de banimento, com template aprovado. Exige conta Meta Business verificada e tem custo por conversa. |

Os dois canais de WhatsApp estão **implementados**, não esboçados: ficam atrás
de `CANAL_EVOLUTION_ATIVO` e `CANAL_WHATSAPP_CLOUD_ATIVO`, ambos `false`. Sem
custo e sem risco até alguém decidir ligar. O painel mostra a situação de cada
um e o motivo de estar desligado.

---

## Segurança

- **Senha** com bcrypt (custo 12). Nenhuma credencial no código.
- **Sessão** em cookie assinado (JWT HS256), `httpOnly`, `secure` em produção,
  `sameSite=lax`, 8 horas. Algoritmo fixado na verificação, para um token
  forjado com `alg: none` não passar.
- **Autorização no servidor**: o middleware é a primeira tranca, mas quem
  decide é a checagem dentro de cada página e cada Server Action, junto do
  dado. Esconder botão no frontend não protege nada.
- **Login**: mesma mensagem para e-mail inexistente e senha errada, e o mesmo
  tempo de resposta nos dois casos (senão a demora entrega quais e-mails
  existem). Rate limit por IP **e** por e-mail.
- **Rate limiting** persistido no Postgres. Contador em memória em função
  serverless é zerado a cada instância nova, o que deixaria a força bruta
  praticamente livre.
- **Upload**: exige sessão, confere a origem da requisição, limita tamanho e
  valida a **assinatura real do arquivo** (magic bytes) — o `type` do navegador
  e a extensão são só texto, qualquer um edita. O nome do arquivo do usuário
  nunca vira nome no CDN.
- **Preços**: o navegador manda só id e quantidade; preço e nome vêm do banco.
  Se o preço viesse do cliente, dava para registrar picanha por R$ 1.
- **SQL**: tudo por ORM com query parametrizada, sem concatenação.
- **Exportação CSV**: campos que começam com `=`, `+`, `-` ou `@` são
  neutralizados — senão um contato chamado `=HYPERLINK(...)` vira fórmula
  executada quando o dono abre a planilha.
- **Segredos** só em variáveis de ambiente, nunca no cliente.
- **Formulário público** com honeypot e verificação de tempo de preenchimento.
- **LGPD**: consentimento explícito (checkbox desmarcado), data do
  consentimento registrada, link de descadastro em todo e-mail, página de
  descadastro por token e base de contatos protegida por sessão.

---

## Decisões que valem explicar

**Sem 3D.** O acento visual do topo é feito com camadas de gradiente e uma
animação de brasa em CSS. Uma cena WebGL custaria centenas de KB de JavaScript
e engasgaria justamente nos aparelhos mais simples, que são a maior parte do
público. O ganho visual não pagaria a conta.

**Total sempre "estimado".** Carne é vendida por peso e a peça real varia. A
mensagem do WhatsApp diz isso com todas as letras, o que evita discussão na
entrega.

**Oferta com validade.** Passou da data, o preço normal volta sozinho na loja —
e o painel continua mostrando a oferta vencida para o dono resolver, em vez de
sumir silenciosamente.

**Modalidade também não se confia ao cliente.** Assim como o preço, a
modalidade é decidida no servidor: com a entrega desligada, um pedido marcado
como entrega no JSON é registrado como retirada.

---

## Estrutura

```
src/
  app/
    page.tsx                 loja
    sitemap.ts robots.ts     descoberta em busca
    opengraph-image.tsx      preview ao compartilhar o link
    manifest.ts apple-icon   instalação na tela inicial
    admin/login/             entrada do painel
    admin/(painel)/          área logada (guarda no layout)
    api/                     contatos, pedidos, upload
  components/loja/           vitrine, catálogo, carrinho
  components/admin/          peças de interface do painel
  lib/
    canais/                  MessageChannel + implementações
    db/                      schema e conexão
    repo/                    acesso a dados (com fallback demo)
    auth/                    senha, token e sessão
    horario.ts               aberto/fechado no fuso da loja
    seguranca/               rate limiting
scripts/                     criar admin, semear banco
drizzle/                     migrações
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run admin:criar` | Cria/atualiza o administrador |
| `npm run db:gerar` | Gera migração a partir do schema |
| `npm run db:migrar` | Aplica migrações |
| `npm run db:semear` | Catálogo inicial de exemplo |
