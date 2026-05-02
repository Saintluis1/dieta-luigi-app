---
name: dieta-luigi-webapp
description: Build a mobile-first PWA web app for Luigi's personal nutrition plan. Use this skill whenever the user asks to create, extend, modify, or debug the diet web app — including features like swapping foods with equivalent alternatives, tracking what was eaten on a given day, generating dynamic shopping lists, viewing the weekly meal plan, or any new feature on top of this app. Trigger this skill even when the user says things like "aggiungi una funzione", "fai un componente per…", "voglio una pagina che…", "modifica la web app della dieta" — anything that touches Luigi's diet app belongs here. The skill ships with the full meal plan, the alternatives database, and the patient's anthropometric data already structured as JSON, plus React/Tailwind component patterns ready to drop in.
---

# Dieta Luigi — Web App Skill

## What this skill is for

Build and extend a Progressive Web App (PWA) for **Luigi Lafiandra's personal nutrition plan**. The app helps Luigi:

1. **Consult the weekly meal plan** day by day, meal by meal
2. **Swap any food** for an equivalent alternative from the dietitian-approved list (with correct gram-to-gram conversion: 100 g of banana ≠ 100 g of strawberries)
3. **Track what he actually ate** against what was planned
4. **Generate a dynamic shopping list** that recalculates when alternatives are chosen

The app is **mobile-first** (Luigi uses it on his phone, often in the kitchen or supermarket) and must work as a **PWA** so it installs on the home screen and works offline.

## Architecture decisions (already made — don't relitigate)

- **Stack**: React 18 + Vite + Tailwind CSS + IndexedDB (via `idb` library) for offline persistence. No backend — fully client-side.
- **Routing**: React Router v6 with bottom-tab navigation (Plan / Track / Shopping / Profile).
- **State**: Zustand for app state, IndexedDB for the tracking history.
- **PWA**: `vite-plugin-pwa` with offline-first service worker.
- **Language**: All UI strings in **Italian** — Luigi is Italian.
- **Units**: Always grams. Always at-crudo (raw weight, net of waste) — match the dietitian's convention.
- **No external API calls** required. All data ships bundled.

If the user wants to deviate from this stack (e.g., "use Vue instead"), confirm before proceeding — the skill's data files and patterns assume the stack above.

## The data files (read these first)

Before writing any code, read the relevant data files from `references/`:

- **`references/meal-plan.json`** — Luigi's full weekly plan: 7 days × 5 meals × ingredients with grams. Use this as the source of truth for what Luigi should eat.
- **`references/alternatives.json`** — The substitution database from `alternative.pdf`. Three categories: `snack` (fruit + 2/7-times items like nuts/yogurt/dark chocolate), `protein` (fish + lean meats), `vegetable` (interchangeable contorni). Each item has its specific gram amount. **Critical**: substitutions are NOT 1:1 in grams — the dietitian sets per-food grammage to match calories/macros.
- **`references/patient.json`** — Luigi's anthropometric data, BMR, BMI, target weight, body composition from the BIA. Use for the Profile screen and any progress tracking.
- **`references/diet-rules.md`** — The dietitian's "regole d'oro" (golden rules): no frying, 2 L water, vegetables mandatory at lunch and dinner, Saturday pizza protocol, etc. Surface these in-app where relevant (tooltips, info pages).

The shape of each file is documented inside it as a JSON-schema-like comment block at the top. **Don't invent fields** — if you need data that isn't there, ask Luigi (the user) before extending the schema.

## Substitution logic (the trickiest part — read carefully)

When Luigi taps "swap this food", the app must offer alternatives **from the same category and meal slot**. The grammage of the alternative is **the alternative's own grammage**, not the original food's. Example:

