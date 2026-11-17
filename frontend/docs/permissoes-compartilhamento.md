# Permissões de compartilhamento de espaços

Este guia descreve o comportamento implementado no Achei! e deve ser consultado antes de criar ou alterar funcionalidades que dependam de acesso a espaços compartilhados.

## 1. Regra principal

A permissão pertence à relação entre **usuário e espaço**. Uma pessoa pode ser proprietária de um espaço, editora de outro e visualizadora de um terceiro.

A API é a autoridade sobre acesso. O frontend usa a permissão retornada para apresentar as ações adequadas, mas esconder um botão não substitui a autorização no backend.

Não deduza permissões a partir do nome do espaço, do e-mail, da presença de um convite, de parâmetros da URL ou de um papel global salvo na sessão. Não considere todo espaço listado como pertencente ao usuário.

## 2. Matriz de permissões

| Operação | OWNER | EDITOR | VIEWER |
| --- | --- | --- | --- |
| Listar e abrir o espaço | Sim | Sim | Sim |
| Consultar ambientes, caixas e itens | Sim | Sim | Sim |
| Consultar atividades, indicadores e itens recentes | Sim | Sim | Sim |
| Criar, editar e excluir ambientes | Sim | Sim | Não |
| Criar, editar, mover e excluir caixas e itens | Sim | Sim | Não |
| Editar nome, descrição ou imagem do espaço | Sim | Não | Não |
| Excluir o espaço | Sim | Não | Não |
| Criar, listar, editar, cancelar ou revogar convites enviados do espaço | Sim | Não | Não |

- **OWNER:** proprietário identificado pelo `ownerUserId` do espaço.
- **EDITOR:** membro com permissão para alterar o conteúdo do espaço.
- **VIEWER:** membro com permissão somente de leitura.
- Sem acesso reconhecido, não habilite ações. A API impede a consulta de recursos inacessíveis.
- Criar um espaço próprio continua disponível para usuários autenticados, independentemente dos papéis que tenham em outros espaços.
- Consultar e responder aos próprios convites recebidos é uma ação do destinatário. Não exige ser proprietário ou membro do espaço.

O papel `EDITOR` não permite administrar o espaço nem seus convites. Não use `canEdit` para essas operações administrativas.

## 3. Contrato da API

O tipo [SpaceResponse](../src/services/spaces.ts) inclui:

```ts
interface SpaceResponse {
  id: number;
  ownerUserId: number;
  role: "OWNER" | "EDITOR" | "VIEWER";
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
```

`GET /api/spaces` retorna espaços próprios e aqueles em que o usuário é membro EDITOR ou VIEWER, sem duplicá-los. `GET /api/spaces/{spaceId}` também permite acesso aos membros. O campo `role` representa a permissão do usuário autenticado naquele espaço.

O frontend chama `/spaces` por meio da instância Axios em [api.ts](../src/services/api.ts); a base da API já inclui `/api`. O interceptor adiciona o Bearer token. Não duplique a base nem monte manualmente cabeçalhos de autenticação nos componentes.

## 4. Helpers de permissão

### Com um espaço já carregado

Use [getSpacePermissions](../src/utils/space-permissions.ts):

```tsx
const { isOwner, canEdit, role } = getSpacePermissions(space);
```

Implementação atual:

```ts
export function getSpacePermissions(space?: Pick<SpaceResponse, "role">) {
  const isOwner = space?.role === "OWNER";
  return {
    isOwner,
    canEdit: isOwner || space?.role === "EDITOR",
    role: space?.role,
  };
}
```

Use esse helper em listas, seletores e formulários que já receberam `SpaceResponse`. Evite uma consulta de detalhes para cada card.

Sem dados, `isOwner` e `canEdit` são falsos. Papéis desconhecidos também não concedem edição. Não adicione fallback que conceda acesso enquanto os dados carregam.

### Dentro de uma tela de espaço

Use [useSpacePermissions](../src/hooks/spaces/use-space-permissions.ts):

```tsx
const { isOwner, canEdit, role } = useSpacePermissions();
```

O hook obtém `spaceId` da rota e usa [useSpaceQuery](../src/hooks/spaces/use-space-query.ts). Ele só fornece os dados ao helper quando a consulta está em estado de sucesso.

