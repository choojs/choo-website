var wrapper = require('../components/wrapper')
var Header = require('../components/header')
var format = require('../components/format')
var html = require('choo/html')

var header = new Header()

module.exports = wrapper(view)

function view (state, emit) {
  var page = state.page

  return html`
    <div>
      <div class="vh100 x xdc">
        ${header.render()}
        <div class="py0-5 tac px1-5 fc-pinker psr">
          ${page.subtitle}
          <div class="psa b0 r0 py0-5 px1">↓</div>
        </div>
      </div>
      <div class="w100 wmx1100 mxa">
        ${renderLineHoriz()}
        <div class="x xw">
          ${renderFeatures(page.features)}
        </div>
        ${renderLineHoriz()}
        <div class="p1 c12 lh1-25 sm-lh1">
          <div class="fs2 fc-pinker">
            <a href="https://handbook.choo.io/your-first-choo-app/" class="x xac xjb tdn">
              <div>Start with the Handbook</div>
              <div class="psr" style="height: 2rem; width: 2rem">
                <img src="/assets/arrow.svg" class="h100 w100 psa t0 l0 r0 b0 ofct">
              </div>
            </a>
          </div>
        </div>
        ${renderDemo(state.content.demo)}
        ${renderLineHoriz()}
        ${renderSupport({
          link: page.supportlink,
          text: page.support
        })}
      </div>
    </div>
  `
}

function renderFeatures (features) {
  features = features || []
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
  }, [])
}

function renderSupport (props) {
  props = props || { }
  return html`
    <div class="c12 x xw sm-fs1 sm-lh1-5 fs2 lh1-25">
      <div class="c12 sm-c6 p1">
        <a
          href="${props.link}"
          target="_blank"
          class="db w100 psr bttn tdn db py0-5 px2 tac"
        >Support the community</a>
      </div>
      <div class="c12 sm-c6 p1 pt0 sm-pt1 markdown-body">
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

function renderDemo (content) {
  return html`
    <div class="px1 pb1 w100">
      <div class="w100 h100 psr db tdn c12 vh50 oh bgc-white z2 oh fs1">
        <div class="markup sm-psa t0 l0 r0 py0-75 px1 fs0-75">
          ${format(content)}
        </div>
      </div>
    </div>
  `
}
