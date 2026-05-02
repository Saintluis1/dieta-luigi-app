# Design System — Dieta Luigi

Mobile-first, kitchen-friendly, single-user. Inspired by iOS Health and good Italian food publishing (clean serif accents, generous whitespace, restrained color).

## Principles

1. **Glanceable** — Luigi opens the app with one hand while holding a shopping basket. Information must be readable in <2 seconds.
2. **Zero anxiety** — no calorie counts, no "you're behind" warnings, no streaks-as-pressure. The app describes; the dietitian prescribes.
3. **Trust the data** — grammage is sacred; never round visually below 5 g.
4. **Italian aesthetics** — warm neutrals, not cold tech grays. Avoid "fitness app" vibes (no neon, no aggressive gradients).

## Color tokens

Use Tailwind's CSS variables via `tailwind.config.js`. Both light and dark mode mandatory.

```js
// tailwind.config.js — colors section
colors: {
  // Surfaces
  bg:       'rgb(var(--bg) / <alpha-value>)',         // main background
  surface:  'rgb(var(--surface) / <alpha-value>)',    // cards
  surface2: 'rgb(var(--surface2) / <alpha-value>)',   // raised, sticky headers

  // Text
  ink:        'rgb(var(--ink) / <alpha-value>)',       // primary
  ink2:       'rgb(var(--ink2) / <alpha-value>)',      // secondary
  ink3:       'rgb(var(--ink3) / <alpha-value>)',      // tertiary / hints

  // Borders
  line:       'rgb(var(--line) / <alpha-value>)',

  // Meal accents (used as soft backgrounds, never as primary text on white)
  meal: {
    breakfast: 'rgb(var(--meal-breakfast) / <alpha-value>)', // amber
    snack:     'rgb(var(--meal-snack) / <alpha-value>)',     // sage green
    lunch:     'rgb(var(--meal-lunch) / <alpha-value>)',     // sky blue
    dinner:    'rgb(var(--meal-dinner) / <alpha-value>)',    // soft purple
    pizza:     'rgb(var(--meal-pizza) / <alpha-value>)',     // warm coral (saturday)
  },

  // Semantic
  good:    'rgb(var(--good) / <alpha-value>)',    // adherence ok
  warn:    'rgb(var(--warn) / <alpha-value>)',
  brand:   'rgb(var(--brand) / <alpha-value>)',   // ONE accent — used sparingly
}
```

### CSS variable values

```css
/* index.css */
:root {
  --bg: 250 248 242;          /* warm off-white */
  --surface: 255 255 255;
  --surface2: 246 243 235;
  --ink: 28 26 22;
  --ink2: 89 84 77;
  --ink3: 154 148 138;
  --line: 230 224 213;

  --meal-breakfast: 250 238 218;  /* amber 50 */
  --meal-snack: 234 243 222;       /* sage */
  --meal-lunch: 230 241 251;       /* sky */
  --meal-dinner: 238 237 254;      /* lilac */
  --meal-pizza: 250 236 231;       /* coral */

  --good: 99 153 34;       /* green 600 */
  --warn: 186 117 23;      /* amber 600 */
  --brand: 27 94 53;       /* deep olive — Italian, not tech */
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: 18 17 15;
    --surface: 28 26 22;
    --surface2: 38 35 30;
    --ink: 245 242 235;
    --ink2: 178 172 162;
    --ink3: 128 122 112;
    --line: 56 52 46;

    --meal-breakfast: 65 36 2;
    --meal-snack: 39 80 10;
    --meal-lunch: 12 68 124;
    --meal-dinner: 60 52 137;
    --meal-pizza: 113 43 19;

    --good: 151 196 89;
    --warn: 239 159 39;
    --brand: 168 200 130;
  }
}
```

### Color use rules
- Meal accents are **backgrounds only**, never primary text color. For text on a meal-tinted card, use `text-ink`.
- `brand` is the ONE accent — used for primary buttons and the active tab indicator. Never decorative.
- Avoid pure black (`#000`) and pure white (`#fff`) as text colors. Use `ink` and `bg`.

## Typography

System font stack — fast, native, free.

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter',
             system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
