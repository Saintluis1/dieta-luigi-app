import { useState } from 'react';
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

        {activeDayId === 'sabato' && (
          <aside className="mb-4 flex gap-3 bg-meal-pizza border border-line rounded-2xl px-4 py-3">
            <span className="text-2xl leading-none mt-0.5" aria-hidden="true">🍕</span>
            <div>
              <p className="text-body-strong">Protocollo pizza del sabato</p>
              <p className="text-small text-ink2 mt-0.5">
                Se stasera mangi pizza → elimina i carboidrati a pranzo (niente pasta, pane o patate).
              </p>
            </div>
          </aside>
        )}

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
