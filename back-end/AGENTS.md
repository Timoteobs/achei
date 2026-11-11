# Instruções para agentes — back-end Achei

Este arquivo define o padrão atual do back-end. Antes de implementar, examine uma funcionalidade equivalente existente e siga estas regras. Não introduza um segundo padrão para resolver o mesmo problema.

## Princípios de trabalho

- Não adicione abstrações, dependências ou infraestrutura especulativa.
- Não crie arquivos .http, salvo solicitação explícita.
- Use nomes de código em inglês. Use português nas mensagens destinadas ao usuário, validações, exceções e comentários.
- Comente apenas decisões que não sejam evidentes pelo código.

## Direção das dependências

Respeite esta direção:

    Domain <- Application <- Data
                          <- Crosscutting.Common
                          <- Presentation

- Domain não depende das demais camadas.
- Application depende apenas de Domain.
- Data implementa contratos de Application e persiste entidades de Domain.
- Crosscutting.Common implementa contratos transversais definidos em Application; não deve referenciar Domain sem necessidade concreta.
- Presentation é a raiz de composição atual e registra as implementações.
- Nunca introduza dependência de Domain para Application, Data, Presentation ou Crosscutting.

## Organização por módulo

Use os mesmos módulos definidos no Domain, atualmente Identity, Inventory, Spaces e Audit.

- Entidades: Domain/Modules/{Module}/Entities.
- Controllers: Presentation/Controllers/{Module}.
- Services: Application/Services/{Module}.
- Interfaces de Services: Application/Interfaces/Services/{Module}.
- Repositories concretos: Data/Repositories/{Module}.
- Configurações do EF: Data/Configurations/{Module}.
- Modelos de entrada e resposta permanecem em Application/Models, agrupados pelo contexto da API existente.

Não crie uma pasta exclusiva para uma entidade quando ela conteria somente seu Controller ou Service. Por exemplo, BoxService pertence a Services/Inventory, e não a Services/Boxes.

O nome Application.Models.Auth é intencional, mesmo que o módulo se chame Identity.

Logs técnicos são uma exceção à organização por módulos de domínio: SystemLog e seu mapeamento pertencem a Data/Logging e Data/Configurations/Logging; o provider e o worker pertencem a Presentation/Logging. Não crie entidade de Domain, Repository ou Application Service para essa infraestrutura.

## Estilo C#

O .editorconfig da raiz é obrigatório.

- Use quatro espaços; não use tabs.
- Use chaves em todos os blocos de controle, inclusive blocos com uma única instrução.
- Use chaves em métodos e construtores; não use corpo de método com =>.
- Posicione a chave de abertura em uma nova linha.
- Construtores privados vazios exigidos pelo EF Core são exceção e podem permanecer em uma linha, como private Activity() { }.
- Mantenha assinaturas, construtores, records e chamadas em uma linha quando continuarem legíveis.
- Quebre verticalmente somente quando a linha ficar realmente extensa e prejudicar a leitura.
- Não aplique quebras verticais mecânicas em toda lista de parâmetros.
- Use file-scoped namespaces.
- Use sealed nas implementações que não foram projetadas para herança.
- Métodos assíncronos devem terminar com Async.
- Propague CancellationToken; em contratos e métodos públicos, use CancellationToken cancellationToken = default quando compatível com o padrão existente.

## Domain

- Entidades concentram invariantes e alterações de estado.
- Use setters privados e construtor privado sem parâmetros quando necessário para o EF Core.
- Valide entidades com DomainValidator e ValidationRule.
- Não duplique validação de domínio em um segundo mecanismo.
- Normalize valores dentro da entidade quando isso fizer parte de sua invariância, como Trim, caixa do texto ou datas.
- Armazene datas de aplicação em UTC com DateTime.UtcNow.
- BaseEntity deve permanecer enxuta, contendo apenas comportamento realmente comum e utilizado.

## Application Services

