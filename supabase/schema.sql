-- SheVibes Build Showcase schema

create extension if not exists "uuid-ossp";

-- Projects submitted by cohort participants
create table if not exists projects (
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
  day_number integer check (day_number >= 1 and day_number <= 66),
  tags text[],
  approved boolean default true
);

-- Row-level security: anyone can read approved projects
alter table projects enable row level security;

create policy "Anyone can view approved projects"
  on projects for select
  using (approved = true);

-- Service role (used by API routes) bypasses RLS automatically
