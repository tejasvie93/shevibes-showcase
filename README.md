# SheVibes Build Showcase

A permanent public record of every product built during **SheVibes Cohort 0** — 66 days of building with AI, run by [PiFo](https://pifoundation.in).

**Live → [shevibes-showcase.vercel.app](https://shevibes-showcase.vercel.app)**

---

## Who is it for

**Participants** — SheVibes Cohort 0 builders who want to log their project, own what they made, and be part of the collective record.

**The public** — Anyone who wants to see what women built during 66 days with AI. Hiring managers, peers, future cohort members, the curious.

**Organizers** — A single URL to share that shows the full output of the programme. Proof that the cohort built real things.

---

## What it does

- **Gallery** — A paginated list (5 per page) of every submitted project. Shows project name and who built it. Anyone can browse without logging in.

- **Project detail** — Clicking a project shows the full build story: what was built, who it's for, the problem it solves, and optionally the hardest moment and what surprised the builder.

- **Submission** — Participants enter a shared cohort code to unlock the form. They fill in their name, email, project name, live URL, and build story. No accounts, no approvals — it goes live immediately.

---

## What it is not

- **Not a learning portal.** The daily challenges, reflections, and resources live on the [PiFo Portal](https://portal.pifoundation.in). This is only the output showcase.

- **Not a social platform.** There are no likes, comments, follows, or feeds. It is a record, not a network.

- **Not a general portfolio tool.** It is scoped entirely to SheVibes Cohort 0. It does not support multiple cohorts, open signups, or external projects.

- **Not an admin dashboard.** There is no approval flow, moderation queue, or analytics view. Submissions go live the moment they are submitted.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Shared cohort code (env var) |
| Hosting | Vercel |

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                  # Gallery — paginated project list
│   ├── layout.tsx                # Nav + footer shell
│   ├── globals.css               # Design tokens, base styles
│   ├── project/[id]/page.tsx     # Project detail page
│   ├── submit/page.tsx           # Submission form (code-gated)
│   └── api/
│       ├── verify-code/route.ts  # Validates the cohort code
│       └── projects/route.ts     # Inserts a new project
├── lib/
│   ├── supabase.ts               # Supabase client setup
│   └── database.types.ts         # TypeScript types for DB tables
supabase/
│   └── schema.sql                # Run this once in Supabase SQL Editor
public/
│   └── pifo-logo.svg             # PiFo wordmark
```

---

## Database

One table. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor to create it.

```sql
create table projects (
  id                uuid primary key default uuid_generate_v4(),
  created_at        timestamptz default now(),
  builder_name      text not null,
  builder_email     text not null,
  builder_linkedin  text,
  builder_bio       text,
  project_name      text not null,
  live_url          text not null,
  what_you_built    text not null,
  who_is_it_for     text not null,
  problem_it_solves text not null,
  hardest_thing     text,          -- optional
  what_surprised_you text,         -- optional
  day_number        integer,
  tags              text[],
  approved          boolean default true
);
```

RLS is enabled. The `anon` key can read approved rows. The `service_role` key (used by API routes) can write.

---

## Environment variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
| `COHORT_CODE` | You set this — share it with participants |

---

## Local setup

```bash
npm install
cp .env.local.example .env.local   # add your credentials
npm run dev
```

---

## Deploy

```bash
vercel --prod
```

Any push to `main` via the connected GitHub repo also triggers a Vercel redeploy.

---

## About SheVibes × PiFo

**SheVibes** is a 66-day programme where women in product, design, and tech learn to build real things with AI — not prompts, but products. Daily challenges, daily shipping, daily reflection.

**PiFo** (Product Innovators Foundation) runs the programme, the portal, and the community that holds 65+ women accountable every day.

Portal: [portal.pifoundation.in](https://portal.pifoundation.in)