- Um Service orquestra regras do caso de uso, autoriza o acesso, chama Repositories e converte entidades para respostas.
- Services não acessam DbContext, SQL ou classes concretas de infraestrutura.
- Use injeção pelo construtor primário, seguindo os Services existentes.
- Toda classe concreta de Service deve conter, nesta ordem, as regiões Service Methods e Helper Methods.
- Coloque os métodos públicos do contrato em Service Methods.
- Coloque helpers privados, incluindo ToResponse, em Helper Methods.
- Valide propriedade do espaço antes de operar recursos internos, usando o padrão EnsureOwnedSpaceAsync.
- Nunca aceite o proprietário do recurso a partir do corpo da requisição. Obtenha o usuário autenticado.
- Converta entidades para DTOs no Service por meio de métodos chamados ToResponse.
- Declare ToResponse como static quando ele não utilizar estado da instância.
- Não devolva entidades de Domain diretamente pela API.

## Repositories

- Repositories são orientados ao domínio: retornam e recebem entidades, coleções de entidades ou tipos genéricos como PagedResult<T>.
- Não retorne Response, DTO de Controller ou read model específico da API por um Repository.
- Projeções para respostas pertencem ao Service.
- Use AsNoTracking em consultas somente de leitura.
- Restrinja consultas pelo contexto de segurança necessário, como spaceId e proprietário.
- Não envolva toda operação em try/catch. Capture somente erros esperados traduzíveis para o vocabulário da aplicação.
- Deixe erros inesperados subirem para o GlobalExceptionHandler e serem registrados como 500.
- Traduza DbUpdateConcurrencyException para a exceção NotFound correspondente ao recurso.
- Em exclusões, traduza SQL Server 547 para a exceção HasDependencies correspondente.
- Em criações e atualizações do módulo Inventory, traduza SQL Server 547 para InventoryExceptions.ReferenceNotFound.
- Não tente descobrir a FK analisando o texto da mensagem do SQL Server.
- Preserve a exceção original como innerException ao traduzi-la.

## Exceções

Exceções esperadas devem ser criadas pelos catálogos em Application/Common/Exceptions:

- IdentityExceptions;
- InventoryExceptions;
- SpacesExceptions.

Regras:

- Não espalhe new ResourceNotFoundException, new BusinessConflictException ou mensagens contextuais pelos Services e Repositories.
- Adicione uma factory ao catálogo do módulo e reutilize-a.
- Use códigos estáveis em letras minúsculas, no formato module.error_name.
- ResourceNotFoundException representa 404.
- BusinessConflictException representa 409.
- UnauthorizedException representa 401.
- ArgumentException representa dados inválidos e é tratada como 400.
- Não exponha mensagens internas do banco ou stack traces na resposta.
- Atualize o GlobalExceptionHandler quando uma nova família tipada de exceção for realmente necessária.

## Histórico de atividades

- Activity representa somente o histórico de ações dos usuários; não a utilize para logs técnicos ou exceções.
- Registre criação e atualização de Spaces e criação, atualização e exclusão de Rooms, Boxes e Items por meio de IActivityService.
- Não registre a exclusão de Space em Activity: o histórico pertence ao espaço e é removido com ele por Cascade.
- Use as constantes ActivityActions e ActivityEntityTypes; não espalhe valores textuais de ação e entidade.
- Activity pertence ao Space: sua FK deve usar Cascade para remover o histórico quando o espaço for excluído.
- A FK opcional de Activity para User deve usar SetNull para preservar o histórico do espaço e anonimizar o autor excluído.
- EntityId é uma referência histórica e não deve possuir FK para Room, Box, Item ou outras entidades internas que possam ser removidas.
- Mantenha no Metadata apenas contexto básico em JSON. Nunca registre senhas, hashes, tokens, chaves ou dados sensíveis desnecessários.
- Execute a escrita do recurso e da Activity dentro de IUnitOfWork para garantir que ambas sejam confirmadas ou revertidas juntas.
- Não registre leituras como atividade sem uma necessidade funcional explícita.

## Logs do sistema

