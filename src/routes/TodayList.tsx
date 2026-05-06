import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToday } from '../store/today';
import { useContacts } from '../store/contacts';
import { useHistory } from '../store/history';
import { buildWhatsAppMessage, buildWhatsAppLink, DELIVERY_DAYS, type DeliveryDay } from '../lib/whatsapp';
import type { Contact } from '../types';

export default function TodayList() {
  const { t, i18n } = useTranslation();
  const items = useToday((s) => s.items);
  const updateQty = useToday((s) => s.updateQty);
  const remove = useToday((s) => s.remove);
  const clear = useToday((s) => s.clear);
  const globalNote = useToday((s) => s.globalNote);
  const setGlobalNote = useToday((s) => s.setGlobalNote);
  const archiveAndClear = useToday((s) => s.archiveAndClear);

  const contacts = useContacts((s) => s.contacts);
  const getDefault = useContacts((s) => s.getDefault);
  const refreshHistory = useHistory((s) => s.fetch);

  const [contactId, setContactId] = useState<string | null>(null);
  const [deliveryDay, setDeliveryDay] = useState<DeliveryDay>('now');

  const selectedContact: Contact | undefined = useMemo(() => {
    if (contactId) return contacts.find((c) => c.id === contactId);
    return getDefault();
  }, [contactId, contacts, getDefault]);

  const handleSend = async () => {
    if (items.length === 0 || !selectedContact) return;
    const msg = buildWhatsAppMessage({ items, globalNote, lang: i18n.language as 'fr' | 'ar', deliveryDay });
    const link = buildWhatsAppLink(selectedContact, msg);
    window.open(link, '_blank');
    await archiveAndClear({ label: selectedContact.label, phone: selectedContact.phone });
    await refreshHistory();
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-500">
        <div className="text-5xl mb-3">🛒</div>
        <h2 className="text-xl font-bold text-delizio-black mb-1">{t('today.empty')}</h2>
        <p className="text-sm">{t('today.emptyHint')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 py-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <h1 className="text-2xl font-bold">{t('today.title')}</h1>
        <span className="text-sm text-gray-500">
          {t('today.items', { count: items.length })}
        </span>
      </div>

      <ul className="space-y-2 mb-4">
        {items.map((it) => (
            <li
              key={it.id}
              className="bg-white rounded-2xl shadow-card p-3 flex items-center gap-3"
            >
              {it.product?.photo_url ? (
                <img src={it.product.photo_url} alt="" className="w-14 h-14 rounded-xl object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                  🍕
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold leading-tight truncate">{it.product?.name ?? ''}</div>
                {it.product?.name_ar && (
                  <div className="text-xs text-gray-500 font-arabic truncate" dir="rtl">{it.product.name_ar}</div>
                )}
                {it.note && <div className="text-xs text-gray-500 truncate">{it.note}</div>}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQty(it.id, it.qty - 1)}
                  className="w-10 h-10 rounded-full bg-gray-100 text-xl font-bold active:scale-90"
                >
                  −
                </button>
                <div className="w-14 text-center font-bold text-base leading-tight">
                  <div>{it.qty}</div>
                  {it.unit && <div className="text-[10px] text-gray-400 font-normal">{it.unit}</div>}
                </div>
                <button
                  onClick={() => updateQty(it.id, it.qty + 1)}
                  className="w-10 h-10 rounded-full bg-delizio-red text-white text-xl font-bold active:scale-90"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => remove(it.id)}
                aria-label={t('today.remove')}
                className="text-gray-400 hover:text-delizio-red text-xl px-1"
              >
                ✕
              </button>
            </li>
          ))}
      </ul>

      <textarea
        value={globalNote}
        onChange={(e) => setGlobalNote(e.target.value)}
        placeholder={t('today.globalNote')}
        rows={2}
        className="input mb-3 resize-none"
      />

      <div className="mb-3">
        <div className="text-sm font-medium text-gray-600 mb-2 px-1">{t('today.deliveryFor')}</div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3">
          {DELIVERY_DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDeliveryDay(d)}
              className={`chip whitespace-nowrap ${deliveryDay === d ? 'chip-active' : ''}`}
            >
              {t(`today.day.${d}`)}
            </button>
          ))}
        </div>
      </div>

      {contacts.length > 1 && (
        <div className="mb-3">
          <div className="text-sm font-medium text-gray-600 mb-2 px-1">{t('today.chooseContact')}</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setContactId(c.id)}
                className={`chip whitespace-nowrap ${
                  (selectedContact?.id ?? null) === c.id ? 'chip-active' : ''
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleSend}
        disabled={!selectedContact}
        className="btn btn-primary btn-lg w-full mb-2"
      >
        📤 {t('today.send')}
        {selectedContact && <span className="opacity-70 ms-2 text-sm font-normal">→ {selectedContact.label}</span>}
      </button>

      <button
        type="button"
        onClick={() => {
          if (confirm(t('today.confirmClear'))) clear();
        }}
        className="btn btn-ghost btn-md w-full text-gray-500"
      >
        🗑️ {t('today.clear')}
      </button>
    </div>
  );
}
