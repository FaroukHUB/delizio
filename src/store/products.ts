import { create } from 'zustand';
import { supabase, STORAGE_BUCKET } from '../lib/supabase';
import { compressImage, slugify } from '../lib/image';
import type { Product, CategoryKey } from '../types';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  add: (data: {
    name: string;
    name_ar?: string;
    category: CategoryKey;
    unit?: string;
    photoFile?: File | null;
  }) => Promise<Product>;
  remove: (id: string) => Promise<void>;
  updatePhoto: (id: string, file: File) => Promise<void>;
}

export const useProducts = create<ProductsState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    if (error) {
      set({ error: error.message, loading: false });
      return;
    }
    set({ products: (data ?? []) as Product[], loading: false });
  },

  add: async ({ name, name_ar, category, unit, photoFile }) => {
    let photo_url: string | null = null;
    if (photoFile) {
      const blob = await compressImage(photoFile);
      const path = `products/${slugify(name)}-${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, blob, { contentType: 'image/jpeg', upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      photo_url = pub.publicUrl;
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: name.trim(),
        name_ar: name_ar?.trim() || null,
        category,
        unit: unit?.trim() || null,
        photo_url
      })
      .select()
      .single();
    if (error) throw error;

    set({ products: [...get().products, data as Product].sort((a, b) => a.name.localeCompare(b.name)) });
    return data as Product;
  },

  remove: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    set({ products: get().products.filter((p) => p.id !== id) });
  },

  updatePhoto: async (id, file) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;
    const blob = await compressImage(file);
    const path = `products/${slugify(product.name)}-${Date.now()}.jpg`;
    const { error: upErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, blob, { contentType: 'image/jpeg', upsert: true });
    if (upErr) throw upErr;
    const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

    const { error } = await supabase
      .from('products')
      .update({ photo_url: pub.publicUrl })
      .eq('id', id);
    if (error) throw error;

    set({
      products: get().products.map((p) =>
        p.id === id ? { ...p, photo_url: pub.publicUrl } : p
      )
    });
  }
}));
