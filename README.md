# Dieta Luigi

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
