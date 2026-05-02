#!/usr/bin/env python3
"""
scaffold.py — generate the Dieta Luigi web app project.

Usage:
    python scaffold.py /path/to/output-directory

Creates a working Vite + React + Tailwind + PWA project pre-loaded with:
- All data files (meal-plan, alternatives, patient, diet rules)
- Bottom-tab navigation with the 4 main screens (stub'd)
- Design system applied via tailwind.config.js + CSS variables
- IndexedDB wrapper, swap-sheet, shopping-list aggregator
- PWA manifest + vite-plugin-pwa configured
- README explaining how to run

After scaffold:  cd into the directory, npm install, npm run dev.
"""

import json
import shutil
import sys
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
REFS = SKILL_DIR / "references"


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"  + {path.relative_to(path.parents[len(path.parents)-2])}")


def copy_data(out: Path) -> None:
    """Copy the JSON data files into src/data/."""
    data_dir = out / "src" / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    for name in ("meal-plan.json", "alternatives.json", "patient.json"):
        src = REFS / name
        if not src.exists():
            print(f"  ! missing {src} — skipping", file=sys.stderr)
            continue
        # Strip the _schema and _glossary keys from runtime copies (keep size down)
        data = json.loads(src.read_text(encoding="utf-8"))
        for k in ("_schema", "_glossary"):
            data.pop(k, None)
        (data_dir / name).write_text(
            json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"  + src/data/{name}")


# ---------- file templates ----------

PACKAGE_JSON = """{
  "name": "dieta-luigi",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --host"
  },
  "dependencies": {
    "idb": "^8.0.0",
    "lucide-react": "^0.395.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.24.0",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.3",
    "vite-plugin-pwa": "^0.20.0"
  }
}
"""

VITE_CONFIG = """import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Dieta Luigi',
        short_name: 'Dieta',
        description: 'Piano alimentare personale',
        theme_color: '#1b5e35',
        background_color: '#faf8f2',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}']
      }
    })
  ]
});
"""

INDEX_HTML = """<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#1b5e35" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <title>Dieta Luigi</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""

TAILWIND_CONFIG = """/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       'rgb(var(--bg) / <alpha-value>)',
        surface:  'rgb(var(--surface) / <alpha-value>)',
        surface2: 'rgb(var(--surface2) / <alpha-value>)',
        ink:      'rgb(var(--ink) / <alpha-value>)',
        ink2:     'rgb(var(--ink2) / <alpha-value>)',
        ink3:     'rgb(var(--ink3) / <alpha-value>)',
        line:     'rgb(var(--line) / <alpha-value>)',
        good:     'rgb(var(--good) / <alpha-value>)',
        warn:     'rgb(var(--warn) / <alpha-value>)',
        brand:    'rgb(var(--brand) / <alpha-value>)',
        meal: {
          breakfast: 'rgb(var(--meal-breakfast) / <alpha-value>)',
          snack:     'rgb(var(--meal-snack) / <alpha-value>)',
          lunch:     'rgb(var(--meal-lunch) / <alpha-value>)',
          dinner:    'rgb(var(--meal-dinner) / <alpha-value>)',
          pizza:     'rgb(var(--meal-pizza) / <alpha-value>)'
        }
      },
      fontSize: {
        display:       ['28px', { lineHeight: '32px', fontWeight: '600' }],
        h1:            ['22px', { lineHeight: '28px', fontWeight: '600' }],
        h2:            ['18px', { lineHeight: '24px', fontWeight: '600' }],
        body:          ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-strong': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        small:         ['14px', { lineHeight: '20px', fontWeight: '400' }],
        caption:       ['12px', { lineHeight: '16px', fontWeight: '500' }]
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px'
      }
    }
  },
  plugins: []
};
"""

POSTCSS_CONFIG = """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
"""

INDEX_CSS = """@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: 250 248 242;
  --surface: 255 255 255;
  --surface2: 246 243 235;
  --ink: 28 26 22;
  --ink2: 89 84 77;
  --ink3: 154 148 138;
  --line: 230 224 213;
  --meal-breakfast: 250 238 218;
  --meal-snack: 234 243 222;
  --meal-lunch: 230 241 251;
  --meal-dinner: 238 237 254;
  --meal-pizza: 250 236 231;
  --good: 99 153 34;
  --warn: 186 117 23;
  --brand: 27 94 53;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: 18 17 15;
    --surface: 28 26 22;
    --surface2: 38 35 30;
    --ink: 245 242 235;
    --ink2: 178 172 162;
    --ink3: 128 122 112;
    --line: 56 52 46;
    --meal-breakfast: 65 36 2;
    --meal-snack: 39 80 10;
    --meal-lunch: 12 68 124;
    --meal-dinner: 60 52 137;
    --meal-pizza: 113 43 19;
    --good: 151 196 89;
    --warn: 239 159 39;
    --brand: 168 200 130;
  }
}

