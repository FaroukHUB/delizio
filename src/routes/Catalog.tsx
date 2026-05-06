import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import AddTile from '../components/AddTile';
import QuantitySheet from '../components/QuantitySheet';
import { useCategories } from '../store/categories';
import { useProducts } from '../store/products';
import { useToday } from '../store/today';
import type { Product } from '../types';

export default function Catalog() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const categories = useCategories((s) => s.categories);
  const removeCategory = useCategories((s) => s.remove);
  const products = useProducts((s) => s.products);
  const addToToday = useToday((s) => s.add);

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return m;
  }, [products]);

  const matched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.name_ar ?? '').toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleConfirm = async (qty: number, unit: string, note: string) => {
    if (!selected) return;
    const name = selected.name;
    setSelected(null);
    await addToToday(selected.id, qty, { unit, note });
    setFlash(`✓ ${name} +${qty}${unit ? ' ' + unit : ''}`);
    setTimeout(() => setFlash(null), 1400);
  };

  const handleLongPressCategory = async (catId: string, count: number) => {
    if (count > 0) {
      alert(t('catalog.cantDeleteCategoryWithProducts'));
      return;
    }
    if (confirm(t('catalog.confirmDeleteCategory'))) {
      await removeCategory(catId);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 py-4">
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('catalog.search')}
          className="input"
        />
      </div>

      {search.trim() ? (
        <>
          <h2 className="text-lg font-bold mb-2 px-1">
            {matched.length} {matched.length > 1 ? 'résultats' : 'résultat'}
          </h2>
          {matched.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <div className="text-4xl mb-2">🔍</div>
              <p>{t('catalog.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {matched.map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              count={counts.get(c.key) ?? 0}
              onClick={() => navigate(`/catalog/${c.key}`)}
              onLongPress={() => handleLongPressCategory(c.id, counts.get(c.key) ?? 0)}
            />
          ))}
          <AddTile to="/catalog/new-category" label={t('catalog.addCategory')} />
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
