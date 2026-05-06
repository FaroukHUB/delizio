import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { TodayItem, Product } from '../types';

interface TodayState {
  items: TodayItem[];
  loading: boolean;
  globalNote: string;
  channel: ReturnType<typeof supabase.channel> | null;

  fetch: () => Promise<void>;
  subscribe: () => void;
  unsubscribe: () => void;

  add: (productId: string, qty: number, opts?: { unit?: string; note?: string }) => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
  updateUnit: (id: string, unit: string) => Promise<void>;
  updateNote: (id: string, note: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  setGlobalNote: (n: string) => void;
  archiveAndClear: (contact?: { label: string; phone: string }) => Promise<void>;
}

const TODAY_SELECT = '*, product:products(*)';

export const useToday = create<TodayState>((set, get) => ({
  items: [],
  loading: false,
  globalNote: '',
  channel: null,

  fetch: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('today_items')
      .select(TODAY_SELECT)
      .order('created_at', { ascending: true });
    if (!error) set({ items: (data ?? []) as TodayItem[] });
    set({ loading: false });
  },

  subscribe: () => {
    if (get().channel) return;
    const channel = supabase
      .channel('today_items_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'today_items' },
        () => {
          // any change → refetch (simplest correct behavior)
          get().fetch();
        }
      )
      .subscribe();
    set({ channel });
  },

  unsubscribe: () => {
    const ch = get().channel;
    if (ch) {
      supabase.removeChannel(ch);
      set({ channel: null });
    }
  },

  add: async (productId, qty, opts) => {
    const note = opts?.note;
    const unit = opts?.unit;
    // si même produit + même unité déjà présent, on incrémente plutôt que doublon
    const existing = get().items.find(
      (it) => it.product_id === productId && (it.unit ?? null) === (unit ?? null)
    );
    if (existing) {
      await get().updateQty(existing.id, existing.qty + qty);
      if (note) await get().updateNote(existing.id, note);
      return;
    }
    const { error } = await supabase
      .from('today_items')
      .insert({ product_id: productId, qty, unit: unit || null, note: note || null });
    if (error) throw error;
    await get().fetch();
  },

  updateQty: async (id, qty) => {
    if (qty <= 0) return get().remove(id);
    const { error } = await supabase.from('today_items').update({ qty }).eq('id', id);
    if (error) throw error;
    set({ items: get().items.map((it) => (it.id === id ? { ...it, qty } : it)) });
  },

  updateUnit: async (id, unit) => {
    const { error } = await supabase
      .from('today_items')
      .update({ unit: unit || null })
      .eq('id', id);
    if (error) throw error;
    set({ items: get().items.map((it) => (it.id === id ? { ...it, unit } : it)) });
  },

  updateNote: async (id, note) => {
    const { error } = await supabase
      .from('today_items')
      .update({ note: note || null })
      .eq('id', id);
    if (error) throw error;
    set({ items: get().items.map((it) => (it.id === id ? { ...it, note } : it)) });
  },

  remove: async (id) => {
    const { error } = await supabase.from('today_items').delete().eq('id', id);
    if (error) throw error;
    set({ items: get().items.filter((it) => it.id !== id) });
  },

  clear: async () => {
    const { error } = await supabase.from('today_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
    set({ items: [], globalNote: '' });
  },

  setGlobalNote: (n) => set({ globalNote: n }),

  archiveAndClear: async (contact) => {
    const items = get().items;
    if (items.length === 0) return;

    const snapshot = items.map((it) => ({
      product_id: it.product_id,
      name: (it.product as Product | undefined)?.name ?? '',
      name_ar: (it.product as Product | undefined)?.name_ar ?? null,
      qty: it.qty,
      unit: it.unit,
      note: it.note
    }));

    const { error } = await supabase.from('history').insert({
      items: snapshot,
      global_note: get().globalNote || null,
      contact_label: contact?.label ?? null,
      contact_phone: contact?.phone ?? null
    });
    if (error) throw error;

    await get().clear();
  }
}));
