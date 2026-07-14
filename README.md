# Stitch by Nuvio

Your smartest crochet companion — AI pattern generation, camera stitch analysis, yarn vault, and an interactive pattern workspace.

**Production URL:** [stitch.nuviobridge.com](https://stitch.nuviobridge.com)

## Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4 + Stitch design tokens
- **Data:** Supabase (Postgres, Auth, Storage)
- **Validation:** Zod
- **Testing:** Vitest (unit) + Playwright (e2e)

## Quick start (demo mode)

Demo mode runs the full UI with seeded dashboard data — no Supabase credentials required.

```bash
npm install
cp .env.example .env.local   # or use the included .env.local
# Ensure .env.local contains:
#   NEXT_PUBLIC_ENABLE_DEMO_DATA=true
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000

npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Visit `/auth/login` and sign in with any valid email/password (defaults are pre-filled). Demo mode accepts any credentials and loads the dashboard with sample projects, yarn, and lessons.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run db:seed` | Seed Supabase with demo data (requires credentials) |
| `npm run db:types` | Generate Supabase TypeScript types |

## Project structure

```
src/
  app/              # Next.js routes (dashboard, create, vision, tutor, yarn, …)
  components/       # UI and Stitch-specific components
  hooks/            # React hooks (row counter, voice assistant)
  lib/              # Schemas, subscriptions, demo data, utilities
  services/         # AI and business logic services
  types/            # Database and domain types
tests/              # Vitest unit tests
e2e/                # Playwright smoke tests
supabase/migrations # SQL migrations (tables, RLS, storage)
public/assets/stitch/  # Brand, icons, illustrations, UI kit
```

## Environment variables

See [`.env.example`](.env.example) for the full list. Key variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_ENABLE_DEMO_DATA` | Local dev | `true` skips auth, uses demo data |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Service role for seed/admin |
| `AI_PROVIDER` | AI features | `openai`, `anthropic`, or `gemini` |
| `OPENAI_API_KEY` | If using OpenAI | API key for pattern/tutor/vision |

## Testing

```bash
# Unit tests
npm run test

# E2E (starts dev server automatically)
npm run test:e2e
```

Unit tests cover Zod schemas, pattern validation, row-counter logic, yarn substitution, subscription gates, and search. E2E smoke tests verify login → dashboard and the pattern generator form.

## Deployment

See **[STITCH_DEPLOYMENT.md](STITCH_DEPLOYMENT.md)** for the full production deployment guide (Supabase setup, migrations, Vercel, DNS, post-deploy checklist).

## Implementation status

See **[STITCH_IMPLEMENTATION_STATUS.md](STITCH_IMPLEMENTATION_STATUS.md)** for feature checklist and progress.

## License

Private — Nuvio Bridge.
