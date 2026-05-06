import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToday } from '../store/today';

const tabs = [
  { to: '/catalog', icon: '🍽️', key: 'catalog' as const },
  { to: '/today', icon: '🛒', key: 'today' as const, badge: true },
  { to: '/history', icon: '📜', key: 'history' as const },
  { to: '/settings', icon: '⚙️', key: 'settings' as const }
];

export default function BottomNav() {
  const { t } = useTranslation();
  const count = useToday((s) => s.items.length);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-3xl mx-auto grid grid-cols-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 min-h-[64px] text-xs font-medium transition ${
                isActive ? 'text-delizio-red' : 'text-gray-500'
              }`
            }
          >
            <div className="relative">
              <span className="text-2xl">{tab.icon}</span>
              {tab.badge && count > 0 && (
                <span className="absolute -top-1 -end-2 bg-delizio-red text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </div>
            <span className="mt-0.5">{t(`nav.${tab.key}`)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
