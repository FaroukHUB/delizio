import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import AddTile from '../components/AddTile';
import QuantitySheet from '../components/QuantitySheet';
import { useCategories } from '../store/categories';
import { useProducts } from '../store/products';
import { useToday } from '../store/today';
import type { Product } from '../types';

export default function CategoryDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { key } = useParams<{ key: string }>();

  const category = useCategories((s) => s.byKey(key ?? ''));
  const products = useProducts((s) => s.products);
  const removeProduct = useProducts((s) => s.remove);
  const addToToday = useToday((s) => s.add);

  const [selected, setSelected] = useState<Product | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const list = useMemo(
    () => products.filter((p) => p.category === key),
    [products, key]
  );

  const handleConfirm = async (qty: number, unit: string, note: string) => {
    if (!selected) return;
    const name = selected.name;
    setSelected(null);
    try {
      await addToToday(selected.id, qty, { unit, note });
      setFlash(`✓ ${name} +${qty}${unit ? ' ' + unit : ''}`);
    } catch (err) {
      setFlash(`⚠️ ${err instanceof Error ? err.message : 'Erreur ajout'}`);
    }
    setTimeout(() => setFlash(null), 2200);
  };

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/catalog" className="text-sm text-gray-500">← {t('history.back')}</Link>
        <p className="text-center text-gray-500 mt-8">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 py-4">
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-gray-500 mb-3">
        ← {t('history.back')}
      </Link>

      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="w-14 h-14 rounded-2xl bg-delizio-red flex items-center justify-center text-3xl shrink-0">
          {category.photo_url ? (
            <img src={category.photo_url} alt="" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span>{category.emoji}</span>
          )}
        </div>
        <div className="leading-tight">
          <h1 className="text-2xl font-bold">{category.name_fr}</h1>
          {category.name_ar && (
            <div className="text-base text-gray-500 font-arabic" dir="rtl">
              {category.name_ar}
            </div>
          )}
        </div>
        <div className="ms-auto text-sm text-gray-500">
          {list.length} {list.length > 1 ? 'produits' : 'produit'}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {list.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onClick={() => setSelected(p)}
            onLongPress={async () => {
              if (confirm(t('addProduct.confirmDelete'))) {
                await removeProduct(p.id);
              }
            }}
          />
        ))}
        <AddTile
          to={`/catalog/${category.key}/add-product`}
          label={t('catalog.addProduct')}
        />
      </div>

      {list.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-2">{category.emoji}</div>
          <p>{t('catalog.empty')}</p>
          <button
            onClick={() => navigate(`/catalog/${category.key}/add-product`)}
            className="btn btn-primary btn-md mt-4"
          >
            ＋ {t('catalog.addProduct')}
          </button>
        </div>
      )}

      <QuantitySheet product={selected} onClose={() => setSelected(null)} onConfirm={handleConfirm} />

      {flash && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-delizio-black text-white px-5 py-3 rounded-full shadow-lg z-50 font-semibold">
          {flash}
        </div>
      )}
    </div>
  );
}
