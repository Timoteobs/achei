# Achei

## API

A instância compartilhada do Axios está em `src/services/api.ts`, com timeout
de 15 segundos. Use caminhos relativos à API:

```ts
import { api } from "./services/api";

const { data } = await api.post("/auth/login", { email, password });
```

Por padrão, a URL base é `/api`. Com o backend rodando no perfil `https`,
o proxy do Vite encaminha as chamadas para `https://localhost:7092/api`,
evitando CORS no desenvolvimento. O proxy aceita o certificado HTTPS local
do ASP.NET; essa configuração fica restrita ao servidor de desenvolvimento.

Para alterar a URL base, copie `.env.example` para `.env.local` e ajuste
`VITE_API_URL`. Reinicie o Vite após alterar o arquivo. Em produção, configure
a URL pública do backend (incluindo `/api`) e o CORS correspondente, ou sirva
`/api` por um proxy no mesmo domínio do frontend.

Login e cadastro usam os hooks em `src/hooks/auth`, com mutations do TanStack
Query e chamadas Axios em `src/services/auth.ts`. O Axios envia o token Bearer
nas chamadas autenticadas e encerra a sessão quando a API responde `401` para
o token atual. Os erros continuam disponíveis para tratamento nos formulários.

O `QueryClient` fica em `src/query-client.ts` e é disponibilizado globalmente pelo
`QueryClientProvider`. Os hooks `useLoginMutation` e `useRegisterMutation`
controlam carregamento, sucesso e erro, salvam a sessão no Zustand e exibem os
feedbacks pelo Sonner. Os formulários usam `isPending` junto ao estado de
validação do React Hook Form para impedir novos envios enquanto aguardam.

As mutations de autenticação não repetem chamadas automaticamente nem ficam
aguardando reconexão: falhas são informadas para uma nova tentativa manual.
O cache dessas mutations é descartado quando deixam de ser observadas, e o
cache do cliente é limpo ao criar ou encerrar uma sessão. O cache do Query
permanece apenas em memória; a persistência da sessão continua no Zustand.

## Consulta de espaços

A Home e a página “Meus espaços” consultam `GET /api/spaces` por meio de
`useSpacesQuery`. Ao abrir um card, `useSpaceQuery` consulta
`GET /api/spaces/{id}` para carregar os dados do espaço, inclusive em acesso direto.
Os serviços ficam em `src/services/spaces.ts` e usam o Bearer do Axios.

As queries têm cache separado por usuário, validade de 30 segundos e cancelamento
via `AbortSignal`. A interface trata carregamento, lista vazia, erro com nova
tentativa e espaço inexistente/sem acesso. Erros das consultas usam o Sonner;
respostas `401` mantêm o encerramento de sessão existente.

Os cards mostram nome, descrição e imagem, sem contagens fictícias. A visão geral
usa também a data de criação retornada pela API. Itens, membros e atividades
ainda usam seus mocks.

## Consulta de ambientes

A aba Ambientes, a prévia da visão geral e o total de ambientes do resumo usam
`GET /api/spaces/{spaceId}/rooms`, via `src/services/rooms.ts` e `useRoomsQuery`.
A chamada utiliza o token Bearer do Axios, cancelamento por `AbortSignal` e cache
compartilhado por usuário e espaço, com validade de 30 segundos.

Os cards exibem o nome, o ícone, a cor e `boxesCount` retornados pela API. Ícones
ou cores desconhecidos usam os padrões da interface. A contagem de itens fica
oculta nos ambientes, pois esse dado ainda não faz parte da resposta.

As listas tratam carregamento, resultado vazio e erro com opção de tentar
novamente. Os erros também usam o feedback global do Sonner. O link “Ver todos”
abre a aba Ambientes e mostra o total consultado. Edição e exclusão de ambientes
ainda não estão integradas.

## Cadastro de ambientes

O modal “Novo ambiente”, disponível na aba Ambientes e na visão geral, envia
`POST /api/spaces/{spaceId}/rooms` via `useCreateRoomMutation`. O espaço vem da
rota atual e o token Bearer é enviado pelo Axios. Nome, descrição, ícone e cor
usam a validação com Yup somente ao salvar; a descrição vazia é enviada como `null`.

