export type CategoryKey =
  | 'fromages'
  | 'viandes'
  | 'legumes'
  | 'sauces'
  | 'condiments'
  | 'desserts'
  | 'emballages';

export const CATEGORIES: { key: CategoryKey; emoji: string }[] = [
  { key: 'fromages', emoji: '🧀' },
  { key: 'viandes', emoji: '🍖' },
  { key: 'legumes', emoji: '🥬' },
  { key: 'sauces', emoji: '🥫' },
  { key: 'condiments', emoji: '🧂' },
  { key: 'desserts', emoji: '🍰' },
  { key: 'emballages', emoji: '📦' }
];

export interface Product {
  id: string;
  name: string;
  name_ar: string | null;
  category: CategoryKey;
  photo_url: string | null;
  unit: string | null;
  created_at: string;
}

export interface TodayItem {
  id: string;
  product_id: string;
  qty: number;
  note: string | null;
  created_at: string;
  product?: Product;
}

export interface HistoryEntry {
  id: string;
  sent_at: string;
  items: { product_id: string; name: string; name_ar: string | null; qty: number; note: string | null }[];
  global_note: string | null;
  contact_label: string | null;
  contact_phone: string | null;
}

export interface Contact {
  id: string;
  label: string;
  phone: string;
  is_default: boolean;
}

export interface AppSettings {
  id: string;
  logo_url: string | null;
  language: 'fr' | 'ar';
}
