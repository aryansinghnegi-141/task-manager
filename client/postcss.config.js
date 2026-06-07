// PostCSS is the CSS post-processor pipeline used by Vite
// It runs each plugin on the CSS output during build
export default {
  plugins: {
    // tailwindcss: scans source files and generates utility classes
    tailwindcss: {},
    // autoprefixer: adds vendor prefixes (e.g. -webkit-) for browser compatibility
    autoprefixer: {},
  },
};
