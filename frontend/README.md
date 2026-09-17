# Achei

## Login

A tela está em `/login`, com layout próprio sem sidebar. Usa Chakra UI v3,
React Hook Form, Inter e o mesmo `BrandLogo` da navegação.

`LoginPage` e `LoginForm` recebem os callbacks `onLogin`, `onSocialLogin`,
`onForgotPassword` e `onCreateAccount`. `onLogin` recebe `{ email, password,
rememberMe }` e deve retornar uma Promise; o formulário acompanha o carregamento
e impede novos envios enquanto aguarda. O callback da integração deve tratar a
sessão e a navegação após o sucesso.

Para credenciais inválidas, lance `new LoginError("invalid_credentials")`.
Outros erros exibem a mensagem genérica de tentativa novamente. Sem callbacks,
a interface informa que o recurso estará disponível em breve, sem autenticar,
enviar ou salvar credenciais. Nenhuma API ou proteção de rotas foi implementada.

Use `showSocialLogin={false}` para remover a seção Google/Apple e `disabled`
para desabilitar o formulário. O login social também aguarda uma Promise.
As regras dos campos ficam em `src/components/auth/login-schema.ts`, usando Yup
com `yupResolver` do [React Hook Form](https://github.com/react-hook-form/resolvers#yup).
O tipo `LoginValues` é inferido do schema. `strictNullChecks` está habilitado
para preservar a inferência dos campos obrigatórios. Erros da autenticação
continuam sendo exibidos no alerta global.

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
As ações de perfil, configurações e saída ficam desabilitadas até fornecer
`onUserAction`. Conecte os callbacks à API quando ela estiver disponível.

A fonte Inter é servida localmente. As cores vêm dos tokens em `src/theme`.
Drawer, Menu e Tooltip seguem as composições do [Chakra UI v3](https://chakra-ui.com/docs/components/drawer).

## Rotas

O TanStack Router usa rotas por arquivos em `src/routes`:

- `__root.tsx`: contém o `Outlet` comum às rotas públicas e às rotas da aplicação.
- `login.tsx`: `/login`, com o layout de autenticação.
- `_app.tsx`: layout sem segmento na URL, renderiza `App.tsx` com a sidebar.
- `App.tsx`: layout compartilhado, com `Outlet` para as futuras telas.
- `_app.index.tsx`: rota `/` (Início). Os demais arquivos `_app.*` mantêm as URLs existentes.
- Menus: `/buscar`, `/espacos`, `/notificacoes`, `/favoritos`, `/atividade` e `/lixeira`.
- Espaços: `/espacos/$spaceId`.
- Locais: `/espacos/$spaceId/locais/$locationId`.
- `src/router.ts`: configuração do router e registro dos tipos de navegação.

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
