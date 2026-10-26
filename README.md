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
