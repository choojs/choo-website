var wrapper = require('../components/wrapper')
var format = require('../components/format')
var html = require('choo/html')

module.exports = wrapper(main)

function main (state, emit) {
  return html`
    <div>
      <div class="bgc-pinker fc-pink vhmn50 x xdc xjb">
        <div></div>
        <div class="w100 wmx1100 mxa">
          <div class="p1 fs4 lh1">
            ${state.page.title}
          </div>
        </div>
      </div>
      <div class="w100 wmx1100 mxa p1">
        <div class="markdown-body copy-content">${format(state.page.text)}</div>
      </div>
    </div>
  `
}
