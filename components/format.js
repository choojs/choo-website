var Markdown = require('markdown-it')
var hljs = require('highlight.js/lib/highlight')
var raw = require('bel/raw')
var md = Markdown({
  html: true
})

hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'))
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'))

md.use(highlighter)

module.exports = format

function format (str) {
  return raw(md.render(str || ''))
}

function highlighter (md, opts) {
  md.options.highlight = highlight
  var rules = md.renderer.rules
  rules.fence = wrap(rules.fence)
  rules.code_block = wrap(rules.code_block)

  function highlight (code, lang) {
    var result = null
    if (lang && hljs.getLanguage(lang)) {
      result = hljs.highlight(lang, code, true)
    } else {
      result = hljs.highlightAuto(code)
    }
    return result ? result.value : ''
  }

  function wrap (render) {
    return function () {
      return render.apply(this, arguments)
        .replace(/<code class="/g, '<code class="hljs ')
        .replace(/<code>/g, '<code class="hljs">')
    }
  }
}
