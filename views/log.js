var html = require('choo/html')

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
