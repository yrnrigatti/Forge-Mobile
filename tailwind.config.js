/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tema Forja - cores inspiradas na forja
        forge: {
          steel: '#1A1A1A',        // Preto aço - fundo principal
          'steel-light': '#2C2C2C', // Cinza aço - fundo secundário
          ember: '#FF6B00',         // Laranja brasa - destaques
          fire: '#E63946',          // Vermelho incandescente - alertas
          metal: '#B0B0B0',        // Cinza metalizado - texto secundário
          light: '#F5F5F5',        // Branco suave - contraste
        },
      },
      fontFamily: {
        'forge': ['Montserrat', 'sans-serif'], // Fonte robusta para o tema
      },
    },
  },
  plugins: [],
}

