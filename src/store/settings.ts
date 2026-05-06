import { create } from 'zustand';
import { supabase, STORAGE_BUCKET } from '../lib/supabase';
import { compressImage } from '../lib/image';

interface SettingsState {
  logo_url: string | null;
  loading: boolean;
  fetch: () => Promise<void>;
  uploadLogo: (file: File) => Promise<void>;
  removeLogo: () => Promise<void>;
}

export const useSettings = create<SettingsState>((set) => ({
  logo_url: null,
  loading: false,

  fetch: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (!error && data) set({ logo_url: data.logo_url });
    set({ loading: false });
  },

  uploadLogo: async (file) => {
    const blob = await compressImage(file, 512, 0.9);
    const path = `logo/logo-${Date.now()}.jpg`;
    const { error: upErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, blob, { contentType: 'image/jpeg', upsert: true });
    if (upErr) throw upErr;
    const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

    const { error } = await supabase
      .from('settings')
      .update({ logo_url: pub.publicUrl })
      .eq('id', 1);
    if (error) throw error;
    set({ logo_url: pub.publicUrl });
  },

  removeLogo: async () => {
    const { error } = await supabase.from('settings').update({ logo_url: null }).eq('id', 1);
    if (error) throw error;
    set({ logo_url: null });
  }
}));
