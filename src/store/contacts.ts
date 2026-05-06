import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Contact } from '../types';

interface ContactsState {
  contacts: Contact[];
  loading: boolean;
  fetch: () => Promise<void>;
  add: (label: string, phone: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
  getDefault: () => Contact | undefined;
}

export const useContacts = create<ContactsState>((set, get) => ({
  contacts: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error) set({ contacts: (data ?? []) as Contact[] });
    set({ loading: false });
  },

  add: async (label, phone) => {
    const isFirst = get().contacts.length === 0;
    const { error } = await supabase.from('contacts').insert({
      label: label.trim(),
      phone: phone.trim(),
      is_default: isFirst
    });
    if (error) throw error;
    await get().fetch();
  },

  remove: async (id) => {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) throw error;
    await get().fetch();
  },

  setDefault: async (id) => {
    const { error } = await supabase.from('contacts').update({ is_default: true }).eq('id', id);
    if (error) throw error;
    await get().fetch();
  },

  getDefault: () => {
    const list = get().contacts;
    return list.find((c) => c.is_default) ?? list[0];
  }
}));
