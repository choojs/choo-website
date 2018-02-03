var wrapper = require('../components/wrapper')
var objectValues = require('object-values')
var format = require('../components/format')
var html = require('choo/html')

module.exports = wrapper(main)

function main (state, emit) {
  var pages = objectValues(state.content['/docs'].pages).map(function (child) {
    return state.content[child.url]
  })

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
      ${lineHoriz()}
      ${renderFooter()}
    </div>
  `

  function renderFooter () {
    return html`
      <div class="x xw w100">
        ${renderPages(pages)}
      </div>
    `
  }
}

function renderPages (features) {
  features = features || [ ]
  return features.reduce(function (result, active, i, arr) {
    result.push(html`
      <a href="${active.url}" class="c12 sm-c6 p1 tdn psr">
        ${i % 2 === 0 ? lineVert() : ''}
        <div class="fs2 fc-pinker lh1 mb1">
          ${active.title}
        </div>
        <div class="markdown-body">
          ${format(active.excerpt)}
        </div>
      </a>
    `)

    if (i < arr.length - 1) {
      result.push(lineHorizMobile())
    }

    if ((i + 1) % 2 === 0 && i < arr.length - 1) {
      result.push(lineHoriz())
    }

    return result
  }, [ ])
}

function lineVert () {
  return html`<div class="c12 psa t0 r0 b0 dn sm-db my1 br2-pinker"></div>`
}

function lineHorizMobile () {
  return html`
    <div class="px1 c12 db sm-dn">
      <div class="c12 bb2-pinker"></div>
    </div>
  `
}

function lineHoriz () {
  return html`
    <div class="c12 px1 dn sm-db">
      <div class="c12 bb2-pinker"></div>
    </div>
  `
}
