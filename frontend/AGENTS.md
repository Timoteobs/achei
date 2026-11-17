# Instruções para agentes — frontend Achei!

## Permissões e compartilhamento

Antes de criar, alterar ou revisar qualquer funcionalidade que envolva espaços compartilhados, membros, convites ou permissões de leitura/escrita, **leia obrigatoriamente [docs/permissoes-compartilhamento.md](docs/permissoes-compartilhamento.md)** e confira os arquivos de implementação citados no guia.

Isso também se aplica a novas ações de ambientes, caixas e itens, seletores de espaço, menus, estados vazios, modais, rotas e mutations que operem recursos de um espaço.

- Reutilize `getSpacePermissions` e `useSpacePermissions`; não crie uma segunda lógica de autorização no frontend.
- Use `canEdit` para alterações de conteúdo e `isOwner` para administração do espaço e de convites.
- Não conceda edição enquanto a permissão estiver ausente ou indisponível.
- A API é a autoridade sobre acesso; ocultar controles não substitui validações do backend.
- Mantenha cache e atualizações de dados vinculados ao usuário e ao espaço corretos.
- Se alterar uma regra ou contrato de compartilhamento, atualize o guia na mesma tarefa.
- Se a tarefa também alterar o backend, leia antes o [AGENTS.md do backend](../back-end/AGENTS.md).