Durante o envio, os campos, os novos envios e o fechamento ficam bloqueados.
Após o sucesso, o modal é limpo e fechado, a lista compartilhada é atualizada e
reconsultada, atualizando também a prévia e o total de ambientes no resumo.
O cache respeita o usuário que iniciou a operação. O Sonner informa sucesso ou
falha; erros mantêm o formulário preenchido para nova tentativa.

## Estado vazio

Use `src/components/empty-state/empty-state.tsx` quando uma consulta terminar
com sucesso e retornar uma lista vazia. O componente inclui a ilustração de caixa
aberta, título e descrição personalizáveis, além de uma ação opcional:

```tsx
<EmptyState action={{ label: "Novo ambiente", onClick: abrirModal }} />
```

O padrão está aplicado aos espaços na Home e em “Meus espaços”, e aos ambientes
na visão geral e na aba Ambientes. O botão abre o modal de cadastro correspondente.
As listas vazias não exibem também o card de adicionar; carregamento e erro
continuam com seus próprios estados.

## Edição de espaços

A opção “Editar” no menu dos cards da Home e de “Meus espaços” reutiliza o modal
de cadastro, preenchido com nome, descrição e URL da imagem do espaço selecionado.
O formulário mantém a validação com Yup e salva por `PUT /api/spaces/{id}`, usando
`useUpdateSpaceMutation` e o token do Axios.

Durante o envio, os campos e o fechamento ficam bloqueados. Em caso de erro,
os valores digitados são preservados para nova tentativa. Após o sucesso, o modal
fecha, os caches da lista e do detalhe são atualizados e o Sonner informa o resultado.

## Exclusão de espaços

Os cards da Home e de “Meus espaços” possuem um menu com a opção “Excluir”.
O cabeçalho da visão geral também oferece “Excluir espaço”. Ambas as ações
abrem uma confirmação com o nome do espaço antes de enviar `DELETE /api/spaces/{id}`
pelo hook `useDeleteSpaceMutation`, usando o token do Axios.

O componente reutilizável `src/components/confirmation-modal/confirmation-modal.tsx`
aceita título, descrição, rótulos, ação de confirmação e estado de carregamento.
O foco inicial fica em “Cancelar”; durante a requisição, novos envios e o
fechamento ficam bloqueados. Falhas mantêm o modal aberto para nova tentativa.

Após o sucesso, o cache da lista é atualizado e a consulta do detalhe é removida.
Ao excluir pela visão geral, a aplicação volta para `/espacos`. O Sonner informa
sucesso e erros, incluindo o bloqueio `409` quando existem registros vinculados
ao espaço. A exclusão é permanente e depende das regras atuais do backend.

## Cadastro de espaços

O modal “Novo espaço”, disponível na Home e em “Meus espaços”, envia
`POST /api/spaces` por meio de `useCreateSpaceMutation`. Nome, descrição e URL da
imagem são validados com Yup conforme os limites da API (100, 500 e 1000 caracteres).
Campos opcionais vazios são enviados como `null`; o proprietário vem do token.

Durante o envio, o formulário bloqueia novas submissões e o fechamento do modal.
Em caso de erro, preserva os valores para correção e exibe feedback pelo Sonner.
Após salvar, limpa e fecha o formulário, atualiza o cache e revalida a listagem.
Cancelar também limpa o formulário.

A imagem é cadastrada por URL. Upload de arquivos e personalização de ícones e
cores ainda não são suportados pelo backend; os controles de ícones e cores
ficam desabilitados e identificados como “em breve”.

## Login

A tela está em `/login`, com layout próprio sem sidebar. Usa Chakra UI v3,
React Hook Form, Inter e o mesmo `BrandLogo` da navegação.

`LoginForm` chama `POST /api/auth/login`; `RegisterForm` chama
`POST /api/auth/register`. Ambos salvam a resposta `{ accessToken, expiresAt,
user }` no Zustand e o router redireciona para `/` após o sucesso. Os formulários
acompanham o carregamento e exibem erros da API sem registrar senhas no console.
As regras de validação ficam nos schemas Yup junto aos respectivos formulários.

O store `src/stores/auth-store.ts` mantém a sessão em `sessionStorage` por padrão.
Com “Lembrar de mim”, usa `localStorage`. A persistência contém apenas a sessão
retornada pela API e essa preferência; as senhas não são armazenadas.
Sessões expiradas ou com estrutura inválida não são restauradas.

