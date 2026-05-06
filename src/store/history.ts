import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { HistoryEntry } from '../types';

interface HistoryState {
  entries: HistoryEntry[];
  loading: boolean;
  fetch: () => Promise<void>;
  getById: (id: string) => HistoryEntry | undefined;
}

export const useHistory = create<HistoryState>((set, get) => ({
  entries: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(200);
    if (!error) set({ entries: (data ?? []) as HistoryEntry[] });
    set({ loading: false });
  },

  getById: (id) => get().entries.find((e) => e.id === id)
}));
