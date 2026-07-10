-- Run this in Supabase SQL Editor to enable index/home visitor device tracking.

create table if not exists public.visitor_logs (
    id uuid primary key default gen_random_uuid(),
    device_id text not null,
    page text not null,
    device_type text,
    user_agent text,
    visit_count integer default 1,
    visited_at timestamptz default now()
);

alter table public.visitor_logs enable row level security;

drop policy if exists "visitor_logs_insert_public" on public.visitor_logs;
create policy "visitor_logs_insert_public"
on public.visitor_logs
for insert
to anon, authenticated
with check (true);

drop policy if exists "visitor_logs_select_authenticated" on public.visitor_logs;
create policy "visitor_logs_select_authenticated"
on public.visitor_logs
for select
to authenticated
using (true);
