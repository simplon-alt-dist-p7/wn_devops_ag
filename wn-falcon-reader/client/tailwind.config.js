/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#1F2A44",
                secondary: "#F5F3EE",
                tertiary: "#3A5BA0",
                accent: "#C4473A",
            },
            fontFamily: {
                serif: ["'Source Serif 4'", "serif"],
            },
        },
    },
    plugins: [],
};