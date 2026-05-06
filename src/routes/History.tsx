import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHistory } from '../store/history';

export default function History() {
  const { t, i18n } = useTranslation();
  const entries = useHistory((s) => s.entries);
  const loading = useHistory((s) => s.loading);
  const fetch = useHistory((s) => s.fetch);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  return (
    <div className="max-w-3xl mx-auto px-3 py-4">
      <h1 className="text-2xl font-bold mb-3 px-1">{t('history.title')}</h1>

      {loading && <div className="text-center text-gray-500 py-8">{t('common.loading')}</div>}

      {!loading && entries.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-2">📜</div>
          <p>{t('history.empty')}</p>
        </div>
      )}

      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.id}>
            <Link
              to={`/history/${e.id}`}
              className="block bg-white rounded-2xl shadow-card p-4 active:scale-[0.99]"
            >
              <div className="flex items-baseline justify-between mb-1">
                <div className="font-semibold">{fmtDate(e.sent_at)}</div>
                <div className="text-sm text-gray-500">{e.items.length} ×</div>
              </div>
              {e.contact_label && (
                <div className="text-xs text-gray-500">
                  {t('history.sentTo')} : <span className="font-medium">{e.contact_label}</span>
                </div>
              )}
              <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                {e.items.map((i) => i.name).join(', ')}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
