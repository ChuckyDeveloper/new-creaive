import type { Config } from "tailwindcss";

const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1600px",

        tablet: "640px",
        laptop: "1024px",
        desktop: "1280px",
      },
      fontSize: {},
      fontFamily: {
        unitea: ["Unitea", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        fadeSlideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        fadeSlideUp: "fadeSlideUp 0.25s ease-out",
        marquee: "marquee 40s linear infinite",
      },
      colors: {
        primary: {
          0: "#782a90",
          100: "#e4d4e9",
          200: "#c9aad3",
          300: "#ae7fbc",
          400: "#9355a6",
          500: "#782a90",
          600: "#602273",
          700: "#481956",
          800: "#30113a",
          900: "#18081d",
        },
        secondary: {
          0: "#0e113f",
          100: "#cfcfd9",
          200: "#9fa0b2",
          300: "#6e708c",
          400: "#3e4165",
          500: "#0e113f",
          600: "#0b0e32",
          700: "#080a26",
          800: "#060719",
          900: "#03030d",
        },
        complementary: {
          0: "#47c2cb",
          100: "#daf3f5",
          200: "#b5e7ea",
          300: "#91dae0",
          400: "#6cced5",
          500: "#47c2cb",
          600: "#399ba2",
          700: "#2b747a",
          800: "#1c4e51",
          900: "#0e2729",
        },
        neutrals: {
          100: "#fefefe",
          200: "#fdfdfd",
          300: "#fcfcfc",
          400: "#fbfbfb",
          500: "#fafafa",
          600: "#c8c8c8",
          700: "#969696",
          800: "#646464",
          900: "#323232",
        },
        parimaryDark: {
          0: "#BF5AF2",
        },
        secondaryDark: {
          0: "#0A84FF",
        },
        grayDefaultLight: {
          0: "#8e8e93",
          100: "#aeaeb2",
          200: "#c7c7cc",
          300: "#d1d1d6",
          400: "#e5e5ea",
          500: "#f2f2f7",
        },
        grayDefaultDark: {
          0: "#8e8e93",
          100: "#636366",
          200: "#48484a",
          300: "#3a3a3c",
          400: "#2c2c2e",
          500: "#1c1c1e",
        },

        success: {
          0: "#4caf50",
          100: "#4caf50",
          200: "#45a049",
          300: "#357b38",
        },
        warning: {
          0: "#ff9800",
          100: "#ffddaa",
          200: "#ffba55",
          300: "#b36a00",
        },
        error: {
          0: "#ef5350",
          100: "#fac6c5",
          200: "#f48c8a",
          300: "#cb1613",
        },
      },
    },
  },
  plugins: [],
});

export default config;
