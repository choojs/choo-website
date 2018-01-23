var html = require('choo/html')

module.exports = footer

function footer (props) {
  if (!props.text) return
  return html`
    <div class="bgc-pinker fc-pink p0-5">
      <div class="c12 p0-5 tac">
        ${props.text.map(function (line) {
          return html`<div>${line}</div>`
        })}
      </div>
    </div>
  `
}