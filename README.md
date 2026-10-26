# ADAPT

## Portugues

Plataforma para conexao entre profissionais de TI e empresas, com feed social, mensagens em tempo real, stories, vagas e perfil de empresas.

### Principais funcionalidades
- Autenticacao com Clerk
- Feed com posts, likes e comentarios
- Mensagens com SSE (tempo real)
- Stories (texto, imagem e video)
- Conexoes, seguidores e perfil
- Perfil de empresa com tabs e midias
- Vagas e descoberta
- Notificacoes por e-mail via Inngest (mensagens e comentarios)
- Recomendacoes de vagas por competencias do perfil, com requisitos atendidos e lacunas
- Recursos oficiais de aprendizagem associados a algumas lacunas reconhecidas

### Matching de vagas
- O perfil e as vagas publicados sao lidos do MongoDB existente.
- O backend normaliza competencias conhecidas e aliases (por exemplo, JS/JavaScript) e calcula cobertura dos requisitos obrigatorios (80% por padrao) e desejaveis (20%). Os pesos podem ser alterados por ambiente.
- Competencias nao encontradas sao apresentadas como "nao identificadas no perfil"; nao significam que a pessoa nao as possui. Sem dados suficientes, o score fica indisponivel.
- O perfil atual guarda competencias declaradas, mas nao tem campos estruturados para projetos, experiencia, formacao ou preferencias de modalidade. Esses criterios aparecem como nao avaliados quando aplicavel.
- A correspondencia usa regras e um vocabulario de aliases; nao usa embeddings nem chama um modelo externo. O catalogo pequeno de aprendizagem aponta para materiais oficiais verificados e nao inventa duracao ou nivel quando a fonte nao os informa.
- O ranking considera ate `MATCH_MAX_CANDIDATE_JOBS` vagas locais publicadas mais recentes (500 por padrao), alem das vagas Remotive retornadas. Resultados Remotive ficam em cache por 10 minutos.

### Stack
- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express
- Banco: MongoDB (Mongoose)
- Auth: Clerk
- Midia: ImageKit
- Orquestracao: Inngest
- Email: Nodemailer

### Estrutura do repositorio
- `Adapt_Frontend/` frontend (Vite)
- `server/` backend (Express)

### Como rodar localmente

#### 1) Backend
```bash
cd server
npm install
npm run server
```

#### 2) Frontend
```bash
cd Adapt_Frontend
npm install
npm run dev
```

### Variaveis de ambiente

#### Backend (`server/.env`)
```
MONGODB_URL=
CLERK_SECRET_KEY=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
SMTP_USER=
SMTP_PASS=
SENDER_EMAIL=
FRONTEND_URL=
MATCH_WEIGHT_REQUIRED=80
MATCH_WEIGHT_DESIRED=20
MATCH_MAX_CANDIDATE_JOBS=500
```

#### Frontend (`Adapt_Frontend/.env`)
```
VITE_BASEURL=http://localhost:4000
VITE_CLERK_PUBLISHABLE_KEY=
```

### Scripts

#### Backend
- `npm run server` inicia com nodemon
- `npm start` inicia com node
- `npm test` executa os testes do matching e das rotas relacionadas

#### Frontend
- `npm run dev` ambiente de desenvolvimento
- `npm run build` build de producao
- `npm run preview` preview local

### Observacoes
- O feed e as mensagens dependem do backend rodando e do `VITE_BASEURL` correto.
- Inngest envia emails de novas mensagens e comentarios. Configure `FRONTEND_URL` para os links das notificacoes.

### Deploy
- Frontend pode ser publicado no Vercel.
- Backend pode ser publicado em qualquer Node host (Render, Railway, etc).
- Atualize `VITE_BASEURL` e `FRONTEND_URL` conforme o ambiente.

### Fluxo de desenvolvimento e publicacao
- **Preparacao unica:** no GitHub, crie `develop` a partir da `master` atual. Mantenha `master` como branch estavel de producao; nao renomeie a branch.
- **Vercel:** em cada projeto (`adapt` e `projeto-adapt`), abra **Settings → Git**, confirme o repositorio e defina **Production Branch** como `master`. Habilite Preview para branches nao-production. Confira **Root Directory**, comando de build, diretorio de saida e dominio antes de salvar mudancas. Os dois projetos podem ser frontend e backend, portanto nao desative nenhum sem mapear suas dependencias.
- Para o frontend, confirme se o Root Directory e `Adapt_Frontend`, o build e `npm run build` e a saida e `dist`. Para o backend, confirme se o Root Directory e `server` e se a configuracao Node em `server/vercel.json` e usada. Esses valores devem ser conferidos no painel; os arquivos nao definem a Production Branch.
- **Preview seguro:** configure no escopo Preview um `VITE_BASEURL` que aponte para uma API de staging; configure tambem o backend Preview/staging com banco e credenciais de teste apropriados. Nao use dados de producao em testes que gravam informacoes. Preserve as variaveis do escopo Production.
- **GitHub:** proteja `master` em **Settings → Branches**. Exija Pull Request e os checks `Frontend build` e `Backend tests`; bloqueie force pushes e exclusao da branch. Exija uma aprovacao se houver outro revisor disponivel. Se houver apenas um mantenedor, nao exija aprovacao obrigatoria ate existir um segundo revisor, pois o autor nao pode aprovar o proprio PR.
- **Desenvolvimento:** crie branches de funcionalidade a partir de `develop`, faca push e valide o Preview gerado. Integre mudancas testadas em `develop` por PR; depois abra PR de `develop` para `master`, verifique os checks e a revisao e so entao faca o merge.
- **Verificacao de release:** confirme que push direto para `master` e recusado, que PRs aguardam os checks e que branches de teste geram Preview, nao Production. Depois do merge, confira em cada projeto Vercel necessario se o deploy Production corresponde ao commit integrado.
- **Rollback:** reverta a mudanca por novo PR/commit ou restaure o deployment anterior no Vercel. Se frontend e backend precisarem de rollback, mantenha as versoes compativeis e verifique ambos os projetos.
- A protecao de `master`, a Production Branch, os Root Directories, os dominios e as variaveis de ambiente sao configuracoes externas ao repositorio; devem ser ajustadas nos paineis GitHub/Vercel por alguem com permissao. Este repositorio nao altera essas configuracoes.