- SystemLog representa logs técnicos e exceções; não o confunda com o histórico funcional de Activity.
- Persista somente os níveis Warning, Error e Critical no banco. Logs de níveis inferiores permanecem nos providers não persistentes configurados para a aplicação.
- A persistência deve ocorrer de forma assíncrona pela fila limitada e pelo SystemLogWorker; nunca bloqueie a requisição para gravar um log técnico.
- Não registre senhas, tokens, chaves, corpos de requisição ou outros dados sensíveis.
- Mantenha apenas os últimos sete dias de logs. O SystemLogWorker deve remover diariamente os registros expirados.
- Falhas na persistência dos próprios logs não devem interromper a aplicação nem ser reenviadas ao mesmo provider.

## Controllers e REST

- Controllers devem ser finos: recebem a requisição, extraem o usuário, chamam o Service e produzem a resposta HTTP.
- Não implemente regra de negócio nem consulta a Repository no Controller.
- Use User.GetUserId(); não copie a leitura de claims para cada Controller.
- Proteja recursos privados com [Authorize] e use [AllowAnonymous] apenas quando necessário.
- Declare ProducesResponseType para sucessos e erros esperados.
- Siga o padrão CRUD atual:
  - listagem: 200 OK;
  - consulta por id: 200 OK;
  - criação: 201 Created com CreatedAtAction;
  - atualização: 200 OK com a resposta atualizada;
  - exclusão: 204 No Content.
- Toda criação de recurso que possua consulta por id deve usar CreatedAtAction com os valores de rota necessários. Isso gera o cabeçalho Location.
- Recursos de um espaço devem manter rotas aninhadas coerentes com /api/spaces/{spaceId}/...

## Validação e segurança

- Use Data Annotations nos modelos de requisição para validações de formato e obrigatoriedade da API.
- Mantenha invariantes essenciais também no Domain.
- Senhas devem ser processadas por IPasswordHasherService; nunca persista ou registre senha em texto puro.
- Não registre tokens, senhas, chaves ou outros segredos.
- Falhas de autenticação devem usar factories de IdentityExceptions e código de erro estável.

## Decisões em stand-by

Os itens abaixo são intencionais. Não os remova, complete ou reorganize sem tarefa explícita:

- IEncryptionService e AesEncryption existem, mas a criptografia dos dados dos usuários ainda não foi integrada.
- Crosscutting.IOC está reservado para uso futuro; a composição continua no Program.cs.
- A estratégia definitiva de testes unitários ainda será definida. Não use Tests/SpacesChecks como modelo arquitetural para novos testes.
- Docker e contêineres ainda não fazem parte do fluxo ativo. Não ajuste o Dockerfile sem solicitação.
- O tratamento da FK do proprietário em SpaceRepository será revisto quando existir fluxo de exclusão de usuário.

## Banco de dados e migrations

- Configure mapeamentos do EF Core em Data/Configurations/{Module}.
- Defina explicitamente tamanhos, obrigatoriedade, nomes de colunas, índices e comportamento de exclusão.
- Não edite migrations históricas manualmente para acomodar uma nova alteração.
- Mudanças de schema devem ser acompanhadas por migration própria quando a tarefa exigir atualização do banco.
- Com EnableRetryOnFailure, execute transações explícitas por meio de Database.CreateExecutionStrategy().ExecuteAsync para que uma tentativa inclua toda a unidade transacional.

## Verificação antes da entrega

Antes de considerar uma implementação concluída:

1. Confirme que não houve mudanças fora do escopo.
2. Confirme que Controllers, Services, interfaces, Repositories e configurações estão no módulo correto.
3. Procure mensagens de exceção duplicadas ou criadas fora dos catálogos.
4. Confirme que Repositories não retornam DTOs de resposta.
5. Confirme que todos os blocos de controle usam chaves.
6. Execute:

    dotnet build Achei.API.sln -c Release
    dotnet format Achei.API.sln style --verify-no-changes --severity error --no-restore
    git diff --check

7. Relate erros e avisos reais. NU1900 pode ocorrer quando o NuGet estiver indisponível para consultar vulnerabilidades; não o confunda com erro de compilação.