html, body { background: rgb(var(--bg)); color: rgb(var(--ink)); }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter',
               system-ui, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.tabular { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
"""

MAIN_JSX = """import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"""

APP_JSX = """import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { CalendarDays, CheckCircle2, ShoppingBasket, User } from 'lucide-react';
import PlanScreen from './screens/PlanScreen.jsx';
import TrackScreen from './screens/TrackScreen.jsx';
import ShoppingScreen from './screens/ShoppingScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';

const TABS = [
  { to: '/',         icon: CalendarDays,    label: 'Piano' },
  { to: '/track',    icon: CheckCircle2,    label: 'Diario' },
  { to: '/shopping', icon: ShoppingBasket,  label: 'Spesa' },
  { to: '/profile',  icon: User,            label: 'Profilo' }
];

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
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
"""

PLAN_SCREEN = """import { useState } from 'react';
import mealPlan from '../data/meal-plan.json';
import { DaySelector } from '../components/DaySelector.jsx';
import { MealCard } from '../components/MealCard.jsx';
import { SwapSheet } from '../components/SwapSheet.jsx';
import { useAppStore } from '../lib/store.js';

const MEAL_ORDER = ['colazione', 'spuntino', 'pranzo', 'merenda', 'cena'];

function defaultDay() {
  const map = ['domenica', 'lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato'];
  return map[new Date().getDay()];
}

export default function PlanScreen() {
  const [activeDayId, setActiveDayId] = useState(defaultDay());
  const [swapTarget, setSwapTarget] = useState(null);
  const substitutions = useAppStore((s) => s.substitutions);
  const setSub = useAppStore((s) => s.setSubstitution);

  const day = mealPlan.days.find((d) => d.day === activeDayId);
  if (!day) return null;

  const subKey = (mealKey, origId) => `${activeDayId}|${mealKey}|${origId}`;

  return (
    <>
      <DaySelector activeDayId={activeDayId} onChange={setActiveDayId} />

      <div className="px-4 pt-4">
        <h1 className="text-display mb-4">{day.label}</h1>
        <div className="space-y-3">
          {MEAL_ORDER.filter((m) => day.meals[m]).map((mealKey) => {
            const items = day.meals[mealKey].map((it) => {
              const sub = substitutions[subKey(mealKey, it.id)];
              return sub ? { ...sub, swappable: it.swappable, swap_pool: it.swap_pool } : it;
            });
            return (
              <MealCard
                key={mealKey}
                mealKey={mealKey}
                items={items}
                onSwap={(item) => setSwapTarget({ item, mealKey })}
              />
            );
          })}
        </div>
      </div>

      <SwapSheet
        open={!!swapTarget}
        item={swapTarget?.item}
        onClose={() => setSwapTarget(null)}
        onPick={(alt) => {
          setSub(activeDayId, swapTarget.mealKey, swapTarget.item.id, alt);
          setSwapTarget(null);
        }}
      />
    </>
  );
}
"""

TRACK_SCREEN = """export default function TrackScreen() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-display mb-2">Diario</h1>
      <p className="text-ink2">In costruzione. Marca i pasti come da piano, sostituiti, saltati o fuori piano.</p>
    </div>
  );
}
"""

SHOPPING_SCREEN = """import { useMemo, useState } from 'react';
import { buildShoppingList } from '../lib/shoppingList.js';
import { useAppStore } from '../lib/store.js';

