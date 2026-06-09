# Deploy FitX to Vercel

Create two Vercel projects from this repository. Vercel treats each selected
directory as an independent project.

## API project

1. Import the repository and set **Root Directory** to `api`.
2. Keep the detected install settings. `api/vercel.json` explicitly runs the
   API build and deploys `api/index.js`, which loads the compiled output.
3. Add the environment variables listed in `api/.env.example`.
4. Set `NODE_ENV=production`.
5. Set `POSTGRES_URL` to the Supabase transaction pooler URL on port `6543`.
   Keep `POSTGRES_POOL_MAX=1` for the serverless API.
6. Deploy, then verify `https://<api-project>.vercel.app/api/v1/health`.

The API is deployed as one Express Vercel Function. Database migrations are
not run inside serverless requests. Use Supabase's `POSTGRES_URL_NON_POOLING`
URL on port `5432` when running migrations and seeds:

The TypeScript source can use its configured path aliases. The API build runs
`tsc-alias` after TypeScript so the JavaScript deployed from `dist` contains
runtime-safe relative imports.

```powershell
cd api
$env:DATABASE_URL="<supabase-postgres-url-non-pooling>"
$env:NODE_ENV="production"
pnpm exec knex migrate:latest --knexfile src/db/knexfile.ts
pnpm exec knex seed:run --knexfile src/db/knexfile.ts
```

Do not commit Supabase credentials. Add them through the Vercel project's
Environment Variables settings. If credentials were shared publicly, rotate
the Supabase database password before deployment.

## UI project

1. Import the same repository again and set **Root Directory** to `ui`.
2. Set `VITE_API_BASE_URL=https://<api-project>.vercel.app/api/v1`.
3. Deploy.

`ui/vercel.json` sends browser deep links to the Vite SPA. The API currently
allows cross-origin requests, so the separate UI domain can call it.
