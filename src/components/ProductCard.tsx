import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../types';

interface Props {
  product: Product;
  onClick: () => void;
  onLongPress?: () => void;
}

export default function ProductCard({ product, onClick, onLongPress }: Props) {
  const { i18n } = useTranslation();
  const name = i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name;
  const pressTimer = useRef<number | undefined>(undefined);
  const longPressed = useRef(false);

  const startPress = () => {
    if (!onLongPress) return;
    longPressed.current = false;
    pressTimer.current = window.setTimeout(() => {
      longPressed.current = true;
      onLongPress();
    }, 600);
  };
  const cancelPress = () => {
    if (pressTimer.current !== undefined) {
      clearTimeout(pressTimer.current);
      pressTimer.current = undefined;
    }
  };
  const handleClick = () => {
    if (longPressed.current) {
      longPressed.current = false;
      return;
    }
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      className="group relative flex flex-col bg-white rounded-2xl shadow-card overflow-hidden text-start active:scale-[0.97] transition focus:outline-none focus:ring-2 focus:ring-delizio-red"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {product.photo_url ? (
          <img
            src={product.photo_url}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-5xl opacity-50">🍕</span>
        )}
      </div>
      <div className="p-3">
        <div className="font-semibold text-base leading-tight line-clamp-2">{name}</div>
        {product.unit && (
          <div className="text-xs text-gray-500 mt-1">{product.unit}</div>
        )}
      </div>
    </button>
  );
}
