import { useState, useEffect, useCallback } from 'react';
import mealPlan from '../data/meal-plan.json';
import { DaySelector } from '../components/DaySelector.jsx';
import { TrackSheet } from '../components/TrackSheet.jsx';
import { loadTrackingForDate, saveTrackingEntry } from '../lib/db.js';

const MEAL_ORDER = ['colazione', 'spuntino', 'pranzo', 'merenda', 'cena'];

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

const STATUS_CONFIG = {
  planned:    { label: 'Come da piano', pill: 'bg-meal-snack text-ink' },
  swapped:    { label: 'Ho sostituito', pill: 'bg-meal-lunch text-ink' },
  skipped:    { label: 'Saltato',       pill: 'bg-meal-pizza text-ink' },
  'off-plan': { label: 'Fuori piano',   pill: 'bg-meal-breakfast text-ink' },
};

function getWeekDates() {
  const today = new Date();
  const dow = today.getDay(); // 0=Dom, 1=Lun, ...
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  monday.setHours(0, 0, 0, 0);

  const DAY_IDS = ['lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato', 'domenica'];
  const result = {};
  DAY_IDS.forEach((id, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    result[id] = d.toISOString().slice(0, 10);
  });
  return result;
}

function defaultDay() {
  const map = ['domenica', 'lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato'];
  return map[new Date().getDay()];
}

const WEEK_DATES = getWeekDates();

export default function TrackScreen() {
  const [activeDayId, setActiveDayId] = useState(defaultDay);
  const [tracking, setTracking] = useState({});
  const [trackTarget, setTrackTarget] = useState(null);

  const activeDate = WEEK_DATES[activeDayId];
  const day = mealPlan.days.find((d) => d.day === activeDayId);
  const mealsForDay = day ? MEAL_ORDER.filter((m) => day.meals[m]) : [];
  const trackedCount = mealsForDay.filter((m) => tracking[m]).length;

  const loadTracking = useCallback(async () => {
    const data = await loadTrackingForDate(activeDate);
    setTracking(data);
  }, [activeDate]);

  useEffect(() => { loadTracking(); }, [loadTracking]);

  const handleSave = async ({ status, note }) => {
    const entry = { status, note, savedAt: new Date().toISOString() };
    await saveTrackingEntry(activeDate, trackTarget.mealKey, entry);
    setTracking((prev) => ({ ...prev, [trackTarget.mealKey]: entry }));
    setTrackTarget(null);
  };

  return (
    <>
      <DaySelector activeDayId={activeDayId} onChange={setActiveDayId} />

      <div className="px-4 pt-4">
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="text-display">{day?.label}</h1>
          {mealsForDay.length > 0 && (
            <span className="text-small text-ink2">
              {trackedCount}/{mealsForDay.length} tracciati
            </span>
          )}
        </div>

        <div className="space-y-3">
          {mealsForDay.map((mealKey) => {
            const items = day.meals[mealKey];
            const entry = tracking[mealKey];
            const statusCfg = entry ? STATUS_CONFIG[entry.status] : null;

            return (
              <button
                key={mealKey}
                onClick={() => setTrackTarget({ mealKey, mealLabel: MEAL_LABELS[mealKey] })}
                className="w-full bg-surface border border-line rounded-2xl overflow-hidden
                           text-left active:scale-[0.99] transition-transform"
                aria-label={`${MEAL_LABELS[mealKey]}: ${statusCfg ? statusCfg.label : 'non ancora tracciato'}`}
              >
                <div className={`${MEAL_COLORS[mealKey]} px-4 py-2 flex items-center justify-between`}>
                  <span className="text-caption uppercase tracking-wide">
                    {MEAL_LABELS[mealKey]}
                  </span>
                  {statusCfg && (
                    <span className={`text-caption px-2.5 py-0.5 rounded-full ${statusCfg.pill}`}>
                      {statusCfg.label}
                    </span>
                  )}
                </div>

                <div className="px-4 py-3 flex items-center gap-2 min-h-14">
                  <p className="flex-1 text-body text-ink2 truncate">
                    {items.map((i) => i.name).join(' · ')}
                  </p>
                  {!entry && (
                    <span className="shrink-0 text-small text-brand font-medium">
                      Traccia →
                    </span>
                  )}
                  {entry?.note && (
                    <span className="shrink-0 text-small text-ink3 truncate max-w-[120px]">
                      "{entry.note}"
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <TrackSheet
        open={!!trackTarget}
        mealLabel={trackTarget?.mealLabel}
        currentEntry={trackTarget ? tracking[trackTarget.mealKey] : null}
        onClose={() => setTrackTarget(null)}
        onSave={handleSave}
      />
    </>
  );
}
