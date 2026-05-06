import { useRef } from 'react';
import type { Product } from '../types';
import PhotoEditButton from './PhotoEditButton';
import { useProducts } from '../store/products';

interface Props {
  product: Product;
  onClick: () => void;
  onLongPress?: () => void;
}

export default function ProductCard({ product, onClick, onLongPress }: Props) {
  const updatePhoto = useProducts((s) => s.updatePhoto);
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
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === 'Enter' ? onClick() : undefined)}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      className="group relative flex flex-col bg-white rounded-2xl shadow-card overflow-hidden text-start cursor-pointer active:scale-[0.97] transition focus:outline-none focus:ring-2 focus:ring-delizio-red"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
        {product.photo_url ? (
          <img
            src={product.photo_url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-5xl opacity-50">🍕</span>
        )}
        <PhotoEditButton onUpload={(file) => updatePhoto(product.id, file)} />
      </div>
      <div className="p-3 text-center">
        <div className="font-bold text-base leading-tight line-clamp-2">{product.name}</div>
        {product.name_ar && (
          <div className="text-sm text-gray-500 mt-0.5 font-arabic line-clamp-1" dir="rtl">
            {product.name_ar}
          </div>
        )}
        {product.unit && (
          <div className="text-xs text-gray-400 mt-1">{product.unit}</div>
        )}
      </div>
    </div>
  );
}
