var wrapper = require('../components/wrapper')
var Header = require('../components/header')
var format = require('../components/format')
var objectValues = require('object-values')
var raw = require('choo/html/raw')
var html = require('choo/html')

var header = new Header()

module.exports = wrapper(view)

function view (state, emit) {
  var page = state.page
  var references = objectValues(state.content['/reference'].pages)
    .map(function (child) {
      return state.content[child.url]
    })

  return html`
    <div>
      <div class="vh100 x xdc">
        ${header.render()}
        <div class="py0-5 tac px1 fc-pinker">
          ${page.subtitle}
        </div>
      </div>
      <div class="w100 wmx1100 mxa">
        ${renderLineHoriz()}
        <div class="x xw">
          ${renderFeatures(page.features)}
        </div>
        ${renderLineHoriz()}
        ${renderSupport({
          link: page.supportlink,
          text: page.support
        })}
      </div>
    </div>
  `
}

function renderReferences (props) {
  return html`
    <div class="x xw xjb fs2 py0-75 px0-5 lh1-25">
      <div class="fc-pinker px0-5">Reference</div>
      <div class="x xw markdown-body px0-5">
        ${props.references.map(function (props, i, arr) {
          return html`<span><a href="${props.url}">${props.title}</a> ${i < arr.length - 1 ? raw(',&nbsp;') : ''}</span>`
        })}
      </div>
    </div>
  `
}

function renderFeatures (features) {
  features = features || [ ]
  return features.reduce(function (result, active, i, arr) {
    result.push(html`
      <div class="c12 sm-c6 p1 psr">
        ${i % 2 === 0 ? lineVert() : ''}
        <div class="fs2 fc-pinker lh1 mb1">
          ${active.title}
        </div>
        <div class="markdown-body">
          ${format(active.text)}
        </div>
      </div>
    `)

    if (i < arr.length - 1) {
      result.push(renderLineHorizMobile())
    }

    return result
  }, [ ])
}

function renderSupport (props) {
  props = props || { }
  return html`
    <div class="c12 x xw fs2 lh1-25">
      <div class="c12 p1">
        <a
          href="${props.link}"
          target="_blank"
          class="xx c12 psr bttn tdn db p0-5 tac"
        >Support the community</a>
      </div>
      <div class="c12 p1 pt0 markdown-body">
        ${format(props.text)}
      </div>
    </div>
  `
}

function lineVert () {
  return html`<div class="c12 psa t0 r0 b0 dn sm-db my1 br2-pinker"></div>`
}

function renderLineHorizMobile () {
  return html`
    <div class="px1 c12 db sm-dn">
      <div class="c12 bb2-pinker"></div>
    </div>
  `
}

function renderLineHoriz () {
  return html`
    <div class="px1">
      <div class="c12 bb2-pinker"></div>
    </div>
  `
}

function footnotes () {
  return html`
    <div class="x xw c12 lh1">
      <a href="#" class="psr tdn fc-black c6 sm-c4 p1 tac bb2-black sm-bb0-black br2-black">
        📖 Handbook
      </a>
      <a href="#" class="psr tdn fc-black c6 sm-c4 p1 tac bb2-black sm-bb0-black br2-black">
        🐦 Twitter
      </a>
      <a href="#" class="psr tdn fc-black c12 sm-c4 p1 tac">
        🔎 Source
      </a>
    </div>
  `
}

function demo (content) {
  return html`
    <a
      href="/example"
      class="psr db tdn c12 vhmx50 sm-vmx100 oh bgc-black z2 oh fs1 sm-fs0-5"
      style="cursor: zoom-in;"
    >
      <div class="markup sm-psa t0 l0 r0 p1 sm-p0-5">
        ${format(content)}
      </div>
    </a>
  `
}

function renderExternal () {
  return html`
    <div class="c12 x p0-5">
      <div class="c6 p0-5">
        <input
          type="text"
          value="npm i choo"
          class="w100 psr fs2 bttn db tac"
          onclick=${selectText}
        />
      </div>
      <div class="c6 p0-5">
        <a
          href="https://github.com/choojs/choo"
          class="w100 psr fs2 bttn db tac"
        >Github</a>
      </div>
    </div>
  `
}
