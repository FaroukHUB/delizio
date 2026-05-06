import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anon) {
  // eslint-disable-next-line no-console
  console.error(
    'Supabase non configuré. Crée un fichier .env.local avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(url ?? '', anon ?? '', {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 5 } }
});

export const STORAGE_BUCKET = 'Delizio';
