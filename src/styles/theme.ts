/**
 * Design tokens for Yew Tree Cleaning.
 * These mirror the CSS custom properties defined in globals.css
 * and can be used in JS/TS contexts where CSS variables are not available.
 */

export const colours = {
  brandGreen: {
    50: '#f0f7f2',
    100: '#d4eadb',
    200: '#b0d9bc',
    300: '#8dc99d',
    400: '#7CB791',
    500: '#5fa078',
    600: '#4a8a62',
    700: '#3a6f4e',
    800: '#2d5a3f',
    900: '#1f4530',
  },
  brandBlue: {
    50: '#eef5fa',
    100: '#d1e4f0',
    200: '#aecfe3',
    300: '#8bbad6',
    400: '#7BAFD4',
    500: '#5e99c4',
    600: '#4683b0',
    700: '#376c94',
    800: '#2b5777',
    900: '#1f425c',
  },
  brandPurple: {
    50: '#f3f1f8',
    100: '#ddd8ed',
    200: '#c5bede',
    300: '#ada4cf',
    400: '#9B8EC4',
    500: '#8577b3',
    600: '#6f62a0',
    700: '#5a4f84',
    800: '#473e69',
    900: '#342e4f',
  },
} as const;

export const fonts = {
  sans: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const borderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

export type ColourScale = typeof colours.brandGreen;
export type ColourShade = keyof ColourScale;
