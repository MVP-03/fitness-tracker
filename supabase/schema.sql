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

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sex text,
  age integer,
  height_cm numeric,
  current_weight_kg numeric,
  target_weight_kg numeric,
  activity_level text,
  weekly_rate_kg numeric,
  goals jsonb
);

alter table public.foods enable row level security;
alter table public.meal_entries enable row level security;
alter table public.weight_entries enable row level security;
alter table public.workouts enable row level security;
alter table public.profiles enable row level security;

create index if not exists meal_entries_user_date_idx on public.meal_entries (user_id, date);
create index if not exists workouts_user_date_idx on public.workouts (user_id, date);
create index if not exists weight_entries_user_date_idx on public.weight_entries (user_id, date);

do $$
declare
  t text;
begin
  for t in select unnest(array['foods', 'meal_entries', 'weight_entries', 'workouts', 'profiles'])
  loop
    execute format($f$
      create policy "select own rows" on public.%I
        for select using (auth.uid() = user_id);
      create policy "insert own rows" on public.%I
        for insert with check (auth.uid() = user_id);
      create policy "update own rows" on public.%I
        for update using (auth.uid() = user_id);
      create policy "delete own rows" on public.%I
        for delete using (auth.uid() = user_id);
    $f$, t, t, t, t);
  end loop;
end $$;
