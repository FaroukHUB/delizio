import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import QuantitySheet from '../components/QuantitySheet';
import { useProducts } from '../store/products';
import { useToday } from '../store/today';
import { CATEGORIES, type CategoryKey, type Product } from '../types';

export default function Catalog() {
  const { t } = useTranslation();
  const products = useProducts((s) => s.products);
  const loading = useProducts((s) => s.loading);
  const removeProduct = useProducts((s) => s.remove);
  const addToToday = useToday((s) => s.add);
  const navigate = useNavigate();

  const [filter, setFilter] = useState<CategoryKey | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filter !== 'all' && p.category !== filter) return false;
      if (q && !(p.name.toLowerCase().includes(q) || (p.name_ar ?? '').toLowerCase().includes(q)))
        return false;
      return true;
    });
  }, [products, filter, search]);

  const grouped = useMemo(() => {
    const map = new Map<CategoryKey, Product[]>();
    CATEGORIES.forEach((c) => map.set(c.key, []));
    filtered.forEach((p) => map.get(p.category)?.push(p));
    return map;
  }, [filtered]);

  const handleConfirm = async (qty: number, note: string) => {
    if (!selected) return;
    const name = selected.name;
    setSelected(null);
    await addToToday(selected.id, qty, note);
    setFlash(`✓ ${name} +${qty}`);
    setTimeout(() => setFlash(null), 1400);
  };

  const handleLongPress = async (p: Product) => {
    if (confirm(t('addProduct.confirmDelete'))) {
      await removeProduct(p.id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 py-4">
      <div className="flex gap-2 mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('catalog.search')}
          className="input flex-1"
        />
        <Link to="/catalog/add" className="btn btn-primary btn-md whitespace-nowrap" aria-label={t('catalog.addProduct')}>
          ＋
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-3 px-3 scrollbar-none">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`chip whitespace-nowrap ${filter === 'all' ? 'chip-active' : ''}`}
        >
          {t('catalog.all')}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFilter(c.key)}
            className={`chip whitespace-nowrap ${filter === c.key ? 'chip-active' : ''}`}
          >
            <span className="me-1">{c.emoji}</span>
            {t(`categories.${c.key}`)}
          </button>
        ))}
      </div>

      {loading && <div className="text-center text-gray-500 py-10">{t('common.loading')}</div>}

      {CATEGORIES.map((cat) => {
        const list = grouped.get(cat.key) ?? [];
        if (filter !== 'all' && filter !== cat.key) return null;
        if (list.length === 0) return null;
        return (
          <section key={cat.key} className="mb-6">
            <h2 className="text-lg font-bold mb-2 px-1 flex items-center gap-2">
              <span>{cat.emoji}</span>
              {t(`categories.${cat.key}`)}
              <span className="text-sm text-gray-400 font-normal">({list.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {list.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={() => setSelected(p)}
                  onLongPress={() => handleLongPress(p)}
                />
              ))}
            </div>
          </section>
        );
      })}

      {!loading && filtered.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-2">🍕</div>
          <p>{t('catalog.empty')}</p>
          <button onClick={() => navigate('/catalog/add')} className="btn btn-primary btn-md mt-4">
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
