// @ts-check
import { withUt } from "uploadthing/tw";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        slide: 'slide var(--animation-duration, 30s) linear infinite',
        shimmer: "shimmer 3.5s infinite",
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-33.33%)' },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [
    // @ts-ignore
    require('daisyui')
  ],
  
  daisyui: {
    themes: ["black","lofi"]
  },
};

export default withUt(config);