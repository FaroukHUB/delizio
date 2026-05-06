import { create } from 'zustand';
import { supabase, STORAGE_BUCKET } from '../lib/supabase';
import { compressImage, slugify } from '../lib/image';
import type { Category } from '../types';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  add: (data: {
    name_fr: string;
    name_ar?: string;
    emoji?: string;
    photoFile?: File | null;
  }) => Promise<Category>;
  remove: (id: string) => Promise<void>;
  updatePhoto: (id: string, file: File) => Promise<void>;
  byKey: (key: string) => Category | undefined;
}

export const useCategories = create<CategoriesState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) {
      set({ error: error.message, loading: false });
      return;
    }
    set({ categories: (data ?? []) as Category[], loading: false });
  },

  add: async ({ name_fr, name_ar, emoji, photoFile }) => {
    const baseKey = slugify(name_fr) || `cat-${Date.now()}`;
    let key = baseKey;
    let suffix = 2;
    while (get().categories.some((c) => c.key === key)) {
      key = `${baseKey}-${suffix++}`;
    }

    let photo_url: string | null = null;
    if (photoFile) {
      const blob = await compressImage(photoFile);
      const path = `categories/${key}-${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, blob, { contentType: 'image/jpeg', upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      photo_url = pub.publicUrl;
    }

    const nextPos = get().categories.reduce((m, c) => Math.max(m, c.position), 0) + 1;

    const { data, error } = await supabase
      .from('categories')
      .insert({
        key,
        name_fr: name_fr.trim(),
        name_ar: name_ar?.trim() || null,
        emoji: emoji?.trim() || '🍕',
        photo_url,
        position: nextPos
      })
      .select()
      .single();
    if (error) throw error;

    set({ categories: [...get().categories, data as Category] });
    return data as Category;
  },

  remove: async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    set({ categories: get().categories.filter((c) => c.id !== id) });
  },

  updatePhoto: async (id, file) => {
    const cat = get().categories.find((c) => c.id === id);
    if (!cat) return;
    const blob = await compressImage(file);
    const path = `categories/${cat.key}-${Date.now()}.jpg`;
    const { error: upErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, blob, { contentType: 'image/jpeg', upsert: true });
    if (upErr) throw upErr;
    const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

    const { error } = await supabase
      .from('categories')
      .update({ photo_url: pub.publicUrl })
      .eq('id', id);
    if (error) throw error;

    set({
      categories: get().categories.map((c) =>
        c.id === id ? { ...c, photo_url: pub.publicUrl } : c
      )
    });
  },

  byKey: (key) => get().categories.find((c) => c.key === key)
}));
