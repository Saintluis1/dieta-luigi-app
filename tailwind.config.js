/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       'rgb(var(--bg) / <alpha-value>)',
        surface:  'rgb(var(--surface) / <alpha-value>)',
        surface2: 'rgb(var(--surface2) / <alpha-value>)',
        ink:      'rgb(var(--ink) / <alpha-value>)',
        ink2:     'rgb(var(--ink2) / <alpha-value>)',
        ink3:     'rgb(var(--ink3) / <alpha-value>)',
        line:     'rgb(var(--line) / <alpha-value>)',
        good:     'rgb(var(--good) / <alpha-value>)',
        warn:     'rgb(var(--warn) / <alpha-value>)',
        brand:    'rgb(var(--brand) / <alpha-value>)',
        meal: {
          breakfast: 'rgb(var(--meal-breakfast) / <alpha-value>)',
          snack:     'rgb(var(--meal-snack) / <alpha-value>)',
          lunch:     'rgb(var(--meal-lunch) / <alpha-value>)',
          dinner:    'rgb(var(--meal-dinner) / <alpha-value>)',
          pizza:     'rgb(var(--meal-pizza) / <alpha-value>)'
        }
      },
      fontSize: {
        display:       ['28px', { lineHeight: '32px', fontWeight: '600' }],
        h1:            ['22px', { lineHeight: '28px', fontWeight: '600' }],
        h2:            ['18px', { lineHeight: '24px', fontWeight: '600' }],
        body:          ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-strong': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        small:         ['14px', { lineHeight: '20px', fontWeight: '400' }],
        caption:       ['12px', { lineHeight: '16px', fontWeight: '500' }]
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px'
      }
    }
  },
  plugins: []
};
