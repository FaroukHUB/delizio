import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHistory } from '../store/history';
import { useToday } from '../store/today';

export default function HistoryDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const entry = useHistory((s) => s.entries.find((e) => e.id === id));
  const fetch = useHistory((s) => s.fetch);
  const addToToday = useToday((s) => s.add);

  useEffect(() => {
    if (!entry) fetch();
  }, [entry, fetch]);

  if (!entry) {
    return <div className="max-w-3xl mx-auto px-4 py-8 text-center text-gray-500">{t('common.loading')}</div>;
  }

  const reuse = async () => {
    for (const it of entry.items) {
      await addToToday(it.product_id, it.qty, {
        unit: it.unit ?? undefined,
        note: it.note ?? undefined
      });
    }
    navigate('/today');
  };

  const fmt = new Date(entry.sent_at).toLocaleString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-3xl mx-auto px-3 py-4">
      <Link to="/history" className="text-sm text-gray-500 mb-2 inline-block">
        ← {t('history.back')}
      </Link>

      <div className="bg-white rounded-2xl shadow-card p-4 mb-4">
        <div className="font-bold">{fmt}</div>
        {entry.contact_label && (
          <div className="text-sm text-gray-500 mt-1">
            {t('history.sentTo')} : {entry.contact_label} ({entry.contact_phone})
          </div>
        )}
        {entry.global_note && (
          <div className="mt-2 text-sm bg-yellow-50 rounded-lg p-2">{entry.global_note}</div>
        )}
      </div>

      <ul className="space-y-2 mb-4">
        {entry.items.map((it, idx) => {
          const name = i18n.language === 'ar' && it.name_ar ? it.name_ar : it.name;
          return (
            <li key={idx} className="bg-white rounded-xl shadow-card p-3 flex items-center gap-3">
              <div className="flex-1">
                <div className="font-medium">{name}</div>
                {it.note && <div className="text-xs text-gray-500">{it.note}</div>}
              </div>
              <div className="font-bold text-delizio-red">×{it.qty}</div>
            </li>
          );
        })}
      </ul>

      <button onClick={reuse} className="btn btn-primary btn-lg w-full">
        ↻ {t('history.reuse')}
      </button>
    </div>
  );
}
