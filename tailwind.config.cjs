/** @type {import('tailwindcss').Config} */

 // 1 CONTENT, aqui definimos las rutas de los archivos donde  usare clases de tailwind
// toda ruta que no se agregue aqui no sera procesada por tailwind y no se aplicaran los estilos

//2 THEME, personalizo el tema visual de mi aplicacion
//PLUGINS, importo complementos oficiales o de terceros de tailwind, @tailwindcss/forms para mejorar formularios


module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#000022',
        'brand-secondary': '#1e293b',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}