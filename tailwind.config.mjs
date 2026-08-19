/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--bg-default)',
          subtle: 'var(--bg-subtle)',
          muted: 'var(--bg-muted)',
        },
        surface: {
          DEFAULT: 'var(--surface-default)',
          hover: 'var(--surface-hover)',
          active: 'var(--surface-active)',
          elevated: 'var(--surface-elevated)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
        fg: {
          DEFAULT: 'var(--text-default)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
          inverse: 'var(--text-inverse)',
        },
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#38abf8',
          500: '#0e8fe9',
          600: '#0270c7',
          700: '#0359a1',
          800: '#074c84',
          900: '#0c3f6e',
          DEFAULT: 'var(--brand-primary)',
          accent: 'var(--brand-accent)',
        },
        badge: {
          green: 'var(--badge-green-bg)',
          'green-text': 'var(--badge-green-text)',
          blue: 'var(--badge-blue-bg)',
          'blue-text': 'var(--badge-blue-text)',
          amber: 'var(--badge-amber-bg)',
          'amber-text': 'var(--badge-amber-text)',
          purple: 'var(--badge-purple-bg)',
          'purple-text': 'var(--badge-purple-text)',
        }
      },
      borderRadius: {
        sm: 'var(--radius-sm, 6px)',
        md: 'var(--radius-md, 10px)',
        lg: 'var(--radius-lg, 14px)',
        xl: 'var(--radius-xl, 18px)',
        '2xl': 'var(--radius-2xl, 24px)',
      },
      fontFamily: {
        sans: [
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Cascadia Code',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },
    },
  },
  plugins: [],
};
