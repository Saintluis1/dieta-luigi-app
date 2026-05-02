import { useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { CalendarDays, CheckCircle2, ShoppingBasket, User } from 'lucide-react';
import PlanScreen from './screens/PlanScreen.jsx';
import TrackScreen from './screens/TrackScreen.jsx';
import ShoppingScreen from './screens/ShoppingScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import { useAppStore } from './lib/store.js';

const TABS = [
  { to: '/',         icon: CalendarDays,    label: 'Piano' },
  { to: '/track',    icon: CheckCircle2,    label: 'Diario' },
  { to: '/shopping', icon: ShoppingBasket,  label: 'Spesa' },
  { to: '/profile',  icon: User,            label: 'Profilo' }
];

export default function App() {
  const hydrate = useAppStore((s) => s.hydrate);
  const hydrated = useAppStore((s) => s.hydrated);

  useEffect(() => { hydrate(); }, [hydrate]);

  if (!hydrated) {
    return (
      <div className="min-h-dvh bg-bg flex items-center justify-center">
        <p className="text-ink2 text-body">Caricamento...</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-dvh bg-bg text-ink flex flex-col max-w-md mx-auto">
        <main className="flex-1 pb-24">
          <Routes>
            <Route path="/"         element={<PlanScreen />} />
            <Route path="/track"    element={<TrackScreen />} />
            <Route path="/shopping" element={<ShoppingScreen />} />
            <Route path="/profile"  element={<ProfileScreen />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  );
}

function BottomNav() {
  return (
    <nav
      role="navigation"
      aria-label="Navigazione principale"
      className="fixed bottom-0 inset-x-0 bg-surface border-t border-line
                 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-4 max-w-md mx-auto">
        {TABS.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 h-16 min-h-11 ${
                  isActive ? 'text-brand' : 'text-ink2'
                }`
              }
            >
              <Icon size={24} strokeWidth={1.8} />
              <span className="text-caption">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
