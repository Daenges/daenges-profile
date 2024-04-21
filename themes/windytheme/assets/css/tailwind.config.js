const themeDir = __dirname + '/../../';

module.exports = {
  content: [`${themeDir}/layouts/**/*.{html,md}`, `${themeDir}/static/html/**/*.html`],
  theme: {
    extend: {}
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ]
}

