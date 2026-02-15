/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ef4444", // Bright Red
                "primary-hover": "#dc2626",
                secondary: "#f43f5e", // Rose
                accent: "#fb7185", // Pinkish Rose
                lightbg: "#fef2f2", // Very light red/white
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
                'premium': '0 10px 40px -10px rgba(239, 68, 68, 0.15)',
            }
        },
    },
    plugins: [],
}
