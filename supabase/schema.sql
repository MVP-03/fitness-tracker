-- Fitness Tracker — shared multi-user schema for Supabase.
-- Apply this in the SQL editor of whichever Supabase project you connect.
-- Each table is scoped to auth.uid() via RLS, so 2-3 people can share one
-- project while only ever seeing their own logs.

create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  serving_label text not null default '1 serving',
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  fiber numeric not null default 0,
  sugar numeric not null default 0,
  sodium numeric not null default 0,
  potassium numeric not null default 0,
  calcium numeric not null default 0,
  iron numeric not null default 0,
  vitamin_c numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.meal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  meal_type text not null default 'snack',
  food_name text not null,
  quantity numeric not null default 1,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  fiber numeric not null default 0,
  sugar numeric not null default 0,
  sodium numeric not null default 0,
  potassium numeric not null default 0,
  calcium numeric not null default 0,
  iron numeric not null default 0,
  vitamin_c numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  weight_kg numeric not null,
  unique (user_id, date)
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  name text not null,
  sets integer,
  reps integer,
  weight_kg numeric,
  duration_min numeric,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.water_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  amount_ml numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sex text,
  date_of_birth date,
  height_cm numeric,
  current_weight_kg numeric,
  target_weight_kg numeric,
  activity_level text,
  weekly_rate_kg numeric,
  goals jsonb,
  onboarded boolean not null default false
);

-- Migrate installs created before date_of_birth/onboarded existed.
alter table public.profiles add column if not exists date_of_birth date;
alter table public.profiles add column if not exists onboarded boolean not null default false;
alter table public.profiles drop column if exists age;

alter table public.foods enable row level security;
alter table public.meal_entries enable row level security;
alter table public.weight_entries enable row level security;
alter table public.workouts enable row level security;
alter table public.water_entries enable row level security;
alter table public.profiles enable row level security;

create index if not exists meal_entries_user_date_idx on public.meal_entries (user_id, date);
create index if not exists workouts_user_date_idx on public.workouts (user_id, date);
create index if not exists weight_entries_user_date_idx on public.weight_entries (user_id, date);
create index if not exists water_entries_user_date_idx on public.water_entries (user_id, date);

drop policy if exists "select own rows" on public.foods;
create policy "select own rows" on public.foods for select using (auth.uid() = user_id);
drop policy if exists "insert own rows" on public.foods;
create policy "insert own rows" on public.foods for insert with check (auth.uid() = user_id);
drop policy if exists "update own rows" on public.foods;
create policy "update own rows" on public.foods for update using (auth.uid() = user_id);
drop policy if exists "delete own rows" on public.foods;
create policy "delete own rows" on public.foods for delete using (auth.uid() = user_id);

drop policy if exists "select own rows" on public.meal_entries;
create policy "select own rows" on public.meal_entries for select using (auth.uid() = user_id);
drop policy if exists "insert own rows" on public.meal_entries;
create policy "insert own rows" on public.meal_entries for insert with check (auth.uid() = user_id);
drop policy if exists "update own rows" on public.meal_entries;
create policy "update own rows" on public.meal_entries for update using (auth.uid() = user_id);
drop policy if exists "delete own rows" on public.meal_entries;
create policy "delete own rows" on public.meal_entries for delete using (auth.uid() = user_id);

drop policy if exists "select own rows" on public.weight_entries;
create policy "select own rows" on public.weight_entries for select using (auth.uid() = user_id);
drop policy if exists "insert own rows" on public.weight_entries;
create policy "insert own rows" on public.weight_entries for insert with check (auth.uid() = user_id);
drop policy if exists "update own rows" on public.weight_entries;
create policy "update own rows" on public.weight_entries for update using (auth.uid() = user_id);
drop policy if exists "delete own rows" on public.weight_entries;
create policy "delete own rows" on public.weight_entries for delete using (auth.uid() = user_id);

drop policy if exists "select own rows" on public.workouts;
create policy "select own rows" on public.workouts for select using (auth.uid() = user_id);
drop policy if exists "insert own rows" on public.workouts;
create policy "insert own rows" on public.workouts for insert with check (auth.uid() = user_id);
drop policy if exists "update own rows" on public.workouts;
create policy "update own rows" on public.workouts for update using (auth.uid() = user_id);
drop policy if exists "delete own rows" on public.workouts;
create policy "delete own rows" on public.workouts for delete using (auth.uid() = user_id);

drop policy if exists "select own rows" on public.water_entries;
create policy "select own rows" on public.water_entries for select using (auth.uid() = user_id);
drop policy if exists "insert own rows" on public.water_entries;
create policy "insert own rows" on public.water_entries for insert with check (auth.uid() = user_id);
drop policy if exists "update own rows" on public.water_entries;
create policy "update own rows" on public.water_entries for update using (auth.uid() = user_id);
drop policy if exists "delete own rows" on public.water_entries;
create policy "delete own rows" on public.water_entries for delete using (auth.uid() = user_id);

drop policy if exists "select own rows" on public.profiles;
create policy "select own rows" on public.profiles for select using (auth.uid() = user_id);
drop policy if exists "insert own rows" on public.profiles;
create policy "insert own rows" on public.profiles for insert with check (auth.uid() = user_id);
drop policy if exists "update own rows" on public.profiles;
create policy "update own rows" on public.profiles for update using (auth.uid() = user_id);
drop policy if exists "delete own rows" on public.profiles;
create policy "delete own rows" on public.profiles for delete using (auth.uid() = user_id);

grant usage on schema public to authenticated, anon;
grant select, insert, update, delete on public.foods, public.meal_entries, public.weight_entries, public.workouts, public.water_entries, public.profiles to authenticated;
