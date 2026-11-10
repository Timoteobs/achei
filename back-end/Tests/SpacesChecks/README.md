# Verificação do CRUD de espaços

Execute a partir de `back-end`:

```powershell
dotnet run --project Tests/SpacesChecks --configuration Release
```

O programa sobe uma API temporária em uma porta local aleatória, usa os controllers,
serviços e validação JWT do projeto e substitui apenas o repositório de espaços
por armazenamento em memória. A chave JWT é aleatória e existe somente durante
a execução; nenhum User Secret ou registro do SQL Server é alterado.

Verifica autenticação obrigatória nos cinco endpoints, token inválido, proprietário
derivado do token, isolamento entre dois usuários, validação, criação, leitura,
edição, exclusão e respostas 404/409. A verificação de conflito usa uma exceção
simulada; as constraints e a persistência SQL devem ser validadas com o banco
de desenvolvimento.
