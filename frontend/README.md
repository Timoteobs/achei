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
usa também a data de criação retornada pela API. As demais seções de ambientes,
itens, membros e atividades ainda usam seus mocks. Criação, edição e exclusão de
espaços ainda não estão integradas no frontend.

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
Os novos espaços ficam somente na memória da sessão.
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
