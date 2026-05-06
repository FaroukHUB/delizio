import { useRef } from 'react';
import type { Category } from '../types';

interface Props {
  category: Category;
  count?: number;
  onClick: () => void;
  onLongPress?: () => void;
}

export default function CategoryCard({ category, count, onClick, onLongPress }: Props) {
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
      <div className="aspect-square bg-gradient-to-br from-delizio-red to-delizio-red-dark flex items-center justify-center relative">
        {category.photo_url ? (
          <img
            src={category.photo_url}
            alt={category.name_fr}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-7xl drop-shadow-lg">{category.emoji}</span>
        )}
        {typeof count === 'number' && (
          <span className="absolute top-2 end-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="p-3 text-center">
        <div className="font-bold text-base leading-tight">{category.name_fr}</div>
        {category.name_ar && (
          <div className="text-sm text-gray-500 mt-0.5 font-arabic" dir="rtl">
            {category.name_ar}
          </div>
        )}
      </div>
    </button>
  );
}
