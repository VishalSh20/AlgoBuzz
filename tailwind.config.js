/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";


module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content()
  ],
  theme: {
    extend: {
      colors: {
        "background": "var(--background)",
        "foreground": "var(--foreground)",
        "text-main": "#4ADE80"
      },
    },
  },
  plugins: [ flowbite.plugin()],
};
