import { openDB } from 'idb';

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

export async function loadSubstitutions() {
  const db = await dbPromise;
  const keys = await db.getAllKeys('substitutions');
  const values = await db.getAll('substitutions');
  const result = {};
  keys.forEach((k, i) => { result[k] = values[i]; });
  return result;
}

export async function putSubstitution(key, value) {
  const db = await dbPromise;
  return db.put('substitutions', value, key);
}

export async function removeSubstitution(key) {
  const db = await dbPromise;
  return db.delete('substitutions', key);
}

export async function loadTrackingForDate(dateISO) {
  const db = await dbPromise;
  const allKeys = await db.getAllKeys('tracking');
  const prefix = dateISO + '|';
  const result = {};
  for (const key of allKeys.filter((k) => k.startsWith(prefix))) {
    const mealKey = key.slice(prefix.length);
    result[mealKey] = await db.get('tracking', key);
  }
  return result;
}

export async function saveTrackingEntry(dateISO, mealKey, entry) {
  const db = await dbPromise;
  return db.put('tracking', entry, `${dateISO}|${mealKey}`);
}

export async function loadShoppingChecked(weekKey) {
  const db = await dbPromise;
  return (await db.get('shopping', weekKey)) ?? [];
}

export async function saveShoppingChecked(weekKey, checkedArray) {
  const db = await dbPromise;
  return db.put('shopping', checkedArray, weekKey);
}
