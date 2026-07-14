# Stitch by Nuvio — Deployment Guide

Production deployment target: **https://stitch.nuviobridge.com**

This guide covers environment setup, Supabase provisioning, storage, seeding, Vercel deployment, DNS, and post-deploy verification.

---

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Supabase](https://supabase.com/) project (Pro recommended for production)
- [Vercel](https://vercel.com/) account linked to the repository
- DNS access for `nuviobridge.com` (or your apex domain)
- AI provider API key (OpenAI, Anthropic, or Gemini)

---

## 1. Environment variables

Copy `.env.example` to `.env.local` for local development. For production, set these in **Vercel → Project → Settings → Environment Variables**.

### Required (production)

| Variable | Scope | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Service role key (never expose to client) |
| `NEXT_PUBLIC_SITE_URL` | Client + Server | `https://stitch.nuviobridge.com` |
| `NEXT_PUBLIC_ENABLE_DEMO_DATA` | Client + Server | `false` in production |

### AI provider (at least one)

| Variable | Description |
|----------|-------------|
| `AI_PROVIDER` | `openai` \| `anthropic` \| `gemini` |
| `OPENAI_API_KEY` | Required if `AI_PROVIDER=openai` |
| `ANTHROPIC_API_KEY` | Required if `AI_PROVIDER=anthropic` |
| `GEMINI_API_KEY` | Required if `AI_PROVIDER=gemini` |

### Security / server

| Variable | Description |
|----------|-------------|
| `CRON_SECRET` | Random string for protected cron routes |
| `STORAGE_SIGNING_SECRET` | Random string for signed storage URLs |
| `DATABASE_URL` | Postgres connection string (seed script, migrations) |

### Local development (demo mode)

```env
NEXT_PUBLIC_ENABLE_DEMO_DATA=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

No Supabase keys are required when demo mode is enabled.

---

## 2. Supabase setup

### Create project

1. Create a new Supabase project (region closest to your users).
2. Note the **Project URL**, **anon key**, and **service role key** from **Settings → API**.
3. Copy the **Database connection string** (URI) from **Settings → Database**.

### Run migrations

Migrations live in `supabase/migrations/`. Apply them in order:

```bash
# Option A: Supabase CLI (recommended)
npx supabase link --project-ref <your-project-ref>
npx supabase db push

# Option B: SQL Editor
# Paste and run each file in supabase/migrations/ in numeric order
```

Migration files (in order):

| File | Purpose |
|------|---------|
| `20260713000001_init_extensions.sql` | Postgres extensions |
| `20260713000002_core_tables.sql` | Profiles, projects, subscriptions |
| `20260713000003_patterns.sql` | Patterns, sections, rows |
| `20260713000004_yarn_colors.sql` | Yarn vault, color palettes |
| `20260713000005_vision_tutor.sql` | Vision scans, tutor conversations |
| `20260713000006_lessons.sql` | Learning center content |
| `20260713000007_rls.sql` | Row-level security policies |
| `20260713000008_storage.sql` | Storage buckets + policies |
| `20260713000009_indexes.sql` | Performance indexes |

### Auth configuration

In **Supabase → Authentication → URL Configuration**:

| Setting | Value |
|---------|-------|
| Site URL | `https://stitch.nuviobridge.com` |
| Redirect URLs | `https://stitch.nuviobridge.com/**`, `http://localhost:3000/**` |

Enable **Email** provider (and OAuth providers if desired).

---

## 3. Storage buckets

Migration `20260713000008_storage.sql` creates these private buckets:

| Bucket | Purpose | Max size |
|--------|---------|----------|
| `stitch-project-images` | Project cover photos | 10 MB |
| `stitch-pattern-files` | Uploaded PDFs / patterns | 20 MB |
| `stitch-yarn-images` | Yarn vault photos | 5 MB |
| `stitch-vision-scans` | Camera scan images | 10 MB |
| `stitch-profile-images` | User avatars | 5 MB |
| `stitch-generated-assets` | AI-generated previews / exports | 20 MB |

Policies scope objects to `auth.uid()` folder paths. Verify buckets appear under **Storage** after migration.

---

## 4. Seed data

The seed script populates demo projects, yarn, lessons, and patterns for development/staging.

```bash
# Set env vars first
export NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
export DATABASE_URL=postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres

npm run db:seed
```

Output is written to `scripts/seed-output.json`. Re-run after schema changes or to reset staging data.

> **Production:** Seed only staging or a dedicated demo environment. Production users should register through normal auth flows.

---

## 5. Vercel deployment

### Connect repository

1. Import the Git repository in Vercel.
2. Framework preset: **Next.js**
3. Root directory: `/` (default)
4. Build command: `npm run build`
5. Output: Next.js default

### Environment variables

Add all production variables from Section 1. Mark `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, and `STORAGE_SIGNING_SECRET` as **sensitive**.

Set `NEXT_PUBLIC_ENABLE_DEMO_DATA=false` for production.

### Build settings

Ensure Node.js 20+ in **Settings → General → Node.js Version**.

### Deploy

```bash
# Via Git push (auto-deploy on main)
git push origin main

# Or manual
npx vercel --prod
```

---

## 6. DNS — stitch.nuviobridge.com

### Vercel domain

1. **Vercel → Project → Settings → Domains**
2. Add `stitch.nuviobridge.com`
3. Vercel provides a CNAME target (e.g. `cname.vercel-dns.com`)

### DNS records (at your DNS provider)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `stitch` | `cname.vercel-dns.com` | 300 |

If using Cloudflare, set proxy status to **DNS only** initially until SSL is verified, then enable proxy if desired.

### SSL

Vercel provisions TLS automatically once DNS propagates (usually minutes, up to 48 hours).

### Supabase redirect

After DNS is live, update Supabase **Site URL** to `https://stitch.nuviobridge.com` and confirm redirect URLs include the production domain.

---

## 7. Post-deploy checklist

### Infrastructure

- [ ] All 9 Supabase migrations applied without errors
- [ ] 6 storage buckets visible with RLS policies
- [ ] Vercel production deploy succeeded (`npm run build` passes)
- [ ] `stitch.nuviobridge.com` resolves with valid HTTPS
- [ ] `NEXT_PUBLIC_ENABLE_DEMO_DATA=false` in production

### Auth

- [ ] Sign up creates a profile row
- [ ] Login / logout works
- [ ] Password reset email delivers
- [ ] Middleware redirects unauthenticated users to `/auth/login`

### Core flows

- [ ] Dashboard loads with user projects
- [ ] Create Pattern (`/create/pattern`) generates a pattern (AI key configured)
- [ ] Workspace row counter persists progress
- [ ] Yarn Vault CRUD works
- [ ] Vision scan upload stores to `stitch-vision-scans`
- [ ] Tutor chat returns structured responses
- [ ] PDF export route responds

### Subscription gates

- [ ] Free tier limits enforced (3 projects, 10 tutor messages)
- [ ] Stitch Plus unlocks AI pattern, substitution, color studio
- [ ] Stitch Vision unlocks camera analysis features

### PWA / assets

- [ ] `/manifest.webmanifest` loads
- [ ] Favicon (`/assets/stitch/brand/png/stitch-mark.png`) displays
- [ ] Offline page (`/offline`) accessible

### Monitoring

- [ ] Vercel Analytics or external monitoring configured
- [ ] Supabase logs reviewed for RLS violations
- [ ] Error tracking (Sentry, etc.) optional but recommended

### Security

- [ ] Service role key not exposed in client bundle
- [ ] `CRON_SECRET` and `STORAGE_SIGNING_SECRET` are strong random values
- [ ] Supabase RLS enabled on all user tables

---

## 8. Running tests before deploy

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e    # requires dev server; Playwright starts it automatically
```

---

## 9. Rollback

- **Vercel:** Redeploy a previous deployment from the Deployments tab.
- **Database:** Supabase does not auto-rollback migrations. Keep migration backups; use point-in-time recovery on Pro plans.
- **DNS:** Revert CNAME to previous target if needed.

---

## Support

- Implementation status: `STITCH_IMPLEMENTATION_STATUS.md`
- UI kit assets: `public/assets/stitch/README.md`
- Local setup: `README.md`
