import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Catalog from './routes/Catalog';
import TodayList from './routes/TodayList';
import History from './routes/History';
import HistoryDetail from './routes/HistoryDetail';
import AddProduct from './routes/AddProduct';
import Settings from './routes/Settings';
import { useProducts } from './store/products';
import { useToday } from './store/today';
import { useContacts } from './store/contacts';
import { useSettings } from './store/settings';

export default function App() {
  const fetchProducts = useProducts((s) => s.fetch);
  const fetchToday = useToday((s) => s.fetch);
  const subscribe = useToday((s) => s.subscribe);
  const unsubscribe = useToday((s) => s.unsubscribe);
  const fetchContacts = useContacts((s) => s.fetch);
  const fetchSettings = useSettings((s) => s.fetch);

  useEffect(() => {
    fetchProducts();
    fetchToday();
    fetchContacts();
    fetchSettings();
    subscribe();
    return () => unsubscribe();
  }, [fetchProducts, fetchToday, fetchContacts, fetchSettings, subscribe, unsubscribe]);

  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 pb-24">
        <Routes>
          <Route path="/" element={<Navigate to="/catalog" replace />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/add" element={<AddProduct />} />
          <Route path="/today" element={<TodayList />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:id" element={<HistoryDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/catalog" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
