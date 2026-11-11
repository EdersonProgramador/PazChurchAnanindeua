# Paz Church Ananindeua

SPA mobile-first inspirada no app Paz Palmas, com conteúdo da unidade **Paz Church Metrópole — Ananindeua/PA**.

## Stack

- **Frontend:** React 19, React Router, Tailwind CSS, Lucide React, jQuery (animações de entrada)
- **Backend (MVC):** Express — `controllers/`, `services/`, `routes/`, Prisma como camada de modelo
- **RBAC:** cargos (`Role`), permissões (`Permission`), funções (`OrgFunction`) com CRUD em `/api/v1/admin`
- **Neon:** Postgres, Object Storage, Realtime (`neon.ts` + `.env.local`)

## Desenvolvimento

```bash
cp .env.local.example .env.local   # ou use neon env pull
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:3000  

Admin seed: `admin@pazananindeua.org` / `admin123` (altere em produção).

## Produção (Render)

`render.yaml` — serviço Node na porta `PORT`, migração + seed no start.
