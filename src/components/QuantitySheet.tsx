import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../types';

interface Props {
  product: Product | null;
  onClose: () => void;
  onConfirm: (qty: number, note: string) => void;
}

const QUICK = [1, 2, 5];

export default function QuantitySheet({ product, onClose, onConfirm }: Props) {
  const { t } = useTranslation();
  const [qty, setQty] = useState<number | ''>(1);
  const [note, setNote] = useState('');
  const [custom, setCustom] = useState(false);

  useEffect(() => {
    if (product) {
      setQty(1);
      setNote('');
      setCustom(false);
    }
  }, [product]);

  if (!product) return null;

  const submit = () => {
    const final = typeof qty === 'number' ? qty : parseFloat(String(qty));
    if (!final || final <= 0) return;
    onConfirm(final, note.trim());
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white rounded-t-3xl p-6 pb-8 shadow-2xl animate-[slideUp_.2s_ease-out]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        <div className="flex items-center gap-3 mb-5">
          {product.photo_url ? (
            <img src={product.photo_url} alt={product.name} className="w-14 h-14 rounded-xl object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">🍕</div>
          )}
          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase">{t('qty.title')}</div>
            <div className="text-xl font-bold leading-tight">{product.name}</div>
            {product.name_ar && (
              <div className="text-sm text-gray-500 font-arabic" dir="rtl">{product.name_ar}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {QUICK.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setQty(n);
                setCustom(false);
              }}
              className={`btn btn-lg ${qty === n && !custom ? 'btn-primary' : 'btn-ghost'}`}
            >
              +{n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCustom(true)}
            className={`btn btn-lg ${custom ? 'btn-primary' : 'btn-ghost'}`}
          >
            {t('qty.custom')}
          </button>
        </div>

        {custom && (
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.5}
            autoFocus
            value={qty}
            onChange={(e) => setQty(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="input mb-3"
            placeholder="ex: 3.5"
          />
        )}

        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('qty.note')}
          className="input mb-5"
        />

        <button type="button" onClick={submit} className="btn btn-primary btn-lg w-full">
          {t('qty.add')}
        </button>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}