- Plan says: `pollo disossato 200 g` (cena, lunedì)
- Luigi wants to swap → show all items from `alternatives.protein` filtered by `meal: ["pranzo", "cena"]`
- He picks `salmone fresco` → the new entry is `salmone fresco 200 g` (salmon's own grammage), not `pollo 200 g → salmone 200 g` mechanically.

For frutta the variation is wider: banana = 100 g, fragole = 200 g, cocomero = 350 g. The UI must clearly show the correct grammage for each option so Luigi doesn't get confused.

The 2/7 items in `snack` category (frutta secca, yogurt magro, cioccolato fondente) carry a `frequency` field — show a small badge "max 2 volte/settimana" and ideally track usage in the tracking module.

For implementation patterns of the swap modal, see `references/component-patterns.md` → "Swap modal".

## Shopping list logic

The shopping list is computed from:

1. The **base plan** (`meal-plan.json`)
2. **Active substitutions** for the current week (Luigi may have swapped some foods — those overrides live in IndexedDB)
3. **Reparto grouping** (pescheria, macelleria, ortofrutta, dispensa, panetteria, latticini-uova, pizzeria-sabato)

Each ingredient in `meal-plan.json` and `alternatives.json` carries a `reparto` field — use it to group. The shopping list aggregates grammage across the week (e.g., if pasta semola appears Mon 70 g + Wed 100 g + Fri 70 g + Sat 60 g + Sun 100 g, the list shows `Pasta semola 400 g`).

When Luigi checks an item as "bought", persist that to IndexedDB (week-scoped — resets every Monday). For the algorithm, see `references/component-patterns.md` → "Shopping list aggregator".

## Tracking logic

For each day, Luigi can mark each meal as:
- `planned` (default — he ate what was planned)
- `swapped` (he used an alternative — store which one)
- `skipped` (didn't eat it)
- `off-plan` (ate something else — free-text note)

Persist all entries with date keys (`YYYY-MM-DD`) in IndexedDB so a Profile/History screen can show streaks, adherence rate, and weekly summaries. Don't display calorie counts or judgmental messaging — Luigi has a dietitian for that. The app is descriptive, not prescriptive.

## Mobile-first design rules

These are non-negotiable for this app — Luigi uses it one-handed on the phone:

- **Minimum tap target**: 44 × 44 px (Apple HIG).
- **Bottom-tab navigation** — never put primary nav at the top on mobile.
- **No hover states** as the only signal — touch devices don't have hover.
- **Big, readable type** — base font-size 16 px (iOS won't auto-zoom inputs at 16 px+).
- **Sticky day selector** at the top of the Plan screen so Luigi can switch days without losing context.
- **Use `font-feature-settings: "tnum"` for grams** — tabular numbers prevent layout shift when values change.
- **Dark mode**: respect `prefers-color-scheme`. Kitchen lighting varies.
- Test the layout at **iPhone SE width (375 px)** — that's the floor.

The full design token set (colors, spacing, typography) is in `references/design-system.md`. Use those tokens — do not invent ad-hoc colors.

## Component patterns

For each major UI surface, a ready-to-adapt React + Tailwind pattern is in `references/component-patterns.md`:

- Day selector (sticky horizontal scroll)
- Meal card (with swap button)
- Swap modal (alternatives picker with correct grammage)
- Shopping list section (grouped by reparto with aggregation)
- Tracking entry sheet (planned/swapped/skipped/off-plan)
- Bottom-tab nav
- PWA install prompt

Don't reinvent these — adapt from the file. They follow the design system and the mobile rules above.

## Project scaffold

When the user asks to **create the app from scratch**, run the scaffold script:

```bash
python scripts/scaffold.py /path/to/output-directory
```

This generates a working Vite + React + Tailwind + PWA project pre-loaded with all the data files, the routing skeleton, and the bottom-tab nav. The user can then `cd` in, run `npm install && npm run dev`, and start building features on top.

For **incremental changes** (adding one component, fixing one screen), don't run the scaffold — just write the code directly using the patterns from `references/component-patterns.md`.

## What to do for common requests

| User says | What to do |
|---|---|
| "Crea la web app" / "Iniziamo da zero" | Run `scripts/scaffold.py`, explain what was generated, point to the dev server command. |
| "Aggiungi la schermata X" | Read `component-patterns.md`, write the React component, wire it into the router, show the diff. |
| "Voglio cambiare il design" | Read `design-system.md` first, then propose changes that respect the tokens — don't break the system. |
| "Aggiungi un alimento alla lista alternative" | Edit `references/alternatives.json` AND the bundled copy in the app — the JSON is the source of truth, but the app ships its own copy. |
| "Cambia la dieta del [giorno]" | Edit `references/meal-plan.json` AND the bundled copy. Keep the schema. |
| "Fai funzionare offline" | The PWA scaffold already does this. Verify the service worker is caching the data files and the tracking IndexedDB store is initialized. |

## Things to avoid

- **Don't add calorie or macro tracking** unless explicitly asked. The dietitian's plan is calibrated; second-guessing it in-app is out of scope.
- **Don't add login/multi-user**. Single-user app, on-device.
- **Don't suggest sending data to a server**. Privacy: this is medical-adjacent personal data. On-device only.
- **Don't translate the UI to English** unless explicitly asked. Italian is the language.
- **Don't overwrite Luigi's tracking history** when meal-plan.json is edited. Tracking entries reference the date, not the plan version.

## Quick start for the assistant

When this skill triggers:

1. Read the relevant `references/*` files for the task at hand.
2. If creating from scratch → run scaffold script.
3. If modifying → write a focused, surgical change, show the diff, explain what changed and why.
4. Always preserve the mobile-first constraints and the design tokens.
5. Test mentally at 375 px width before declaring done.
