/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FAF9F5', // Warm ivory / paper base
          light: '#FCFCF9',
          subtle: '#F4F2EB',
          dark: '#EFECE2',
        },
        ink: {
          DEFAULT: '#0F172A', // Deep ink / navy typography
          light: '#1E293B',
          muted: '#475569',
          subtle: '#64748B',
          faint: '#94A3B8',
        },
        gov: {
          teal: '#0D5C56', // Muted institutional teal
          tealDeep: '#064440',
          tealSoft: '#F0F7F6',
          terracotta: '#C2410C', // Restrained saffron / terracotta
          saffron: '#B45309',
          ochre: '#9A3412',
          border: '#E2E0D8', // Soft stone grey divider
          darkBorder: '#C8C5BA',
        },
        risk: {
          critical: {
            text: '#991B1B',
            bg: '#FEF2F2',
            border: '#F87171',
            solid: '#DC2626',
          },
          high: {
            text: '#C2410C',
            bg: '#FFF7ED',
            border: '#FB923C',
            solid: '#EA580C',
          },
          medium: {
            text: '#854D0E',
            bg: '#FEFCE8',
            border: '#FACC15',
            solid: '#CA8A04',
          },
          low: {
            text: '#166534',
            bg: '#F0FDF4',
            border: '#4ADE80',
            solid: '#16A34A',
          }
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        elevated: '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        subtle: '3px',
      }
    },
  },
  plugins: [],
}
