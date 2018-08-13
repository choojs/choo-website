var wrapper = require('../components/wrapper')
var html = require('choo/html')

module.exports = wrapper(view)

function view (state, emit) {
  return html`
    <div class="p1">
      404
    </div>
  `
}
