-- Delizio - Migration 003 : autoriser les uploads dans le bucket Storage 'Delizio'
-- À exécuter dans le SQL Editor de Supabase APRÈS 002_categories.sql
--
-- Pourquoi : un bucket "Public" autorise la LECTURE publique, mais les
-- INSERT/UPDATE/DELETE sur storage.objects exigent une policy explicite.
-- Sans ça, l'app reçoit "new row violates row-level security policy" à
-- chaque upload de photo (produit, catégorie, logo).

drop policy if exists "anon manage Delizio bucket" on storage.objects;

create policy "anon manage Delizio bucket"
on storage.objects
for all
to anon, authenticated
using (bucket_id = 'Delizio')
with check (bucket_id = 'Delizio');
