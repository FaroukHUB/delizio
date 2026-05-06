-- Delizio - Migration 002 : catégories dynamiques
-- À exécuter dans le SQL Editor de Supabase APRÈS 001_init.sql

-- 1. Table catégories ------------------------------------------------------

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name_fr text not null,
  name_ar text,
  emoji text default '🍕',
  photo_url text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists categories_position_idx on categories(position);

-- 2. RLS ------------------------------------------------------------------

alter table categories enable row level security;
drop policy if exists "anon all" on categories;
create policy "anon all" on categories for all using (true) with check (true);

-- 3. Lever la contrainte CHECK sur products.category ----------------------
-- (on accepte n'importe quelle clé maintenant que les catégories sont dynamiques)

alter table products drop constraint if exists products_category_check;

-- 4. Seed des 7 catégories de départ --------------------------------------

insert into categories (key, name_fr, name_ar, emoji, position) values
  ('fromages',   'Fromages',   'الأجبان',   '🧀', 1),
  ('viandes',    'Viandes',    'اللحوم',    '🍖', 2),
  ('legumes',    'Légumes',    'الخضروات',  '🥬', 3),
  ('sauces',     'Sauces',     'الصلصات',   '🥫', 4),
  ('condiments', 'Condiments', 'التوابل',   '🧂', 5),
  ('desserts',   'Desserts',   'الحلويات',  '🍰', 6),
  ('emballages', 'Emballages', 'التغليف',   '📦', 7)
on conflict (key) do nothing;
