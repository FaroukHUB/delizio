import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../store/settings';

export default function Header() {
  const { t } = useTranslation();
  const logo = useSettings((s) => s.logo_url);

  return (
    <header className="sticky top-0 z-30 bg-delizio-black text-white shadow-md">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/catalog" className="flex items-center gap-3 flex-1">
          {logo ? (
            <img src={logo} alt="Logo" className="h-10 w-10 rounded-full object-cover bg-white" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-delizio-red flex items-center justify-center text-lg font-bold">
              D
            </div>
          )}
          <div className="leading-tight">
            <div className="text-lg font-bold">{t('app.title')}</div>
            <div className="text-xs text-white/70">{t('app.subtitle')}</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
