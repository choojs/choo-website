var Markdown = require('markdown-it')
var raw = require('bel/raw')
var md = Markdown({
  html: true
})

md.use(require('markdown-it-highlightjs'))

module.exports = format

function format (str) {
  return raw(md.render(str || ''))
}
