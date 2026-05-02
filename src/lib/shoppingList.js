import mealPlan from '../data/meal-plan.json';

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