`AuthSession` acompanha as mudanças no store, revalida as rotas e encerra a sessão
ao atingir `expiresAt`, inclusive quando a janela volta ao foco. Não há renovação
automática de token: ao expirar, o usuário precisa entrar novamente.
Login social e recuperação/redefinição de senha ainda não estão integrados à API.

## Feedbacks

O Sonner é montado uma única vez no `Provider`, com tema claro e tokens do Chakra.
Use os métodos diretamente nos fluxos da aplicação:

```ts
import { toast } from "sonner";

toast.success("Alterações salvas.");
toast.info("Recurso disponível em breve.");
toast.warning("Confira as informações antes de continuar.");
toast.error("Não foi possível salvar. Tente novamente.");
```

Login, cadastro, saída e encerramento de sessão já usam esses feedbacks.
Erros de validação do Yup continuam junto aos campos. Recursos de autenticação
ainda não integrados exibem informação, sem simular sucesso.

## Sidebar

Os componentes reutilizáveis ficam em `src/components/sidebar`. `Sidebar` recebe
os espaços, o usuário, a seleção atual e callbacks de navegação e criação.
`SidebarLocation.children` permite aninhar locais; use IDs únicos por espaço.

- Desktop (a partir de 1024 px): 260 px, recolhível para 72 px pelo botão do logo.
- Tablet (768–1023 px): inicia recolhida, com tooltips nos ícones.
- Mobile: drawer com foco contido, fechamento por Escape e retorno do foco ao menu.
- A lista de espaços rola sem deslocar a área do usuário.

A seleção acompanha o caminho da rota, sem query params, com suporte a voltar/avançar.
Para abrir Minha Casa > Quarto, acesse `/espacos/casa/locais/quarto`.
Os espaços cadastrados pelo modal são persistidos na API.
A interface exibe somente a sidebar; as visualizações das seções serão adicionadas depois.
O perfil na sidebar mostra o usuário autenticado. “Sair” limpa a sessão por
`onSignOut` e redireciona para `/login`. Perfil e configurações continuam
desabilitados enquanto `onUserAction` não for fornecido.

A fonte Inter é servida localmente. As cores vêm dos tokens em `src/theme`.
Drawer, Menu e Tooltip seguem as composições do [Chakra UI v3](https://chakra-ui.com/docs/components/drawer).

## Rotas

O TanStack Router usa rotas por arquivos em `src/routes`:

- `__root.tsx`: contém o `Outlet` comum às rotas públicas e às rotas da aplicação.
- `_auth.tsx`: layout público para visitantes; usuários autenticados vão para `/`.
- `_auth.login.tsx`, `_auth.register.tsx`, `_auth.forgot-password.tsx` e
  `_auth.reset-password.tsx`: preservam as URLs `/login`, `/register`,
  `/forgot-password` e `/reset-password`.
- `_app.tsx`: layout protegido; o `beforeLoad` exige sessão válida antes de carregar
  qualquer rota filha. Sem sessão, redireciona para `/login`, sem query params.
- `App.tsx`: layout compartilhado, com `Outlet` para as futuras telas.
- `_app.index.tsx`: rota `/` (Início). Os demais arquivos `_app.*` mantêm as URLs existentes.
- Menus: `/buscar`, `/espacos`, `/notificacoes`, `/favoritos`, `/atividade` e `/lixeira`.
- Espaços: `/espacos/$spaceId`.
- Locais: `/espacos/$spaceId/locais/$locationId`.
- `src/router.ts`: configuração do router e registro dos tipos de navegação.

A proteção de rotas controla a interface. A API continua responsável por validar
o JWT e autorizar o acesso a cada recurso protegido. A implementação usa os
[guards do TanStack Router](https://tanstack.com/router/latest/docs/guide/authenticated-routes).

O plugin do Vite gera `src/routeTree.gen.ts` ao executar `npm run dev` ou
`npm run build`. Não edite esse arquivo manualmente. O build gera as rotas
antes de verificar os tipos com TypeScript.

Para atualizar para as versões estáveis mais recentes:

```sh
npm install @tanstack/react-router@latest
npm install -D @tanstack/router-plugin@latest
```

Documentação: https://tanstack.com/router/latest/docs/installation/with-vite

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
