-- SheVibes Build Showcase
-- Run this once in the Supabase SQL Editor for your project.

create extension if not exists "uuid-ossp";

create table if not exists projects (
  id                 uuid        primary key default uuid_generate_v4(),
  created_at         timestamptz default now(),
  builder_name       text        not null,
  builder_email      text        not null,
  builder_linkedin   text,
  builder_bio        text,
  project_name       text        not null,
  live_url           text        not null,
  what_you_built     text        not null,
  who_is_it_for      text        not null,
  problem_it_solves  text        not null,
  hardest_thing      text,                    -- optional
  what_surprised_you text,                    -- optional
  linkedin_post_url  text,                    -- optional: the post where they announced it
  day_number         integer     check (day_number >= 1 and day_number <= 66),
  tags               text[],
  approved           boolean     default true
);

-- Public read access for approved projects
alter table projects enable row level security;

create policy "Anyone can view approved projects"
  on projects for select
  using (approved = true);

-- The service_role key used by API routes bypasses RLS automatically.
