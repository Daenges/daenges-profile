const themeDir = __dirname + '/../../';

module.exports = {
  content: [`${themeDir}/layouts/**/*.{html,md}`, `${themeDir}/static/html/**/*.html`],
  theme: {
    extend: {
      keyframes: {
        scrollBackgroundDown : {
          '0%' : { backgroundPosition: '0 0'},
          '100%': { backgroundPosition: '1000% 1000%'}
        }
      },
      animation: {
        scrollBackgroundDown : 'scrollBackgroundDown 3000s linear infinite'
      }
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-heropatterns')({
      // as per tailwind docs you can pass variants
      variants: [],

      // the list of patterns you want to generate a class for
      // the names must be in kebab-case
      // an empty array will generate all 87 patterns
      patterns: ["circuit-board"],

      // The foreground colors of the pattern
      colors: {
       default: "#9C92AC",
       "blue-dark": "#000044" //also works with rgb(0,0,205)
      },

      // The foreground opacity
      opacity: {
        default: "0.4",
        "100": "1.0"
      }
    })
  ]
}

