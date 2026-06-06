# SheVibes Build Showcase

> A public gallery of everything built during **SheVibes Cohort 0** — 66 days of learning to build with AI, run by [PiFo (Product Innovators Foundation)](https://pifoundation.in).

**Live site → [shevibes-showcase.vercel.app](https://shevibes-showcase.vercel.app)**

---

## What is this?

SheVibes is a 66-day AI-building programme by PiFo for women in product, design, and tech. Participants build one real product from scratch — daily challenges, daily reflections, daily shipping.

This platform is the **output showcase**: a permanent record of every project built during the cohort. Anyone can browse it. Only verified cohort participants (via a shared code) can submit.

---

## What each project tracks

Each submission captures the full build story:

| Field | Description |
|---|---|
| **Builder name** | Who built it |
| **Builder bio** | One-line background |
| **LinkedIn** | Builder's LinkedIn profile |
| **Project name** | Name of the thing they built |
| **Live URL** | The actual deployed product |
| **What they built** | Description of the project |
| **Who it's for** | Target user |
| **Problem it solves** | The pain point or gap addressed |
| **Hardest part** | What nearly broke them |
| **What surprised them** | Unexpected discovery from the build |
| **Day shipped** | Which of the 66 days it went live |
| **Tags** | Category labels (AI, Health, Productivity, etc.) |

---

## How it works

### For visitors (public)
- Browse all submitted projects at `/`
- Click any card to see the full project detail page at `/project/[id]`
- No login required

### For SheVibes participants (code-gated)
1. Go to `/submit`
2. Enter the cohort code shared via WhatsApp
3. Fill in your project details
4. Submit — your project appears in the gallery instantly

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS variables |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| Auth | Shared cohort code (env var) |
| Deployment | [Vercel](https://vercel.com) |

---

## Project structure

```
shevibes-showcase/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Public gallery (home)
│   │   ├── layout.tsx                # Root layout + nav
│   │   ├── globals.css               # Design tokens + base styles
│   │   ├── project/[id]/page.tsx     # Project detail page
│   │   ├── submit/page.tsx           # Submission form (code-gated)
│   │   └── api/
│   │       ├── verify-code/route.ts  # Validates cohort code
│   │       └── projects/route.ts     # Creates a new project entry
│   └── lib/
│       ├── supabase.ts               # Supabase client (anon + service)
│       └── database.types.ts         # TypeScript types for all tables
├── supabase/
│   └── schema.sql                    # Full DB schema — run this first
├── public/
│   └── pifo-logo.svg                 # PiFo wordmark logo
└── .env.local                        # Local secrets (gitignored)
```

---

## Database schema

One table. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor to set up:

```sql
create table projects (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  builder_name text not null,
  builder_email text not null,
  builder_linkedin text,
  builder_bio text,
  project_name text not null,
  live_url text not null,
  what_you_built text not null,
  who_is_it_for text not null,
  problem_it_solves text not null,
  hardest_thing text not null,
  what_surprised_you text not null,
  day_number integer,
  tags text[],
  approved boolean default true
);
```

Row-level security is enabled — public can read approved projects, the service role (used by API routes) can write.

---

## Environment variables

| Variable | Where to get it | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role | ✅ |
| `COHORT_CODE` | You decide — share this with participants | ✅ |

---

## Running locally

```bash
# Install dependencies
npm install

# Add your environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials and cohort code

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying

The project is deployed on Vercel. To redeploy after any code change:

```bash
vercel --prod
```

Or push to the connected GitHub branch and Vercel auto-deploys.

---

## About SheVibes × PiFo

**SheVibes** is a cohort-based programme where women learn to build real products using AI — not just prompting, but actually shipping. 66 days. Daily challenges. Real outputs.

**PiFo (Product Innovators Foundation)** runs the programme, the portal, the community, and the accountability system that keeps 65+ women building every day.

- PiFo portal: [portal.pifoundation.in](https://portal.pifoundation.in)
- Programme: SheVibes Cohort 0 (2026)
