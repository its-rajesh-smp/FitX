# FitX

FitX is an Agent powered fitness planning application with an AI-assisted chat,
weekly workout plans, exercise tracking, and video guides.

## Project structure

- `api/` - Express, TypeScript, PostgreSQL, Knex, and Objection.js API
- `ui/` - React, TypeScript, and Vite frontend
- `docker-compose.yml` - local API and PostgreSQL services
- `postgresql/data/` - ignored local PostgreSQL data created by Docker

## Prerequisites

- Node.js 22+
- pnpm 10+
- Docker Desktop with Docker Compose

Enable pnpm through Corepack if it is not already installed:

```bash
corepack enable
```

## Environment setup

Create the local environment files:

```bash
cp api/.env.example api/.env
cp ui/.env.example ui/.env
```

At minimum, update `api/.env` with:

- `JWT_SECRET` - a long random secret
- `GEMINI_API_KEY` when using the default `AI_PROVIDER=gemini`
- `OPENAI_API_KEY` when using `AI_PROVIDER=openai`
- `YOUTUBE_API_KEY` to enable exercise video guides

The example database values work with the local Docker PostgreSQL service.
Docker automatically overrides `POSTGRES_HOST` to `db` for the API container,
while `localhost` remains correct when running the API directly on the host.

## Run locally with Docker

Docker runs the API and PostgreSQL. Run the UI separately for hot reload.

```bash
docker compose up --build
```

In another terminal:

```bash
cd ui
pnpm install
pnpm dev
```

Open:

- UI: http://localhost:5173
- API: http://localhost:8080/api/v1

The API automatically runs database migrations and seeds when it starts.

Stop the Docker services:

```bash
docker compose down
```

## Docker naming and existing `template_*` containers

The Compose setup uses the FitX-specific names `fitx-api`, `fitx-postgres`, and
`fitx-network`.

PostgreSQL data persists in `postgresql/data/`. Running `docker compose down -v`
does not delete this bind-mounted directory. Delete it manually only when you
intentionally want to reset all local database data.

## Run without Docker

Start PostgreSQL yourself and ensure the `POSTGRES_*` values in `api/.env`
point to it. Then run:

```bash
cd api
pnpm install
pnpm dev
```

In another terminal:

```bash
cd ui
pnpm install
pnpm dev
```

## Build and checks

API:

```bash
cd api
pnpm build
```

UI:

```bash
cd ui
pnpm lint
pnpm build
```
