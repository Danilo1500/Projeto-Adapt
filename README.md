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
