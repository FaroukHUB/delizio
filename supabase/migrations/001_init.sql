-- Delizio - Schéma initial
-- À exécuter dans le SQL Editor de Supabase (une seule fois)

-- 1. Tables -----------------------------------------------------------------

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  category text not null check (category in
    ('fromages','viandes','legumes','sauces','condiments','desserts','emballages')),
  photo_url text,
  unit text,
  created_at timestamptz not null default now()
);
create index if not exists products_category_idx on products(category);

create table if not exists today_items (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  qty numeric not null default 1 check (qty > 0),
  note text,
  created_at timestamptz not null default now()
);
create index if not exists today_items_product_idx on today_items(product_id);

create table if not exists history (
  id uuid primary key default gen_random_uuid(),
  sent_at timestamptz not null default now(),
  items jsonb not null,
  global_note text,
  contact_label text,
  contact_phone text
);
create index if not exists history_sent_at_idx on history(sent_at desc);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  phone text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  id int primary key default 1,
  logo_url text,
  language text not null default 'fr',
  constraint settings_singleton check (id = 1)
);
insert into settings (id) values (1) on conflict (id) do nothing;

-- 2. Trigger : un seul contact par défaut ----------------------------------

create or replace function ensure_single_default_contact()
returns trigger language plpgsql as $$
begin
  if new.is_default then
    update contacts set is_default = false where id <> new.id and is_default = true;
  end if;
  return new;
end;
$$;

drop trigger if exists contacts_single_default on contacts;
create trigger contacts_single_default
after insert or update of is_default on contacts
for each row when (new.is_default)
execute function ensure_single_default_contact();

-- 3. Realtime -------------------------------------------------------------

alter publication supabase_realtime add table today_items;

-- 4. RLS (V1 : outil interne, accès anon autorisé) -------------------------
-- ⚠️ V2 : ajouter une auth (Supabase Auth ou simple PIN code) avant prod publique.

alter table products     enable row level security;
alter table today_items  enable row level security;
alter table history      enable row level security;
alter table contacts     enable row level security;
alter table settings     enable row level security;

do $$
declare t text;
begin
  for t in select unnest(array['products','today_items','history','contacts','settings'])
  loop
    execute format('drop policy if exists "anon all" on %I', t);
    execute format('create policy "anon all" on %I for all using (true) with check (true)', t);
  end loop;
end $$;

-- 5. Seed produits ---------------------------------------------------------

insert into products (name, category) values
  ('Mozzarella','fromages'),('Boursin','fromages'),('Chèvre','fromages'),
  ('Raclette','fromages'),('Gruyère','fromages'),('Emmental','fromages'),
  ('Bleu','fromages'),('Cheddar','fromages'),('Comté','fromages'),
  ('Parmesan râpé','fromages'),('Parmesan copeaux','fromages'),('Burrata','fromages'),

  ('Filet de poulet','viandes'),('Jambon de dinde','viandes'),('Lardons fumés','viandes'),
  ('Boeuf haché','viandes'),('Merguez','viandes'),('Chorizo','viandes'),
  ('Thon','viandes'),('Saumon fumé','viandes'),

  ('Champignons','legumes'),('Pommes de terre','legumes'),('Oignons rouges','legumes'),
  ('Poivrons','legumes'),('Tomates cerises','legumes'),('Olives noires','legumes'),
  ('Roquette','legumes'),('Piments jalapeños','legumes'),('Salade','legumes'),
  ('Carottes','legumes'),('Maïs','legumes'),

  ('Sauce tomate','sauces'),('Crème fraîche','sauces'),('Crème Président','sauces'),
  ('Sauce curry','sauces'),('Sauce algérienne','sauces'),('Sauce thaï','sauces'),
  ('Sauce barbecue','sauces'),('Crème de truffe','sauces'),('Huile de truffe','sauces'),
  ('Crème balsamique','sauces'),('Miel','sauces'),

  ('Origan','condiments'),('Épices poulet','condiments'),('Sel','condiments'),
  ('Poivre','condiments'),('Sucre','condiments'),('Farine','condiments'),
  ('Semoule','condiments'),('Croûtons','condiments'),

  ('Crème tiramisu','desserts'),('Chantilly','desserts'),('Tarte Daim','desserts'),
  ('Oreo','desserts'),('Daim','desserts'),('Speculoos','desserts'),
  ('Galette bretonne','desserts'),('Coulis caramel','desserts'),

  ('Boîtes pizza 26 cm','emballages'),('Boîtes pizza 31 cm','emballages'),
  ('Boîtes pizza 40 cm','emballages'),('Sacs kraft','emballages'),
  ('Serviettes','emballages'),('Sopalin','emballages'),('Gants','emballages'),
  ('Papier cuisson','emballages'),('Film alimentaire','emballages'),
  ('Aluminium','emballages'),('Pots sauce','emballages'),('Barquettes','emballages')
on conflict do nothing;

-- 6. Contact WhatsApp par défaut ------------------------------------------

insert into contacts (label, phone, is_default)
values ('Principal', '+33646242099', true)
on conflict do nothing;

-- 7. Storage : à créer via UI Supabase ------------------------------------
-- Crée un bucket PUBLIC nommé "delizio" (Storage > New bucket > Public).
-- Aucune policy supplémentaire nécessaire pour un bucket public.
