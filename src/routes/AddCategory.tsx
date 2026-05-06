import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PhotoPicker from '../components/PhotoPicker';
import { useCategories } from '../store/categories';

const EMOJI_CHOICES = ['🍕','🧀','🍖','🥬','🥫','🧂','🍰','📦','🥤','🍞','🐟','🌶️','🥚','🫒','🍫','🥜','🍯','🌿','🥗'];

export default function AddCategory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const add = useCategories((s) => s.add);

  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [emoji, setEmoji] = useState('🍕');
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const c = await add({
        name_fr: name.trim(),
        name_ar: nameAr.trim() || undefined,
        emoji,
        photoFile: photo
      });
      navigate(`/catalog/${c.key}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-3xl mx-auto px-4 py-4 space-y-4">
      <h1 className="text-2xl font-bold">{t('addCategory.title')}</h1>

      <PhotoPicker onChange={setPhoto} />

      <div>
        <span className="text-sm font-medium text-gray-700">{t('addCategory.emoji')}</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {EMOJI_CHOICES.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`text-2xl w-12 h-12 rounded-xl border-2 transition ${
                emoji === e ? 'border-delizio-red bg-delizio-red/10' : 'border-gray-200 bg-white'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">{t('addCategory.name')} *</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input mt-1"
          placeholder="Boissons…"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">{t('addCategory.nameAr')}</span>
        <input
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          className="input mt-1"
          dir="rtl"
          placeholder="المشروبات…"
        />
      </label>

      {error && <div className="text-sm text-delizio-red bg-red-50 rounded-lg p-3">{error}</div>}

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-lg flex-1"
        >
          {t('common.cancel')}
        </button>
        <button type="submit" disabled={saving || !name.trim()} className="btn btn-primary btn-lg flex-1">
          {saving ? '…' : t('addCategory.save')}
        </button>
      </div>
    </form>
  );
}