Quando o recurso pertence a um espaço definido por props ou seleção, passe o ID explicitamente:

```tsx
const { canEdit } = useSpacePermissions(spaceId);
```

O ID informado tem prioridade sobre o da rota. Isso é essencial em modais reutilizados fora da página de detalhes ou em fluxos que permitem selecionar outro espaço.

Não crie outro store de permissões. Zustand mantém a sessão; TanStack Query mantém os dados e o papel de cada espaço.

## 5. Aplicação na interface

### Ações de conteúdo

```tsx
const { canEdit } = useSpacePermissions(spaceId);

return (
  <>
    {canEdit && <Button onClick={openCreateModal}>Novo ambiente</Button>}
    <RoomCard
      onOpen={openRoom}
      onEdit={canEdit ? editRoom : undefined}
      onDelete={canEdit ? deleteRoom : undefined}
    />
    {canEdit && isCreateOpen && <NewRoomModal open onOpenChange={setCreateOpen} />}
  </>
);
```

A navegação e a consulta permanecem disponíveis ao visualizador. Somente ações de alteração são ocultadas.

Aplique a regra a todos os pontos de entrada, incluindo:

- Botões do header, menus de cards e menus de tabelas.
- Coluna de ações da tabela, quando nenhuma ação de leitura estiver disponível.
- Cards de criação e botões de estados vazios.
- Modais de criação, edição, movimentação e confirmação.
- Ações de cadastro dentro dos seletores de localização.
- Validação antes do envio do formulário.

Para estados vazios, não incentive cadastro se o usuário não puder cadastrar:

```tsx
<EmptyState
  action={canEdit ? { label: "Novo ambiente", onClick: openCreateModal } : undefined}
/>
```

### Administração do espaço

Use `isOwner` para editar/excluir o espaço e gerenciar convites:

```tsx
const { isOwner } = getSpacePermissions(space);

<SpaceCard
  id={String(space.id)}
  name={space.name}
  onEdit={isOwner ? editSpace : undefined}
  onDelete={isOwner ? deleteSpace : undefined}
/>
```

Os cards e o header identificam espaços compartilhados e distinguem Editor de Visualizador. Preserve os tokens de estilo existentes.

### Formulários com seleção de espaço

No cadastro global de itens, filtre as opções com `getSpacePermissions(space).canEdit`. A seleção inicial também deve apontar para um espaço editável.

```ts
const editableSpaces = spaces.filter((space) => getSpacePermissions(space).canEdit);
```

O [NewItemModal](../src/pages/space-overview/components/items/new-item-modal.tsx) aplica essa regra às opções, à escolha inicial, à condição `canSave`, à validação da seleção e às ações de novo ambiente/nova caixa.

Não filtre espaços compartilhados visualizadores em telas de **consulta**, como atividades. O filtro por edição é específico de fluxos de escrita.

## 6. Cache, sessão e erros

As chaves das consultas incluem o usuário para separar dados de contas diferentes:

```ts
["spaces", userId, "list"]
["spaces", userId, "detail", spaceId]
["spaces", userId, "rooms", spaceId, "list"]
["spaces", userId, "boxes", spaceId, "list"]
["spaces", userId, "items", spaceId]
["spaces", userId, "invitations", spaceId, "list"]
["invitations", userId, "received"]
```

Use `spaceId` como string nessas chaves, conforme os hooks existentes. IDs numéricos retornados pela API devem ser convertidos quando usados nas chaves de espaço.

A consulta de detalhes só executa com usuário e espaço definidos. As consultas de espaços usam atualmente `staleTime: 30000`; o cache não garante que uma permissão continua válida. A API verifica o acesso a cada operação.

O [auth-store](../src/stores/auth-store.ts) limpa o cache ao trocar a sessão ou sair. Nas mutations, capture o usuário em `onMutate` e confira se a sessão ainda é a mesma antes de atualizar o cache de sucesso, inclusive após operações assíncronas de cancelamento de queries.

Tratamento esperado:

| HTTP | Significado e comportamento |
| --- | --- |
| 401 | Sessão ausente ou inválida. O interceptor trata a expiração; evite toast duplicado. |
| 403 | Operação não permitida. Informe a restrição e revalide os dados de acesso. |
| 404 | Recurso inexistente ou sem acesso. Não conclua automaticamente que foi excluído. |
| 409 | Conflito de negócio, como convite já respondido ou expirado. Atualize os dados relevantes. |

As mutations de ambientes, caixas e itens tratam 403 com aviso do Sonner e invalidação do prefixo `["spaces", userId]`. Veja [useCreateItemMutation](../src/hooks/items/use-create-item-mutation.ts).

Não faça retry automático de uma alteração recusada por permissão. Não mostre sucesso antes da confirmação da API. Preserve os dados do formulário em caso de erro.

## 7. Convites e aquisição de acesso

Fluxo implementado:

1. O proprietário cadastra o convite com e-mail e papel EDITOR ou VIEWER.
2. O destinatário consulta seus convites na rota protegida `/convites`.
3. O backend identifica o destinatário pelo usuário autenticado e seu e-mail cadastrado.
4. Aceitar registra o vínculo em `tbl_member` e marca o convite como ACCEPTED na mesma transação. Um vínculo existente não é duplicado nem tem seu papel sobrescrito.
5. Rejeitar marca o convite como DECLINED e não cria vínculo.
6. Após o aceite, a mutation invalida a lista de espaços para incluir o compartilhamento.
7. O proprietário pode usar **Revogar acesso** em um convite aceito. Após confirmação, a API marca o convite como REVOKED e remove o vínculo em `tbl_member` na mesma transação. Os recursos cadastrados pelo membro e o histórico são preservados.

Endpoints usados:

| Operação | Endpoint |
| --- | --- |
| Convites recebidos | GET /api/invitations/received |
| Aceitar | POST /api/invitations/received/{id}/accept |
| Rejeitar | POST /api/invitations/received/{id}/decline |
| Convites enviados de um espaço | GET /api/spaces/{spaceId}/invitations |
| Criar convite | POST /api/spaces/{spaceId}/invitations |
| Cancelar convite | DELETE /api/spaces/{spaceId}/invitations/{id} |
| Revogar acesso de convite aceito | POST /api/spaces/{spaceId}/invitations/{id}/revoke |

Consulte [services/invitations.ts](../src/services/invitations.ts), [useRespondToInvitationMutation](../src/hooks/invitations/use-respond-to-invitation-mutation.ts) e a [listagem de convites recebidos](../src/pages/invitations/components/received-invitations-list.tsx).

Convite pendente, expirado ou rejeitado não concede acesso. A listagem de espaços depende do vínculo de membro, não da simples existência do convite.

O cancelamento de convite pendente exclui o registro; não é uma operação de remoção de membro. Para retirar o acesso de quem já aceitou, use a revogação:

- Apenas o proprietário pode revogar. EDITOR e VIEWER não administram membros.
- O endpoint retorna `InvitationResponse` atualizado (200). Convite não aceito ou já revogado retorna conflito (409); espaço/convite inexistente ou sem autorização retorna 404.
- A validade do convite não limita a revogação de um convite aceito. A data de aceite é preservada como histórico.
- O destinatário é localizado pelo e-mail do convite, conforme o fluxo atual de aceite. Atualmente não existe fluxo de alteração de e-mail; se ele for implementado, passe a persistir a identidade do destinatário no aceite antes de permitir essa alteração.
- O acesso do proprietário não pode ser removido. Se o vínculo do destinatário já não existir, o convite ainda pode ser revogado.
- A atualização condicional de status impede que a mesma revogação seja aplicada duas vezes. Se a remoção do vínculo falhar, a transação desfaz a alteração do convite.
- O vínculo é por usuário/espaço, portanto removê-lo retira todo o acesso do destinatário àquele espaço. Outros convites não são alterados: os aceitos permanecem como histórico e não concedem acesso por si só; um convite pendente válido ainda pode ser aceito para ingressar novamente.
- O frontend usa [useRevokeInvitationMutation](../src/hooks/invitations/use-revoke-invitation-mutation.ts) e [RevokeInvitationModal](../src/pages/space-overview/components/invite-members/revoke-invitation-modal.tsx), reaproveitando `ConfirmationModal`. Durante a operação, confirmação e fechamento ficam bloqueados.
- Após sucesso, a lista de convites do proprietário é atualizada e revalidada com chave por usuário/espaço. Erros mantêm a confirmação aberta e mostram feedback via Sonner.
- A API passa a negar novas consultas e alterações do ex-membro. Não há atualização em tempo real entre navegadores: dados já carregados no navegador do destinatário podem permanecer até a reconsulta. Invalidar o cache do proprietário não limpa a sessão de outra pessoa.