export default function ShoppingScreen() {
  const substitutions = useAppStore((s) => s.substitutions);
  const [checked, setChecked] = useState(new Set());

  const sections = useMemo(() => {
    const subList = Object.entries(substitutions).map(([key, replacement]) => {
      const [dayId, mealKey, originalId] = key.split('|');
      return { dayId, mealKey, originalId, replacement };
    });
    return buildShoppingList(subList);
  }, [substitutions]);

  const toggle = (name) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  return (
    <div className="px-4 pt-6">
      <h1 className="text-display mb-4">Lista della spesa</h1>
      <div className="space-y-3">
        {sections.map((section) => (
          <section key={section.reparto} className="bg-surface border border-line rounded-2xl overflow-hidden">
            <h2 className="text-h2 px-4 py-3 bg-surface2 border-b border-line">{section.label}</h2>
            <ul className="divide-y divide-line">
              {section.items.map((item) => {
                const isChecked = checked.has(item.name);
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => toggle(item.name)}
                      aria-pressed={isChecked}
                      className={`w-full flex items-center gap-3 px-4 py-3 min-h-14 text-left
                                  ${isChecked ? 'opacity-50' : ''}`}
                    >
                      <span className={`size-6 rounded-md border-2
                                        ${isChecked ? 'bg-brand border-brand' : 'border-line'}
                                        grid place-items-center`}>
                        {isChecked && <span className="size-3 bg-bg rounded-sm" />}
                      </span>
                      <span className={`flex-1 text-body-strong ${isChecked ? 'line-through' : ''}`}>
                        {item.name}
                      </span>
                      <span className="tabular text-body-strong text-ink2">{item.grams} g</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
"""

PROFILE_SCREEN = """import patient from '../data/patient.json';

const Stat = ({ label, value, hint }) => (
  <div className="bg-surface2 rounded-2xl p-4">
    <p className="text-caption text-ink2 uppercase tracking-wide">{label}</p>
    <p className="text-h1 tabular mt-1">{value}</p>
    {hint && <p className="text-small text-ink2 mt-0.5">{hint}</p>}
  </div>
);

export default function ProfileScreen() {
  const a = patient.anthropometry;
  const c = patient.bia.composition_percent;
  return (
    <div className="px-4 pt-6 space-y-4">
      <header>
        <h1 className="text-display">{patient.personal.name}</h1>
        <p className="text-ink2">{patient.personal.age} anni · {patient.personal.height_cm} cm</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Peso attuale" value={`${a.weight_current_kg} kg`} />
        <Stat label="Peso teorico" value={`${a.weight_target_kg} kg`} />
        <Stat label="BMI" value={a.bmi} hint={a.bmi_range} />
        <Stat label="BMR" value={`${a.bmr_kcal} kcal`} />
        <Stat label="Massa magra" value={`${c.ffm_pct_weight}%`} hint={`${c.ffm_kg} kg`} />
        <Stat label="Massa grassa" value={`${c.fm_pct_weight}%`} hint={`${c.fm_kg} kg`} />
      </div>
    </div>
  );
}
"""

DAY_SELECTOR = """import { useEffect, useRef } from 'react';

const DAYS = [
  { id: 'lunedi',    short: 'Lun' },
  { id: 'martedi',   short: 'Mar' },
  { id: 'mercoledi', short: 'Mer' },
  { id: 'giovedi',   short: 'Gio' },
  { id: 'venerdi',   short: 'Ven' },
  { id: 'sabato',    short: 'Sab' },
  { id: 'domenica',  short: 'Dom' }
];

export function DaySelector({ activeDayId, onChange }) {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeDayId]);

  return (
    <div className="sticky top-0 z-20 bg-bg/85 backdrop-blur border-b border-line">
      <div ref={scrollerRef} className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar" role="tablist">
        {DAYS.map((d) => {
          const isActive = d.id === activeDayId;
          return (
            <button
              key={d.id}
              role="tab"
              aria-selected={isActive}
              data-active={isActive}
              onClick={() => onChange(d.id)}
              className={`shrink-0 min-h-11 px-4 rounded-full text-body-strong transition-colors
                          ${isActive ? 'bg-brand text-bg' : 'bg-surface text-ink2 border border-line'}`}
            >
              {d.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
"""

MEAL_CARD = """import { ArrowLeftRight, AlertCircle } from 'lucide-react';

const MEAL_LABELS = {
  colazione: 'Colazione',
  spuntino:  'Spuntino',
  pranzo:    'Pranzo',
  merenda:   'Merenda',
  cena:      'Cena'
};

const MEAL_BG = {
  colazione: 'bg-meal-breakfast',
  spuntino:  'bg-meal-snack',
  pranzo:    'bg-meal-lunch',
  merenda:   'bg-meal-snack',
  cena:      'bg-meal-dinner'
};

export function MealCard({ mealKey, items, onSwap }) {
  return (
    <section
      aria-labelledby={`meal-${mealKey}`}
      className="bg-surface border border-line rounded-2xl overflow-hidden"
    >
      <header className={`${MEAL_BG[mealKey]} px-4 py-2`}>
        <h2 id={`meal-${mealKey}`} className="text-caption uppercase tracking-wide text-ink">
          {MEAL_LABELS[mealKey]}
        </h2>
      </header>
      <ul className="divide-y divide-line">
        {items.map((item, i) => (
          <li key={`${item.id}-${i}`} className="flex items-center gap-3 px-4 py-3 min-h-14">
            <div className="flex-1 min-w-0">
              <p className="text-body-strong truncate">{item.name}</p>
              {item.note && (
                <p className="text-small text-ink2 flex items-center gap-1 mt-0.5">
                  <AlertCircle size={14} aria-hidden /> {item.note}
                </p>
              )}
            </div>
            <span className="tabular text-body-strong text-ink2 shrink-0">{item.grams} g</span>
            {item.swappable && (
              <button
                onClick={() => onSwap(item)}
                aria-label={`Cambia ${item.name}`}
                className="min-h-11 min-w-11 grid place-items-center rounded-xl
                           text-ink2 hover:text-brand hover:bg-surface2
                           active:scale-95 transition"
              >
                <ArrowLeftRight size={20} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
"""

SWAP_SHEET = """import { useEffect } from 'react';
import { X } from 'lucide-react';
import alternatives from '../data/alternatives.json';

export function SwapSheet({ open, item, onClose, onPick }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !item) return null;
  const pool = alternatives[item.swap_pool] ?? [];

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="swap-title"
         className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button aria-label="Chiudi" onClick={onClose}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <div className="relative w-full sm:max-w-md bg-surface
                      rounded-t-3xl sm:rounded-3xl
                      max-h-[85dvh] flex flex-col
                      pb-[env(safe-area-inset-bottom)]">
        <header className="flex items-start justify-between px-5 pt-4 pb-2">
          <div>
            <p className="text-caption text-ink2 uppercase tracking-wide">Sostituisci</p>
            <h2 id="swap-title" className="text-h2">{item.name}</h2>
          </div>
          <button onClick={onClose} aria-label="Chiudi"
                  className="min-h-11 min-w-11 grid place-items-center rounded-xl text-ink2">
            <X size={22} />
          </button>
        </header>
        <p className="px-5 text-small text-ink2 mb-2">
          Le grammature variano: ogni alimento ha la sua quantità approvata dalla nutrizionista.
        </p>
        <ul className="overflow-y-auto px-2 pb-2 flex-1">
          {pool.map((alt) => (
            <li key={alt.id}>
              <button
                onClick={() => onPick({ ...alt, swappable: item.swappable, swap_pool: item.swap_pool })}
                className="w-full flex items-center gap-3 px-3 py-3 min-h-14
                           rounded-xl hover:bg-surface2 active:bg-surface2 text-left"
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-body-strong truncate">{alt.name}</span>
                  {alt.frequency && (
                    <span className="inline-block mt-0.5 text-caption px-2 py-0.5
                                     rounded-full bg-meal-breakfast text-ink">
                      max {alt.frequency.replace('/', ' volte su ')}
                    </span>
                  )}
                </span>
                <span className="tabular text-body-strong text-ink2 shrink-0">{alt.grams} g</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
"""

STORE_JS = """import { create } from 'zustand';

// MVP: in-memory only. Wire idb via lib/db.js when persistence is needed.
export const useAppStore = create((set) => ({
  substitutions: {},
  setSubstitution: (dayId, mealKey, originalId, replacement) =>
    set((state) => ({
      substitutions: {
        ...state.substitutions,
        [`${dayId}|${mealKey}|${originalId}`]: replacement
      }
    })),
  clearSubstitution: (dayId, mealKey, originalId) =>
    set((state) => {
      const next = { ...state.substitutions };
      delete next[`${dayId}|${mealKey}|${originalId}`];
      return { substitutions: next };
    })
}));
"""

DB_JS = """import { openDB } from 'idb';

const DB_NAME = 'dieta-luigi';
const DB_VER = 1;

export const dbPromise = openDB(DB_NAME, DB_VER, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('substitutions')) {
      db.createObjectStore('substitutions');
    }
    if (!db.objectStoreNames.contains('tracking')) {
      db.createObjectStore('tracking');
    }
    if (!db.objectStoreNames.contains('shopping')) {
      db.createObjectStore('shopping');
    }
    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings');
    }
  }
});
"""

SHOPPING_LIST_JS = """import mealPlan from '../data/meal-plan.json';

const REPARTO_ORDER = [
  'pescheria',
  'macelleria',
  'ortofrutta-frutta',
  'ortofrutta-verdure',
  'latticini-uova',
  'panetteria',
  'dispensa',
  'pizzeria'
];

const REPARTO_LABEL = {
  'pescheria':         'Pescheria',
  'macelleria':        'Macelleria',
  'ortofrutta-frutta': 'Ortofrutta — frutta',
  'ortofrutta-verdure':'Ortofrutta — verdure',
  'latticini-uova':    'Latticini e uova',
  'panetteria':        'Panetteria',
  'dispensa':          'Dispensa',
  'pizzeria':          'Sabato sera'
};

export function buildShoppingList(substitutions = []) {
  const subKey = (dayId, mealKey, originalId) => `${dayId}|${mealKey}|${originalId}`;
  const subMap = new Map(
    substitutions.map((s) => [subKey(s.dayId, s.mealKey, s.originalId), s.replacement])
  );

  const totals = new Map();

  for (const day of mealPlan.days) {
    for (const [mealKey, items] of Object.entries(day.meals)) {
      for (const item of items) {
        const replacement = subMap.get(subKey(day.day, mealKey, item.id));
        const effective = replacement ?? item;
        const prev = totals.get(effective.name);
        totals.set(effective.name, {
          name: effective.name,
          grams: (prev?.grams ?? 0) + effective.grams,
          reparto: effective.reparto
        });
      }
    }
  }

  const byReparto = {};
  for (const item of totals.values()) {
    (byReparto[item.reparto] ??= []).push(item);
  }
  for (const list of Object.values(byReparto)) {
    list.sort((a, b) => a.name.localeCompare(b.name, 'it'));
  }

  return REPARTO_ORDER
    .filter((r) => byReparto[r]?.length)
    .map((r) => ({
      reparto: r,
      label: REPARTO_LABEL[r],
      items: byReparto[r]
    }));
}
"""

GITIGNORE = """node_modules
dist
.DS_Store
*.local
"""

README = """# Dieta Luigi

Mobile-first PWA per il piano alimentare di Luigi Lafiandra.

## Avvio rapido

```bash
npm install
npm run dev
```

Apre su http://localhost:5173 — apri il devtools, modalità mobile (iPhone SE 375 px) per l'esperienza target.

## Build + preview

```bash
npm run build
npm run preview
```

Per testare la PWA è necessario il preview (il dev server non registra il service worker).

## Struttura

```
src/
├── main.jsx, App.jsx          ← entry e routing
├── index.css                  ← Tailwind + CSS variables (design tokens)
├── data/                      ← meal-plan, alternatives, patient (read-only)
├── components/                ← DaySelector, MealCard, SwapSheet, ...
├── screens/                   ← Plan, Track, Shopping, Profile
└── lib/                       ← store (zustand), db (idb), shoppingList
```

## Cosa è implementato (MVP)

- Piano settimanale con 7 giorni, 5 pasti, navigazione sticky.
- Sostituzione alimenti con modal e database alternative (grammature corrette per alimento).
- Lista spesa dinamica aggregata e raggruppata per reparto.
- Profilo con dati antropometrici e composizione corporea.
- PWA installabile (manifest + service worker via vite-plugin-pwa).

## Cosa NON è implementato (next steps)

- Tracking pasti (TrackScreen è uno stub).
- Persistenza in IndexedDB per substitutions, shopping, tracking (lo store zustand è in-memory; il wrapper db.js è pronto).
- Onboarding al primo avvio.
- Banner sabato "se pizza → no carb a pranzo".
- Icone PWA (servono i file `pwa-192x192.png`, `pwa-512x512.png`, `pwa-maskable-512.png` in `public/`).

## Convenzioni

- Pesi in grammi, sempre a crudo, al netto degli scarti.
- Tutti i testi in italiano.
- Mobile-first: testato a 375 px di larghezza.
- Tap target minimo 44 × 44 px.
- Dark mode via `prefers-color-scheme`.
- Privacy: nessun dato esce dal device.
"""


# ---------- main ----------

def scaffold(out: Path) -> None:
    out.mkdir(parents=True, exist_ok=True)
    print(f"Generating Dieta Luigi web app in {out}")

    write(out / "package.json", PACKAGE_JSON)
    write(out / "vite.config.js", VITE_CONFIG)
    write(out / "index.html", INDEX_HTML)
    write(out / "tailwind.config.js", TAILWIND_CONFIG)
    write(out / "postcss.config.js", POSTCSS_CONFIG)
    write(out / ".gitignore", GITIGNORE)
    write(out / "README.md", README)

    write(out / "src" / "index.css", INDEX_CSS)
    write(out / "src" / "main.jsx", MAIN_JSX)
    write(out / "src" / "App.jsx", APP_JSX)

    write(out / "src" / "screens" / "PlanScreen.jsx", PLAN_SCREEN)
    write(out / "src" / "screens" / "TrackScreen.jsx", TRACK_SCREEN)
    write(out / "src" / "screens" / "ShoppingScreen.jsx", SHOPPING_SCREEN)
    write(out / "src" / "screens" / "ProfileScreen.jsx", PROFILE_SCREEN)

    write(out / "src" / "components" / "DaySelector.jsx", DAY_SELECTOR)
    write(out / "src" / "components" / "MealCard.jsx", MEAL_CARD)
    write(out / "src" / "components" / "SwapSheet.jsx", SWAP_SHEET)

    write(out / "src" / "lib" / "store.js", STORE_JS)
    write(out / "src" / "lib" / "db.js", DB_JS)
    write(out / "src" / "lib" / "shoppingList.js", SHOPPING_LIST_JS)

    copy_data(out)

    # Empty public/ so vite is happy; user adds icons here later.
    (out / "public").mkdir(exist_ok=True)
    write(out / "public" / "favicon.svg",
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
          '<rect width="32" height="32" rx="6" fill="#1b5e35"/>'
          '<text x="16" y="22" font-family="system-ui" font-size="18" font-weight="600" '
          'text-anchor="middle" fill="#faf8f2">D</text></svg>')

    print()
    print("Done.")
    print()
    print("Next steps:")
    print(f"  cd {out}")
    print("  npm install")
    print("  npm run dev")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python scaffold.py /path/to/output-directory", file=sys.stderr)
        sys.exit(1)
    scaffold(Path(sys.argv[1]).resolve())
