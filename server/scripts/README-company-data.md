# Auditoria e migração de empresas

Os scripts abaixo **não foram executados nesta alteração**. Eles nunca fazem deploy. O audit é somente leitura; a migração só escreve com duas flags explícitas.

## Preparação

1. Combine uma janela de manutenção e confirme o ambiente e o banco no `MONGODB_URL` sem imprimir credenciais no terminal ou em logs compartilhados.
2. Faça um backup restaurável do banco e confirme o procedimento de restauração antes de qualquer migração.
3. Rode primeiro a auditoria, preserve a saída JSON e resolva manualmente empresas duplicadas por `ownerId`, owners/membros ausentes e referências de vagas inválidas.
4. Não associe vaga sem `companyId` apenas pelo nome textual. Resolva cada caso com evidência externa ao nome ou mantenha-o legado.

## Auditoria read-only

Na pasta `server`, configure deliberadamente as variáveis para o banco aprovado e execute:

```powershell
npm run audit:companies -- --run-read-only-audit
```

O relatório inclui IDs de empresas, usuários e vagas que precisam de triagem. Guarde-o em local restrito, pois esses identificadores são dados internos. O script reporta owners com várias empresas, owners e membros sem User correspondente, membros duplicados/malformados, vagas sem `companyId` ou com referência inválida, autores de vaga órfãos e claims de organização sem documento Company.

## Migração de membros

O modo padrão é dry-run e não altera nada:

```powershell
npm run migrate:company-members -- --run-read-only-audit
```

Depois de revisar o relatório de auditoria, resolver referências inválidas, confirmar backup e aprovar a janela, a aplicação exige ambas as flags:

```powershell
npm run migrate:company-members -- --run-read-only-audit --apply --backup-confirmed
```

Strings são convertidas para `{ userId, role: "viewer", status: "active", joinedAt }`; o ID antigo é preservado e papel privilegiado nunca é inferido. Registros duplicados do mesmo ID são consolidados para o menor privilégio e estado mais restritivo. Uma empresa com entrada malformada ou User inexistente é omitida da escrita para resolução manual. O script usa `__v` como guarda contra sobrescrever alterações concorrentes e pode reportar documentos que precisam de nova revisão.

## Rollback

Não há rollback automático destrutivo. Em caso de erro, pare as alterações, guarde os logs da migração e restaure a coleção `companies` a partir do backup validado, ou faça recuperação seletiva após comparar o backup e o estado atual. Não rode o script de novo sem revisar o relatório e entender os documentos não aplicados.

## Índice único de `ownerId`

Ainda não foi criado. Só deve ser adicionado depois de executar a auditoria no banco aprovado e resolver todos os owners com mais de uma empresa, incluindo validar a capacidade de criar o índice sem falha. Até lá, novas sincronizações têm uma reivindicação atômica no documento `User` para bloquear duas requisições concorrentes, e as rotas recusam casos legados ambíguos.
