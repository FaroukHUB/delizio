import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Login from './routes/Login';
import Catalog from './routes/Catalog';
import CategoryDetail from './routes/CategoryDetail';
import TodayList from './routes/TodayList';
import History from './routes/History';
import HistoryDetail from './routes/HistoryDetail';
import AddProduct from './routes/AddProduct';
import AddCategory from './routes/AddCategory';
import Settings from './routes/Settings';
import { useProducts } from './store/products';
import { useCategories } from './store/categories';
import { useToday } from './store/today';
import { useContacts } from './store/contacts';
import { useSettings } from './store/settings';
import { useAuth } from './store/auth';

export default function App() {
  const isAuthed = useAuth((s) => s.isAuthed);

  const fetchProducts = useProducts((s) => s.fetch);
  const fetchCategories = useCategories((s) => s.fetch);
  const fetchToday = useToday((s) => s.fetch);
  const subscribe = useToday((s) => s.subscribe);
  const unsubscribe = useToday((s) => s.unsubscribe);
  const fetchContacts = useContacts((s) => s.fetch);
  const fetchSettings = useSettings((s) => s.fetch);

  useEffect(() => {
    if (!isAuthed) return;
    fetchCategories();
    fetchProducts();
    fetchToday();
    fetchContacts();
    fetchSettings();
    subscribe();
    return () => unsubscribe();
  }, [isAuthed, fetchCategories, fetchProducts, fetchToday, fetchContacts, fetchSettings, subscribe, unsubscribe]);

  if (!isAuthed) return <Login />;

  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 pb-24">
        <Routes>
          <Route path="/" element={<Navigate to="/catalog" replace />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/new-category" element={<AddCategory />} />
          <Route path="/catalog/:key" element={<CategoryDetail />} />
          <Route path="/catalog/:key/add-product" element={<AddProduct />} />
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
