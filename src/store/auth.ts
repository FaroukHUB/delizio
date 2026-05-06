import { create } from 'zustand';

const STORAGE_KEY = 'delizio.auth.v1';

const USERNAME = (import.meta.env.VITE_AUTH_USER as string | undefined) || 'Delizio';
const PASSWORD = (import.meta.env.VITE_AUTH_PASS as string | undefined) || 'kls2026!';

interface AuthState {
  isAuthed: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const initial = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1';

export const useAuth = create<AuthState>((set) => ({
  isAuthed: initial,

  login: (user, pass) => {
    if (user.trim() === USERNAME && pass === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1');
      set({ isAuthed: true });
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ isAuthed: false });
  }
}));
