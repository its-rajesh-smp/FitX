# Deploy FitX to Vercel

Create two Vercel projects from this repository. Vercel treats each selected
directory as an independent project.

## API project

1. Import the repository and set **Root Directory** to `api`.
2. Keep the detected build and install settings.
3. Add the environment variables listed in `api/.env.example`.
4. Set `NODE_ENV=production`.
5. Use a hosted Postgres database and set either `DATABASE_URL` or
   `POSTGRES_URL`. A local Docker database is not reachable from Vercel.
6. Deploy, then verify `https://<api-project>.vercel.app/api/v1/health`.

The API is deployed as one Express Vercel Function. Database migrations are
not run inside serverless requests. Run migrations and seeds against the
production database before serving traffic:

```powershell
cd api
$env:DATABASE_URL="<production-postgres-url>"
$env:NODE_ENV="production"
pnpm exec knex migrate:latest --knexfile src/db/knexfile.ts
pnpm exec knex seed:run --knexfile src/db/knexfile.ts
```

## UI project

1. Import the same repository again and set **Root Directory** to `ui`.
2. Set `VITE_API_BASE_URL=https://<api-project>.vercel.app/api/v1`.
3. Deploy.

`ui/vercel.json` sends browser deep links to the Vite SPA. The API currently
allows cross-origin requests, so the separate UI domain can call it.
