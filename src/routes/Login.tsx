import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/auth';
import { setLanguage } from '../lib/i18n';

export default function Login() {
  const { t, i18n } = useTranslation();
  const login = useAuth((s) => s.login);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(user, pass)) {
      setErr(true);
      setPass('');
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-delizio-black text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        <div className="w-24 h-24 rounded-full bg-delizio-red flex items-center justify-center text-5xl font-black mb-5 shadow-lg">
          D
        </div>
        <h1 className="text-3xl font-black tracking-tight">{t('app.title')}</h1>
        <p className="text-white/60 mb-8">{t('app.subtitle')}</p>

        <form onSubmit={submit} className="w-full space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-white/80">{t('login.username')}</span>
            <input
              autoFocus
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
                setErr(false);
              }}
              autoComplete="username"
              className="input mt-1 bg-white text-delizio-black"
              placeholder="Delizio"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white/80">{t('login.password')}</span>
            <input
              type="password"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setErr(false);
              }}
              autoComplete="current-password"
              className="input mt-1 bg-white text-delizio-black"
              placeholder="••••••••"
            />
          </label>

          {err && (
            <div className="text-sm text-white bg-delizio-red rounded-lg p-3 text-center font-medium">
              {t('login.error')}
            </div>
          )}

          <button
            type="submit"
            disabled={!user.trim() || !pass}
            className="btn btn-primary btn-lg w-full mt-4"
          >
            {t('login.submit')}
          </button>
        </form>

        <div className="mt-8 flex gap-2 text-xs">
          <button
            onClick={() => setLanguage('fr')}
            className={`px-3 py-1 rounded-full ${i18n.language === 'fr' ? 'bg-white/20' : 'text-white/50'}`}
          >
            🇫🇷 Français
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`px-3 py-1 rounded-full ${i18n.language === 'ar' ? 'bg-white/20' : 'text-white/50'}`}
          >
            🇲🇦 العربية
          </button>
        </div>
      </div>
    </div>
  );
}
