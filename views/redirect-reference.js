var html = require('choo/html')

module.exports = function (state, emit) {
  var route = state.params.wildcard
    ? `/docs/${state.params.wildcard}`
    : '/docs'

  emit('replaceState', route)
  setTimeout(() => emit('render'), 0) // NOTE: this is a bug in Choo

  return html`<body class="bgc-pink fc-pinker">
      Redirecting to ${route}
    </body>`
}
