var html = require('choo/html')
var raw = require('choo/html/raw')

var format = require('../components/format')

module.exports = view

function view (state, emit) {
  return html`
    <div>
      ${masthead()}
    </div>
  `
}

function masthead (props) {
  return html`
    <div class="vh90 bgc-white psr fs2 lh1-25 x xafe">
      <div class="co3 p1 c9">
      </div>
    </div>
  `
}

function content () {
  return html`
    <div class="co3 c9 p1 markdown-body">
    </div>
`
}
