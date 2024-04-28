const themeDir = __dirname + '/../../';

module.exports = {
  content: [`${themeDir}/layouts/**/*.{html,md}`, `${themeDir}/static/html/**/*.html`],
  theme: {
    extend: {
      keyframes: {
        scrollBackgroundDown : {
          '0%' : { backgroundPosition: '0 0'},
          '100%': { backgroundPosition: '200vw 200vh'}
        }
      },
      animation: {
        scrollBackgroundDown : 'scrollBackgroundDown 240s linear infinite'
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
      patterns: ["circuit-board", "graph-paper"],

      // The foreground colors of the pattern
      colors: {
      },

      // The foreground opacity
      opacity: {
        default: "0.4",
        "100": "1.0"
      }
    })
  ]
}

