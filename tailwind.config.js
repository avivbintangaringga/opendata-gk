/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--text-color)",
        tertiary: "#43291a",
        text: "var(--text-color)",
        surface: "var(--surface-a)",
        hover: "var(--surface-hover)",
        border: "var(--surface-border)",
        error: "#e24c4c",

      },
      fontFamily: {
        'title': ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
    },
  plugins: [],
}

