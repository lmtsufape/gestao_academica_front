// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // inclua os caminhos dos seus componentes/pages
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F1F5',
          100: '#B8D4E1',
          300: '#66A3BF',
          500: '#1A759F',
          700: '#125371',
          900: '#0B3143',
        },
        secondary: {
          50: '#EAEFF1',
          100: '#BECED5',
          300: '#7294A4',
          500: '#125371',
          700: '#204354',
          900: '#132832',
        },
        neutrals: {
          50: '#F2F5F7',
          100: '#E4EAED',
          200: '#BCC8CE',
          300: '#9FAEB5',
          400: '#84949C',
          500: '#6C7B82',
          600: '#556369',
          700: '#2C3438',
          800: '#1E2629',
          900: '#151C1F',
        },
        success: {
          50: '#E8F5EA',
          100: '#B8E1BD',
          300: '#66BF70',
          500: '#1A9F2A',
          700: '#12711E',
          900: '#0B4312',
        },
        warning: {
          50: '#F5F2E8',
          100: '#E1D6B8',
          300: '#BFA766',
          500: '#9F7C1A',
          700: '#715812',
          900: '#43340B',
        },
        danger: {
          50: '#F5EAE8',
          100: '#E1BDB8',
          300: '#BF7066',
          500: '#9F2A1A',
          700: '#711E12',
          900: '#43120B',
        },
        extra: {
          50: '#972E3F',
          100: '#393C47',
          150: '#AB3447',
        },
      },
      fontSize: {
        // Tipografia baseada no style guide
        'display-large': ['57px', { lineHeight: '64px', letterSpacing: '-0.25px', fontWeight: '600', fontFamily: 'Lato' }],
        'display-medium': ['45px', { lineHeight: '52px', letterSpacing: '0px', fontWeight: '600', fontFamily: 'Lato' }],
        'display-small': ['36px', { lineHeight: '44px', letterSpacing: '0px', fontWeight: '600', fontFamily: 'Lato' }],
        'headline-large': ['32px', { lineHeight: '40px', letterSpacing: '0px', fontWeight: '600', fontFamily: 'Lato' }],
        'headline-medium': ['28px', { lineHeight: '36px', letterSpacing: '0px', fontWeight: '600', fontFamily: 'Lato' }],
        'headline-small': ['24px', { lineHeight: '32px', letterSpacing: '0px', fontWeight: '600', fontFamily: 'Lato' }],
        'title-large': ['22px', { lineHeight: '28px', letterSpacing: '0px', fontWeight: '400', fontFamily: 'Lato' }],
        'title-medium': ['16px', { lineHeight: '24px', letterSpacing: '0.15px', fontWeight: '600', fontFamily: 'Lato' }],
        'title-small': ['14px', { lineHeight: '20px', letterSpacing: '0.1px', fontWeight: '600', fontFamily: 'Lato' }],
        'label-large': ['14px', { lineHeight: '20px', letterSpacing: '0.1px', fontWeight: '600', fontFamily: 'Lato' }],
        'label-medium': ['12px', { lineHeight: '16px', letterSpacing: '0.5px', fontWeight: '600', fontFamily: 'Lato' }],
        'label-small': ['11px', { lineHeight: '16px', letterSpacing: '0.5px', fontWeight: '600', fontFamily: 'Lato' }],
        'body-large': ['16px', { lineHeight: '24px', letterSpacing: '0.5px', fontWeight: '400', fontFamily: 'Lato' }],
        'body-medium': ['14px', { lineHeight: '20px', letterSpacing: '0.25px', fontWeight: '400', fontFamily: 'Lato' }],
        'body-small': ['12px', { lineHeight: '16px', letterSpacing: '0.4px', fontWeight: '400', fontFamily: 'Lato' }],
      },
    },
  },
  plugins: [],
};
