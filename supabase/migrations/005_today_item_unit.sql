-- Delizio - Migration 005 : unité par ligne dans la liste du jour
-- À exécuter dans le SQL Editor APRÈS 004_arabic_seed.sql

alter table today_items add column if not exists unit text;
