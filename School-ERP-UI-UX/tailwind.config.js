/** School ERP design tokens (spec Appendix A, "Patshala") */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0E5A63', dark: '#08393F', tint: '#E3EFEF', soft: '#9CC3C4', disabled: '#9DB5B5', row: '#F4F9F9' },
        gold: '#E9B872',
        nav: { bg: '#12302D', active: '#21524C', text: '#D5E4E0', muted: '#A9C2BD', divider: '#24504A', dot: '#3E6A64' },
        page: '#F5F6F3',
        surface: { DEFAULT: '#FFFFFF', subtle: '#F9FAF8', head: '#F2F4F2', segmented: '#E7EBE8', column: '#ECEFEC', placeholder: '#EEF1EE' },
        ink: { DEFAULT: '#17201D', secondary: '#4F5B57', body2: '#3B4643' },
        line: { DEFAULT: '#DDE2DE', input: '#C9D1CD', row: '#EEF1EF', track: '#E1E6E3' },
        warning: { bg: '#FFF6EC', border: '#EBC99C', text: '#7A4106', strong: '#5E3305', inline: '#8F4A09', accent: '#B4610E', chart: '#C2701A', cell: '#D9822B' },
        success: { bg: '#E4F1E8', text: '#1E5A33' },
        tag: { bg: '#F1EEE6', text: '#5A4A24' },
        attendance: { P: '#0E5A63', A: '#B4610E', L: '#5B8E90', HD: '#6D6A5E', LT: '#8C6B1F', holiday: '#E6E9E7' },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        micro: ['11.5px', '1.4'], caption: ['12px', '1.4'], small: ['13px', '1.5'], body: ['14px', '1.5'],
        input: ['15px', '1.5'], h2: ['16px', '1.4'], title: ['26px', '1.2'], display: ['38px', '1.15'], kpi: ['30px', '1.1'],
      },
      borderRadius: { control: '8px', small: '6px', panel: '10px', card: '12px', 'card-m': '14px', hero: '16px' },
      spacing: { sidebar: '232px', topbar: '64px', tap: '44px' },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [],
};
