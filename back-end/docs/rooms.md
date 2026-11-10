# Ambientes

As rotas `/api/spaces/{spaceId}/rooms` exigem Bearer JWT. Todas as operações
validam que o espaço pertence ao usuário do token, seguindo a regra do CRUD de espaços.

| Método | Caminho | Resultado |
| --- | --- | --- |
| GET | /api/spaces/{spaceId}/rooms | Lista de ambientes (200) |
| GET | /api/spaces/{spaceId}/rooms/{id} | Um ambiente (200) |
| POST | /api/spaces/{spaceId}/rooms | Ambiente criado e cabeçalho Location (201) |
| PUT | /api/spaces/{spaceId}/rooms/{id} | Ambiente atualizado (200) |
| DELETE | /api/spaces/{spaceId}/rooms/{id} | Sem conteúdo (204) |

O corpo de POST/PUT aceita `name` (obrigatório, até 100 caracteres),
`description` (opcional, até 500), `icon` (opcional, até 100) e `color`
(opcional, até 20). O PUT substitui os campos editáveis; campos opcionais omitidos
ficam nulos. O nome não pode conter apenas espaços. Ícone e cor são identificadores
textuais, compatíveis com os valores do formulário.

Ambientes usam `tbl_location` com `type = ROOM` e `parent_location_id = NULL`.
O espaço vem da rota e o criador vem do token; o corpo não altera esses vínculos.
As rotas não permitem consultar, editar ou excluir caixas como se fossem ambientes.
Não há migração: são utilizadas as tabelas e colunas existentes.

As respostas de consulta, criação e edição incluem `boxesCount`. O total conta
registros `BOX` do mesmo espaço cujo `parent_location_id` é o ID do ambiente.
Conta apenas caixas diretamente vinculadas, sem incluir caixas dentro de outras
caixas, itens ou outros tipos de local. Ambientes sem caixas retornam zero.
A contagem é calculada no banco junto à consulta de ambientes, sem uma consulta
adicional para cada ambiente.

Exemplo de resposta:

```json
{
  "id": 10,
  "spaceId": 1,
  "name": "Sala",
  "description": "Livros e eletrônicos.",
  "icon": "armchair",
  "color": "teal",
  "boxesCount": 3,
  "createdAt": "2026-11-08T12:00:00Z",
  "updatedAt": "2026-11-08T12:00:00Z"
}
```

- 400: dados inválidos.
- 401: token ausente ou inválido.
- 404: espaço inexistente/sem acesso, ambiente inexistente, de outro espaço ou ID de uma caixa.
- 409: exclusão bloqueada por registros vinculados, como caixas, itens ou imagens.
- Um espaço acessível sem ambientes retorna uma lista vazia.

A exclusão é permanente e não remove registros dependentes em cascata.
O formulário frontend ainda não está integrado a essas rotas.
