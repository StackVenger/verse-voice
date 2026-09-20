/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NOTE: do not add a colour called `base`, `xs`, `sm`, `lg` or `xl`.
        // Tailwind builds `text-<colour>` utilities from these, which collide
        // with the built-in font-size utilities of the same name and win — a
        // colour named `base` turned every `text-base` into
        // `color: var(--bg-base)`, painting the text the page background in
        // both themes. `bg-base` was never used, so the entry only did harm.
        raised: 'var(--bg-raised)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        hover: 'var(--bg-hover)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
