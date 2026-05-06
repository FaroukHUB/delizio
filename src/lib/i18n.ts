import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from '../locales/fr.json';
import ar from '../locales/ar.json';

const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('delizio.lang')) || 'fr';

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    ar: { translation: ar }
  },
  lng: saved,
  fallbackLng: 'fr',
  interpolation: { escapeValue: false }
});

applyDir(saved as 'fr' | 'ar');

export function setLanguage(lang: 'fr' | 'ar') {
  i18n.changeLanguage(lang);
  localStorage.setItem('delizio.lang', lang);
  applyDir(lang);
}

function applyDir(lang: 'fr' | 'ar') {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

export default i18n;