---

## English

Platform to connect IT professionals and companies, with social feed, real-time messages, stories, jobs, and company profiles.

### Key features
- Clerk authentication
- Feed with posts, likes, and comments
- Messages with SSE (real time)
- Stories (text, image, video)
- Connections, followers, and profile
- Company profile with tabs and media
- Jobs and discovery
- Email notifications via Inngest (messages and comments)
- Profile-skill job recommendations, with matched requirements and skill gaps
- Official learning resources linked to some identified gaps

### Job matching
- Published jobs and candidate profiles are read from the existing MongoDB collections.
- The backend normalizes known skills and aliases (for example, JS/JavaScript) and calculates coverage of required skills (80% by default) and desirable skills (20%). Weights are configurable by environment.
- Skills not found are described as "not identified in the profile"; this does not mean the candidate lacks them. If data is insufficient, no score is shown.
- The current profile stores declared skills but has no structured fields for projects, experience, education, or work-mode preferences. These criteria are marked as not evaluated when relevant.
- Matching uses transparent rules and a skill-alias vocabulary; it does not use embeddings or call an external model. The small learning catalog links to verified official material and does not invent duration or level when the source omits them.
- Ranking considers up to `MATCH_MAX_CANDIDATE_JOBS` most recent published local jobs (500 by default), plus returned Remotive jobs. Remotive results are cached for 10 minutes.

### Stack
- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: Clerk
- Media: ImageKit
- Orchestration: Inngest
- Email: Nodemailer

### Repository structure
- `Adapt_Frontend/` frontend (Vite)
- `server/` backend (Express)

### Run locally

#### 1) Backend
```bash
cd server
npm install
npm run server
```

#### 2) Frontend
```bash
cd Adapt_Frontend
npm install
npm run dev
```

### Environment variables

#### Backend (`server/.env`)
```
MONGODB_URL=
CLERK_SECRET_KEY=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
SMTP_USER=
SMTP_PASS=
SENDER_EMAIL=
FRONTEND_URL=
MATCH_WEIGHT_REQUIRED=80
MATCH_WEIGHT_DESIRED=20
MATCH_MAX_CANDIDATE_JOBS=500
```

#### Frontend (`Adapt_Frontend/.env`)
```
VITE_BASEURL=http://localhost:4000
VITE_CLERK_PUBLISHABLE_KEY=
```

### Scripts

#### Backend
- `npm run server` starts with nodemon
- `npm start` starts with node
- `npm test` runs the matching and related route tests

#### Frontend
- `npm run dev` dev environment
- `npm run build` production build
- `npm run preview` local preview

### Notes
- Feed and messages depend on the backend running and the correct `VITE_BASEURL`.
- Inngest sends emails for new messages and comments. Set `FRONTEND_URL` for notification links.

### Deploy
- Frontend can be deployed on Vercel.
- Backend can be deployed on any Node host (Render, Railway, etc).
- Update `VITE_BASEURL` and `FRONTEND_URL` per environment.

### Development and release workflow
- **One-time setup:** create `develop` from the current `master` in GitHub. Keep `master` as the stable production branch; do not rename it.
- **Vercel:** in each project (`adapt` and `projeto-adapt`), open **Settings → Git**, verify the repository, and set **Production Branch** to `master`. Enable Preview deployments for non-production branches. Verify **Root Directory**, build command, output directory, and domain before saving changes. The two projects may host frontend and backend, so do not disable either before mapping their dependencies.
- For the frontend, verify whether Root Directory is `Adapt_Frontend`, build command is `npm run build`, and output is `dist`. For the backend, verify whether Root Directory is `server` and the Node configuration in `server/vercel.json` is used. Confirm these values in the dashboard; the files do not set Production Branch.
- **Safe Preview:** set Preview-scoped `VITE_BASEURL` to a staging API; configure the Preview backend with an appropriate staging database and test credentials. Do not use production data for tests that write data. Preserve Production-scoped variables.
- **GitHub:** protect `master` in **Settings → Branches**. Require Pull Requests and the `Frontend build` and `Backend tests` checks; block force pushes and branch deletion. Require an approval when another reviewer is available. If there is only one maintainer, do not require approval until a second reviewer is available, because an author cannot approve their own PR.
- **Development:** create feature branches from `develop`, push them, and validate the generated Preview. Integrate tested changes into `develop` through PRs; then open a PR from `develop` to `master`, verify checks and review, and only then merge.
- **Release verification:** confirm direct pushes to `master` are rejected, PRs wait for checks, and test branches create Preview rather than Production. After merge, check in each required Vercel project that the Production deployment matches the merged commit.
- **Rollback:** revert through a new PR/commit or restore the previous deployment in Vercel. If both frontend and backend need rollback, keep their versions compatible and verify both projects.
- `master` protection, Production Branch, Root Directories, domains, and environment variables are external repository settings; a user with the necessary permissions must configure them in GitHub/Vercel dashboards. This repository does not change those settings.