```

For numbers (grams, weight, %), apply tabular figures to prevent layout shift:

```css
.tabular { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }
```

### Type scale (mobile-first, base 16px)

| Token | Size | Line | Weight | Use |
|---|---|---|---|---|
| `display` | 28px | 1.15 | 600 | Day label "Lunedì" |
| `h1` | 22px | 1.25 | 600 | Screen titles |
| `h2` | 18px | 1.3 | 600 | Section headers (Pranzo, Cena) |
| `body` | 16px | 1.5 | 400 | Default — also prevents iOS zoom on input focus |
| `body-strong` | 16px | 1.5 | 500 | Food names |
| `small` | 14px | 1.45 | 400 | Secondary info, gram counts on chips |
| `caption` | 12px | 1.4 | 500 | Labels, badges |

```css
/* Tailwind extension */
fontSize: {
  display:     ['28px',  { lineHeight: '32px', fontWeight: '600' }],
  h1:          ['22px',  { lineHeight: '28px', fontWeight: '600' }],
  h2:          ['18px',  { lineHeight: '24px', fontWeight: '600' }],
  body:        ['16px',  { lineHeight: '24px', fontWeight: '400' }],
  'body-strong':['16px', { lineHeight: '24px', fontWeight: '500' }],
  small:       ['14px',  { lineHeight: '20px', fontWeight: '400' }],
  caption:     ['12px',  { lineHeight: '16px', fontWeight: '500' }],
}
```

## Spacing

4-px grid (Tailwind default already does this).
- Card internal padding: `p-4` (16 px).
- Card-to-card gap: `gap-3` (12 px).
- Screen edge padding: `px-4` (16 px) on phones, `px-6` (24 px) on ≥640 px.
- Bottom safe area: always reserve `pb-[env(safe-area-inset-bottom)]` plus the bottom-tab height (64 px).

## Radii & elevation

- Cards: `rounded-2xl` (16 px) — generous, modern.
- Pills/chips: `rounded-full`.
- Buttons: `rounded-xl` (12 px).
- **No drop shadows on cards.** Use a 1px `border-line` instead — flatter, more elegant, no GPU cost.
- The ONE shadow allowed: bottom-tab nav `shadow-[0_-1px_0_rgb(var(--line))]` (a hairline top border, not a soft shadow).

## Tap targets

- Minimum **44 × 44 px** for any interactive element. Use `min-h-11 min-w-11` and add invisible padding if the visual element is smaller.
- Buttons: default height 48 px (`h-12`).
- List rows: 56 px minimum (`min-h-14`).

## Motion

- Tab switches: instant. No transition.
- Modal/bottom-sheet: 200 ms ease-out for opening, 150 ms ease-in for closing.
- Respect `prefers-reduced-motion: reduce` — disable all transitions.

## Iconography

Use **lucide-react** (already in our stack). Icon size 20 px in lists, 24 px in buttons, 28 px for tab bar.

Recommended icons:
- Plan tab: `CalendarDays`
- Track tab: `CheckCircle2`
- Shopping tab: `ShoppingBasket`
- Profile tab: `User`
- Swap action: `ArrowLeftRight` (NOT a generic refresh — be explicit)
- Info: `Info`
- Add custom: `Plus`

## Accessibility

- Color contrast: every text/background pair ≥ AA (4.5:1 for body, 3:1 for large text). Verified for both light and dark.
- `lang="it"` on `<html>`.
- All buttons need an accessible name (visible label or `aria-label`).
- Bottom-tab nav uses `<nav role="navigation" aria-label="Navigazione principale">` with `<button aria-current="page">` for the active tab.
- All form inputs labeled.
- Modals trap focus and restore focus on close.

## What NOT to do

- ❌ Hamburger menu — use bottom tabs.
- ❌ Carousels for primary content — Luigi's grocery list shouldn't require swiping to find items.
- ❌ Animations longer than 250 ms — feels sluggish on phones.
- ❌ Toast notifications for routine confirmations — rely on visual state changes (checkmark, color shift).
- ❌ Pixel-perfect glassmorphism / neumorphism — fragile on Android, dated.
- ❌ Loading spinners as the whole screen — show skeleton states for the actual content shape.
