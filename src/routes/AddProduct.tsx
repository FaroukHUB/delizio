import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PhotoPicker from '../components/PhotoPicker';
import { useProducts } from '../store/products';
import { CATEGORIES, type CategoryKey } from '../types';

export default function AddProduct() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const add = useProducts((s) => s.add);

  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [category, setCategory] = useState<CategoryKey>('fromages');
  const [unit, setUnit] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await add({
        name: name.trim(),
        name_ar: nameAr.trim() || undefined,
        category,
        unit: unit.trim() || undefined,
        photoFile: photo
      });
      navigate('/catalog');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-3xl mx-auto px-4 py-4 space-y-4">
      <h1 className="text-2xl font-bold">{t('addProduct.title')}</h1>

      <PhotoPicker onChange={setPhoto} />

      <label className="block">
        <span className="text-sm font-medium text-gray-700">{t('addProduct.name')} *</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input mt-1"
          placeholder="Mozzarella…"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">{t('addProduct.nameAr')}</span>
        <input
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          className="input mt-1"
          dir="rtl"
          placeholder="موزاريلا…"
        />
      </label>

      <div>
        <span className="text-sm font-medium text-gray-700">{t('addProduct.category')}</span>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-1">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`chip flex-col gap-0 py-3 ${category === c.key ? 'chip-active' : ''}`}
            >
              <span className="text-xl">{c.emoji}</span>
              <span className="text-xs">{t(`categories.${c.key}`)}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">{t('addProduct.unit')}</span>
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="input mt-1"
          placeholder="kg, L, pièce…"
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
          {saving ? '…' : t('addProduct.save')}
        </button>
      </div>
    </form>
  );
}
