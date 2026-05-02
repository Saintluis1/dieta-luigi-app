import { ArrowLeftRight, AlertCircle } from 'lucide-react';

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
