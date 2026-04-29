/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Tambahkan ini buat jaga-jaga
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Tambahkan ini juga
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Dan ini
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}