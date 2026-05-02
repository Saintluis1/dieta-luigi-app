# Component Patterns — Dieta Luigi Web App

Drop-in patterns for the major UI surfaces. All assume:
- React 18 with hooks
- Tailwind CSS with the design-system tokens loaded
- `lucide-react` for icons
- `zustand` for global state, `idb` for persistence
- React Router v6

When adapting these, **don't loosen the design system** (no random colors, no shadow effects, keep the 44 px tap target rule).

---

## 1. App skeleton with bottom-tab nav

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { CalendarDays, CheckCircle2, ShoppingBasket, User } from 'lucide-react';

const TABS = [
  { to: '/',         icon: CalendarDays,    label: 'Piano' },
  { to: '/track',    icon: CheckCircle2,    label: 'Diario' },
  { to: '/shopping', icon: ShoppingBasket,  label: 'Spesa' },
  { to: '/profile',  icon: User,            label: 'Profilo' },
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-bg text-ink flex flex-col">
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
                `flex flex-col items-center justify-center gap-1 h-16 min-h-11
                 ${isActive ? 'text-brand' : 'text-ink2'}`
              }
              aria-current={({ isActive }) => isActive ? 'page' : undefined}
            >
              <Icon size={24} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-caption">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

---

## 2. Sticky day selector

Horizontal scroll, current day is auto-centered, persists today as default.

```jsx
import { useEffect, useRef } from 'react';

const DAYS = [
  { id: 'lunedi',    short: 'Lun', long: 'Lunedì' },
  { id: 'martedi',   short: 'Mar', long: 'Martedì' },
  { id: 'mercoledi', short: 'Mer', long: 'Mercoledì' },
  { id: 'giovedi',   short: 'Gio', long: 'Giovedì' },
  { id: 'venerdi',   short: 'Ven', long: 'Venerdì' },
  { id: 'sabato',    short: 'Sab', long: 'Sabato' },
  { id: 'domenica',  short: 'Dom', long: 'Domenica' },
];

export function DaySelector({ activeDayId, onChange }) {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeDayId]);

  return (
    <div className="sticky top-0 z-20 bg-bg/85 backdrop-blur border-b border-line">
      <div
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar"
        role="tablist"
      >
        {DAYS.map((d) => {
          const isActive = d.id === activeDayId;
          return (
            <button
              key={d.id}
              role="tab"
              aria-selected={isActive}
              data-active={isActive}
              onClick={() => onChange(d.id)}
              className={`shrink-0 min-h-11 px-4 rounded-full text-body-strong
                          transition-colors
                          ${isActive
                            ? 'bg-brand text-bg'
                            : 'bg-surface text-ink2 border border-line'}`}
            >
              {d.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

The `.no-scrollbar` utility hides the scrollbar; add to `index.css`:
```css
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }
```

---

## 3. Meal card

```jsx
import { ArrowLeftRight, AlertCircle } from 'lucide-react';

const MEAL_LABELS = {
  colazione: 'Colazione',
  spuntino:  'Spuntino',
  pranzo:    'Pranzo',
  merenda:   'Merenda',
  cena:      'Cena',
};

const MEAL_COLORS = {
  colazione: 'bg-meal-breakfast',
  spuntino:  'bg-meal-snack',
  pranzo:    'bg-meal-lunch',
  merenda:   'bg-meal-snack',
  cena:      'bg-meal-dinner',
};

