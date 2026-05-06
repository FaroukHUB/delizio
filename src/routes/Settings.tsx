import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContacts } from '../store/contacts';
import { useSettings } from '../store/settings';
import { setLanguage } from '../lib/i18n';

export default function Settings() {
  const { t, i18n } = useTranslation();

  const contacts = useContacts((s) => s.contacts);
  const addContact = useContacts((s) => s.add);
  const removeContact = useContacts((s) => s.remove);
  const setDefault = useContacts((s) => s.setDefault);

  const logoUrl = useSettings((s) => s.logo_url);
  const uploadLogo = useSettings((s) => s.uploadLogo);
  const removeLogo = useSettings((s) => s.removeLogo);

  const logoInput = useRef<HTMLInputElement>(null);

  const [label, setLabel] = useState('');
  const [phone, setPhone] = useState('');
  const [adding, setAdding] = useState(false);

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !phone.trim()) return;
    setAdding(true);
    try {
      await addContact(label, phone);
      setLabel('');
      setPhone('');
    } finally {
      setAdding(false);
    }
  };

  const onLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) await uploadLogo(f);
    e.target.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-6">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>

      {/* Logo */}
      <section className="bg-white rounded-2xl shadow-card p-4">
        <h2 className="font-bold mb-3">{t('settings.logo')}</h2>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl opacity-40">🍕</span>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => logoInput.current?.click()}
              className="btn btn-ghost btn-md"
            >
              📷 {t('settings.logoUpload')}
            </button>
            {logoUrl && (
              <button onClick={removeLogo} className="btn btn-danger btn-md">
                {t('common.delete')}
              </button>
            )}
          </div>
          <input
            ref={logoInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onLogoChange}
          />
        </div>
      </section>

      {/* Langue */}
      <section className="bg-white rounded-2xl shadow-card p-4">
        <h2 className="font-bold mb-3">{t('settings.language')}</h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setLanguage('fr')}
            className={`btn btn-md ${i18n.language === 'fr' ? 'btn-primary' : 'btn-ghost'}`}
          >
            🇫🇷 Français
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ar')}
            className={`btn btn-md ${i18n.language === 'ar' ? 'btn-primary' : 'btn-ghost'}`}
          >
            🇲🇦 العربية
          </button>
        </div>
      </section>

      {/* Contacts WhatsApp */}
      <section className="bg-white rounded-2xl shadow-card p-4">
        <h2 className="font-bold mb-3">{t('settings.contacts')}</h2>

        <ul className="space-y-2 mb-4">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-2 border border-gray-100 rounded-xl p-3"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold flex items-center gap-2">
                  {c.label}
                  {c.is_default && (
                    <span className="text-[10px] uppercase font-bold bg-delizio-red text-white px-2 py-0.5 rounded-full">
                      {t('settings.default')}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500" dir="ltr">
                  {c.phone}
                </div>
              </div>
              {!c.is_default && (
                <button
                  onClick={() => setDefault(c.id)}
                  className="text-xs text-gray-600 underline px-2"
                >
                  {t('settings.setDefault')}
                </button>
              )}
              <button
                onClick={() => removeContact(c.id)}
                className="text-gray-400 hover:text-delizio-red px-2 text-lg"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={submitContact} className="space-y-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={t('settings.contactLabel')}
            className="input"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('settings.contactPhone')}
            inputMode="tel"
            dir="ltr"
            className="input"
          />
          <button
            type="submit"
            disabled={adding || !label.trim() || !phone.trim()}
            className="btn btn-primary btn-md w-full"
          >
            ＋ {t('settings.addContact')}
          </button>
        </form>
      </section>
    </div>
  );
}
