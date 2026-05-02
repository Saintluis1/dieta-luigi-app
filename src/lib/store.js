import { create } from 'zustand';
import { loadSubstitutions, putSubstitution, removeSubstitution } from './db.js';

export const useAppStore = create((set) => ({
  substitutions: {},
  hydrated: false,

  hydrate: async () => {
    const substitutions = await loadSubstitutions();
    set({ substitutions, hydrated: true });
  },

  setSubstitution: (dayId, mealKey, originalId, replacement) => {
    const key = `${dayId}|${mealKey}|${originalId}`;
    set((state) => ({
      substitutions: { ...state.substitutions, [key]: replacement }
    }));
    putSubstitution(key, replacement);
  },

  clearSubstitution: (dayId, mealKey, originalId) => {
    const key = `${dayId}|${mealKey}|${originalId}`;
    set((state) => {
      const next = { ...state.substitutions };
      delete next[key];
      return { substitutions: next };
    });
    removeSubstitution(key);
  },
}));
