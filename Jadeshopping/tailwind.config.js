/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 玉石雅韵主色调配色方案
        jade: {
          50: '#f0fdf4',   // 极浅绿
          100: '#dcfce7',  // 浅绿
          200: '#bbf7d0',  // 浅绿
          300: '#86efac',  // 中浅绿
          400: '#4ade80',  // 中绿
          500: '#22c55e',  // 标准绿
          600: '#16a34a',  // 深绿
          700: '#15803d',  // 更深绿
          800: '#166534',  // 很深绿
          900: '#14532d',  // 最深绿
        },
        sky: {
          50: '#f0f9ff',   // 极浅蓝
          100: '#e0f2fe',  // 浅蓝
          200: '#bae6fd',  // 浅蓝
          300: '#7dd3fc',  // 中浅蓝
          400: '#38bdf8',  // 中蓝
          500: '#0ea5e9',  // 标准蓝
          600: '#0284c7',  // 深蓝
          700: '#0369a1',  // 更深蓝
          800: '#075985',  // 很深蓝
          900: '#0c4a6e',  // 最深蓝
        },
        // 品牌主色调
        primary: {
          50: '#e8f4f8',   // 浅蓝色背景
          100: '#d1e9f1',  // 浅蓝
          200: '#a3d3e3',  // 中浅蓝
          300: '#75bdd5',  // 中蓝
          400: '#47a7c7',  // 深蓝
          500: '#2e8b8b',  // 主色调深蓝绿
          600: '#257070',  // 更深
          700: '#1c5555',  // 很深
          800: '#133a3a',  // 最深
          900: '#0a1f1f',  // 极深
        },
        secondary: {
          50: '#e8f5e8',   // 浅绿色背景
          100: '#d1ebd1',  // 浅绿
          200: '#a3d7a3',  // 中浅绿
          300: '#75c375',  // 中绿
          400: '#47af47',  // 深绿
          500: '#2d8f2d',  // 主色调绿
          600: '#247224',  // 更深
          700: '#1b551b',  // 很深
          800: '#123812',  // 最深
          900: '#091b09',  // 极深
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'jade': '0 4px 14px 0 rgba(46, 139, 139, 0.1)',
        'jade-lg': '0 10px 25px -3px rgba(46, 139, 139, 0.1), 0 4px 6px -2px rgba(46, 139, 139, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