export function MealCard({ mealKey, items, onSwap }) {
  return (
    <section
      aria-labelledby={`meal-${mealKey}`}
      className="bg-surface border border-line rounded-2xl overflow-hidden"
    >
      <header className={`${MEAL_COLORS[mealKey]} px-4 py-2`}>
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
            <span className="tabular text-body-strong text-ink2 shrink-0">
              {item.grams} g
            </span>
            {item.swappable && (
              <button
                onClick={() => onSwap(item)}
                aria-label={`Cambia ${item.name}`}
                className="min-h-11 min-w-11 grid place-items-center
                           rounded-xl text-ink2 hover:text-brand hover:bg-surface2
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
```

---

## 4. Swap modal (alternatives picker)

The trickiest component. Bottom-sheet on mobile, centered modal on tablet+.

```jsx
import { useEffect } from 'react';
import { X } from 'lucide-react';
import alternatives from '../data/alternatives.json';

export function SwapSheet({ open, item, dayId, mealKey, onClose, onPick }) {
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

  // Pull from the right pool
  const pool = alternatives[item.swap_pool] ?? [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="swap-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      {/* Scrim */}
      <button
        aria-label="Chiudi"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />

      {/* Sheet */}
      <div
        className="relative w-full sm:max-w-md bg-surface
                   rounded-t-3xl sm:rounded-3xl
                   max-h-[85dvh] flex flex-col
                   pb-[env(safe-area-inset-bottom)]"
      >
        <header className="flex items-center justify-between px-5 pt-4 pb-2">
          <div>
            <p className="text-caption text-ink2 uppercase tracking-wide">Sostituisci</p>
            <h2 id="swap-title" className="text-h2">{item.name}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi"
            className="min-h-11 min-w-11 grid place-items-center rounded-xl text-ink2"
          >
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
                onClick={() => onPick(alt)}
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
                <span className="tabular text-body-strong text-ink2 shrink-0">
                  {alt.grams} g
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

Wire-up in the parent screen:

```jsx
const [swapTarget, setSwapTarget] = useState(null);
// ...
<MealCard
  mealKey="cena"
  items={meals.cena}
  onSwap={(item) => setSwapTarget({ item, dayId, mealKey: 'cena' })}
/>
<SwapSheet
  open={!!swapTarget}
  {...swapTarget}
  onClose={() => setSwapTarget(null)}
  onPick={(alt) => {
    saveSubstitution({ ...swapTarget, replacement: alt });
    setSwapTarget(null);
  }}
/>
```

The `replacement` carries `alt.grams` (the alternative's own grams), NOT `item.grams`. That's the substitution rule.

---

## 5. Shopping list aggregator

```js
// lib/shoppingList.js
import mealPlan from '../data/meal-plan.json';

const REPARTO_ORDER = [
  'pescheria',
  'macelleria',
  'ortofrutta-frutta',
  'ortofrutta-verdure',
  'latticini-uova',
  'panetteria',
  'dispensa',
  'pizzeria',
];

const REPARTO_LABEL = {
  'pescheria':         'Pescheria',
  'macelleria':        'Macelleria',
  'ortofrutta-frutta': 'Ortofrutta — frutta',
  'ortofrutta-verdure':'Ortofrutta — verdure',
  'latticini-uova':    'Latticini e uova',
  'panetteria':        'Panetteria',
  'dispensa':          'Dispensa',
  'pizzeria':          'Sabato sera',
};

/**
 * Build a shopping list from the base plan + active substitutions.
 * @param {Object[]} substitutions — { dayId, mealKey, originalId, replacement: { id, name, grams, reparto } }
 */
export function buildShoppingList(substitutions = []) {
  const subKey = (dayId, mealKey, originalId) => `${dayId}|${mealKey}|${originalId}`;
  const subMap = new Map(
    substitutions.map((s) => [subKey(s.dayId, s.mealKey, s.originalId), s.replacement])
  );

  const totals = new Map(); // id → { name, grams, reparto }

  for (const day of mealPlan.days) {
    for (const [mealKey, items] of Object.entries(day.meals)) {
      for (const item of items) {
        const replacement = subMap.get(subKey(day.day, mealKey, item.id));
        const effective = replacement ?? item;
        const prev = totals.get(effective.id);
        totals.set(effective.id, {
          name: effective.name,
          grams: (prev?.grams ?? 0) + effective.grams,
          reparto: effective.reparto,
        });
      }
    }
  }

  // Group by reparto, ordered
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
      items: byReparto[r],
    }));
}
```

The list section component:

```jsx
export function ShoppingSection({ section, checkedIds, onToggle }) {
  return (
    <section className="bg-surface border border-line rounded-2xl overflow-hidden">
      <h2 className="text-h2 px-4 py-3 bg-surface2 border-b border-line">
        {section.label}
      </h2>
      <ul className="divide-y divide-line">
        {section.items.map((item) => {
          const checked = checkedIds.has(item.name);
          return (
            <li key={item.name}>
              <button
                onClick={() => onToggle(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 min-h-14 text-left
                            ${checked ? 'opacity-50' : ''}`}
                aria-pressed={checked}
              >
                <span className={`size-6 rounded-md border-2
                                  ${checked ? 'bg-brand border-brand' : 'border-line'}
                                  grid place-items-center transition`}>
                  {checked && <span className="size-3 bg-bg rounded-sm" />}
                </span>
                <span className={`flex-1 text-body-strong
                                  ${checked ? 'line-through' : ''}`}>
                  {item.name}
                </span>
                <span className="tabular text-body-strong text-ink2">
                  {item.grams} g
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

---

## 6. Tracking entry sheet

Bottom sheet to mark a meal: planned / swapped / skipped / off-plan.

```jsx
const STATUSES = [
  { id: 'planned',  label: 'Come da piano', tone: 'good' },
  { id: 'swapped',  label: 'Ho sostituito',  tone: 'lunch' },
  { id: 'skipped',  label: 'Saltato',        tone: 'pizza' },
  { id: 'off-plan', label: 'Fuori piano',    tone: 'breakfast' },
];

export function TrackSheet({ open, dayId, mealKey, mealLabel, onClose, onSave }) {
  const [status, setStatus] = useState('planned');
  const [note, setNote] = useState('');

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-end justify-center">
      <button onClick={onClose} aria-label="Chiudi" className="absolute inset-0 bg-ink/40" />
      <div className="relative w-full sm:max-w-md bg-surface rounded-t-3xl
                      pb-[env(safe-area-inset-bottom)]">
        <header className="px-5 pt-4 pb-3">
          <p className="text-caption text-ink2 uppercase tracking-wide">{mealLabel}</p>
          <h2 className="text-h2">Come è andato?</h2>
        </header>

        <div className="px-5 grid grid-cols-2 gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatus(s.id)}
              className={`min-h-12 rounded-xl border text-body-strong
                          ${status === s.id
                            ? 'bg-meal-' + s.tone + ' border-line'
                            : 'border-line bg-surface'}`}
              aria-pressed={status === s.id}
            >
              {s.label}
            </button>
          ))}
        </div>

        {status === 'off-plan' && (
          <div className="px-5 mt-3">
            <label htmlFor="note" className="text-small text-ink2">
              Cosa hai mangiato?
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border border-line bg-surface
                         text-body resize-none"
              rows={3}
              placeholder="Es. cena fuori al ristorante"
            />
          </div>
        )}

        <div className="p-5 pt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="h-12 rounded-xl border border-line text-body-strong"
          >
            Annulla
          </button>
          <button
            onClick={() => onSave({ status, note: status === 'off-plan' ? note : undefined })}
            className="h-12 rounded-xl bg-brand text-bg text-body-strong"
          >
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. PWA install prompt (iOS-aware)

iOS Safari doesn't fire `beforeinstallprompt`. Handle both:

```jsx
import { useEffect, useState } from 'react';

export function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
                       || window.navigator.standalone;
    if (isStandalone) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const dismissed = localStorage.getItem('ios-install-dismissed');
      if (!dismissed) setIosHint(true);
      return;
    }

    const onPrompt = (e) => { e.preventDefault(); setDeferred(e); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (deferred) {
    return (
      <button
        onClick={() => deferred.prompt()}
        className="h-12 px-5 rounded-xl bg-brand text-bg text-body-strong"
      >
        Installa l'app
      </button>
    );
  }

  if (iosHint) {
    return (
      <div className="bg-surface border border-line rounded-2xl p-4 text-small">
        Per installare sul telefono: tocca <strong>Condividi</strong> in Safari,
        poi <strong>"Aggiungi alla schermata Home"</strong>.
        <button
          className="block mt-2 text-ink2 underline"
          onClick={() => {
            localStorage.setItem('ios-install-dismissed', '1');
            setIosHint(false);
          }}
        >
          Ho capito
        </button>
      </div>
    );
  }

  return null;
}
```

---

## 8. IndexedDB store wrapper

```js
// lib/db.js
import { openDB } from 'idb';

const DB_NAME = 'dieta-luigi';
const DB_VER = 1;

export const db = openDB(DB_NAME, DB_VER, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('substitutions')) {
      // key = `${weekStartISO}|${dayId}|${mealKey}|${originalId}`
      db.createObjectStore('substitutions');
    }
    if (!db.objectStoreNames.contains('tracking')) {
      // key = `${dateISO}|${mealKey}` ; value = { status, note, swappedTo? }
      db.createObjectStore('tracking');
    }
    if (!db.objectStoreNames.contains('shopping')) {
      // key = weekStartISO ; value = string[] of checked item names
      db.createObjectStore('shopping');
    }
    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings');
    }
  },
});

export async function getAllSubstitutions(weekStartISO) {
  const conn = await db;
  const all = [];
  let cursor = await conn.transaction('substitutions').store.openCursor();
  while (cursor) {
    if (cursor.key.startsWith(weekStartISO + '|')) {
      const [, dayId, mealKey, originalId] = cursor.key.split('|');
      all.push({ dayId, mealKey, originalId, replacement: cursor.value });
    }
    cursor = await cursor.continue();
  }
  return all;
}
```

---

## Quick implementation checklist

When asked to build a screen, walk through:

1. ☐ Read the relevant data files (`meal-plan.json`, `alternatives.json`, etc.)
2. ☐ Identify which patterns above apply.
3. ☐ Use design-system tokens — never hardcode colors or pixel sizes outside the scale.
4. ☐ Verify tap targets are ≥ 44 px.
5. ☐ Test mentally at 375 px width (iPhone SE).
6. ☐ Add `aria-` attributes for any interactive element without a visible label.
7. ☐ Wire up persistence via `lib/db.js` if the screen has user input.