O envio por e-mail ainda não está integrado. Também não há fluxo de verificação de e-mail implementado: não documente ou trate o e-mail como verificado apenas porque a conta está autenticada.

## 8. Garantias do backend relevantes ao frontend

Antes de mudar o backend, leia também [back-end/AGENTS.md](../../back-end/AGENTS.md).

- `SpaceRepository` consulta espaços por proprietário ou vínculo EDITOR/VIEWER.
- `SpaceService` inclui o papel do usuário nos DTOs.
- `SpaceAccessService.EnsureCanReadAsync` permite leitura ao proprietário e aos membros autorizados.
- `SpaceAccessService.EnsureCanEditAsync` permite alterações ao proprietário ou a membros EDITOR.
- Services de ambientes, caixas e itens verificam escrita antes de alterar recursos. Consultas de atividades e indicadores usam a autorização de leitura.
- A administração do espaço e de seus convites mantém a verificação de proprietário.
- A movimentação de um recurso também valida que o local de destino pertence ao espaço autorizado.
- `ForbiddenException` é traduzida para HTTP 403 com código `spaces.read_only_access`.
- Aceite/rejeição validam destinatário, expiração e status; respostas concorrentes não podem reutilizar um convite já respondido.

A autorização da rota `/_app` verifica autenticação. Ela não concede automaticamente acesso a todos os espaços.

## 9. Referências para novas funcionalidades

| Contexto | Referência |
| --- | --- |
| Permissão de um objeto já carregado | [getSpacePermissions](../src/utils/space-permissions.ts) |
| Permissão do espaço da rota ou de props | [useSpacePermissions](../src/hooks/spaces/use-space-permissions.ts) |
| Listagem de espaços próprios e compartilhados | [SpacesSection](../src/pages/home/components/spaces/spaces-section.tsx) |
| Administração e criação no header | [SpaceOverviewHeader](../src/pages/space-overview/components/space-overview-header.tsx) |
| Menus e criação de ambientes | [RoomsGrid](../src/pages/space-overview/components/rooms/rooms-grid.tsx) |
| Menus e criação de caixas | [BoxesGrid](../src/pages/space-overview/components/boxes/boxes-grid.tsx) |
| Ações, estados vazios e modais de itens | [ItemsTab](../src/pages/space-overview/components/items/items-tab.tsx) |
| Coluna de ações de itens | [ItemsTable](../src/pages/space-overview/components/items/items-table.tsx) |
| Seleção de destino editável | [NewItemModal](../src/pages/space-overview/components/items/new-item-modal.tsx) |

## 10. Checklist para agentes

Antes de implementar:

- Identifique se a ação é leitura, alteração de conteúdo ou administração do espaço.
- Determine o espaço do recurso e use a permissão dele, especialmente em modais e seletores.
- Reutilize os helpers, queries, services Axios e mutations existentes.
- Confirme que o endpoint também valida a permissão adequada.
- Não amplie o papel EDITOR para ações administrativas sem uma decisão explícita de produto.

Antes de entregar:

- Confira OWNER, EDITOR, VIEWER e usuário sem acesso.
- Confira estado de carregamento, erro e permissão ausente, sem habilitar escrita por padrão.
- Confira menus, headers, estados vazios, atalhos, modais e seletores.
- Confira erro 403, troca de conta e atualização do cache após aceite de convite.
- Preserve consulta e navegação para visualizadores.
- Siga as instruções de validação da tarefa e relate o que foi efetivamente verificado.
- Atualize este documento na mesma alteração se mudar o contrato, a matriz de permissões ou os pontos de implementação.
