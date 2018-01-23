var Navigation = require('../components/navigation')
var footer = require('./footer')
var html = require('choo/html')

var navigation = new Navigation()
var title = 'Choo'

module.exports = wrapper

function wrapper (view) {
  return function (state, emit) {
    if (state.title !== title) emit(state.events.DOMTITLECHANGE, title)
    state.page = state.page || { }
    return html`
      <body class="x xjb xdc vhmn100 ff-sans lh1-5 fs1 bgc-pink fc-black">
        ${navigation.render({
          href: state.href || '/',
          border: state.page.navBorder === true,
          placeholder: state.page.navPlaceholder !== false
        })}
        ${view(state, emit)}
        ${footer({
          link: state.content['/'].supportlink,
          text: state.content['/'].footer
        })}
      </body>
    `
  }
}
