/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names
  // Only classes found here will be included in the production CSS bundle
  content: [
    "./index.html",           // the HTML entry point
    "./src/**/*.{js,jsx}",    // all JS and JSX files in src and its subdirectories
  ],

  // Extend Tailwind's default theme with custom design tokens
  theme: {
    extend: {
      // Custom font families — loaded via Google Fonts in index.html
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],   // elegant serif for headings
        body: ["'DM Sans'", "system-ui", "sans-serif"],        // clean sans-serif for body
        mono: ["'JetBrains Mono'", "monospace"],               // mono for code/IDs
      },

      // Custom colour palette extending the Tailwind default palette
      colors: {
        // Warm cream tones for the background and cards
        cream: {
          50: "#fdfbf7",
          100: "#faf5eb",
          200: "#f5ecdb",
        },
        // Muted sage green for accents and interactive elements
        sage: {
          400: "#87a989",
          500: "#6b9070",
          600: "#517358",
        },
        // Deep charcoal for text
        charcoal: {
          700: "#2d3748",
          800: "#1a202c",
          900: "#0f1419",
        },
      },

      // Custom animation keyframes for subtle UI motion
      keyframes: {
        // Fade + slide-up entrance animation for task cards
        "slide-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Gentle pulse for loading indicators
        shimmer: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },

      // Register the custom keyframes as usable animation utilities
      animation: {
        "slide-in": "slide-in 0.25s ease-out forwards", // applied to new task cards
        shimmer: "shimmer 1.5s ease-in-out infinite",   // applied to skeleton loaders
      },
    },
  },

  // No additional Tailwind plugins are required for this project
  plugins: [],
};
