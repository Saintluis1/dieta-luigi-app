import { useMemo, useState, useEffect } from 'react';
import { buildShoppingList } from '../lib/shoppingList.js';
import { useAppStore } from '../lib/store.js';
import { loadShoppingChecked, saveShoppingChecked } from '../lib/db.js';

function getCurrentWeekKey() {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

const WEEK_KEY = getCurrentWeekKey();

export default function ShoppingScreen() {
  const substitutions = useAppStore((s) => s.substitutions);
  const [checked, setChecked] = useState(new Set());

  useEffect(() => {
    loadShoppingChecked(WEEK_KEY).then((arr) => setChecked(new Set(arr)));
  }, []);

  const sections = useMemo(() => {
    const subList = Object.entries(substitutions).map(([key, replacement]) => {
      const [dayId, mealKey, originalId] = key.split('|');
      return { dayId, mealKey, originalId, replacement };
    });
    return buildShoppingList(subList);
  }, [substitutions]);

  const toggle = (name) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      saveShoppingChecked(WEEK_KEY, [...next]);
      return next;
    });
  };

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
