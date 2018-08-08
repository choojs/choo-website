var objectKeys = require('object-keys')
var html = require('choo/html')
var raw = require('choo/html/raw')
var format = require('../components/format')
var options = require('../design/options')

module.exports = main

function main (state, emit) {
  return html`
    <div class="p1">
      <div class="p1 tac fs3">
        choo styleguide
      </div>
      ${block({
        title: 'colors',
        content: colors()
      })}
      ${block({
        title: 'headings',
        content: html`
          <div class="p0-5">
            <div class="p0-5 fs3">h1: internal event emitter</div>
            <div class="p0-5 fs2">h2: navigating programmatically</div>
            <div class="p0-5 fs1-5">h3: following links</div>
            <div class="p0-5 fs1 fc-pinker ttu">h4: mutable state</div>
            <div class="p0-5 fs1">p: a tiny little framework</div>
          </div>
        `
      })}
      ${block({
        title: 'body copy',
        content: html`
          <div class="markdown-body mxa copy fs1 p1">
            <h2>Perspiciatis amet</h2>
            <p>Nobis hic eos dolor accusantium cum ullam assumenda eos. Vel voluptatem itaque ipsam nisi accusamus debitis quae eveniet. Eaque iusto quod hic dolorem veritatis sapiente eligendi. Perspiciatis amet suscipit sed non.</p>
          </div>
        `
      })}
      ${block({
        title: 'code blocks',
        content: codeblock()
      })}
      ${block({
        title: 'animation frame',
        content: frame(),
        active: false
      })}
      ${block({
        title: 'markdown formatting',
        content: html`<div class="p1 markdown-body">See <a href="/markdown">/markdown</a></div>`
      })}
    </div>
  `
}

function block (props) {
  if (props.active === false) return
  return html`
    <div>
      <div class="px1 c12">
        <div class="bt2-pinker c12"></div>
      </div>
      <div class="c12 p1 pb0 ttu fs1 lh1 ff-mono fc-pinker">
        ${props.title}
      </div>
      <div class="c12 ${classContent()}">
        ${props.content}
      </div>
    </div>
  `

  function classContent () {
    return typeof props.content === 'string' ? 'p1' : ''
  }
}

function colors () {
  return html`
    <div class="x xw p0-5">
      ${objectKeys(options.colors).map(function (color) {
        var value = options.colors[color]
        return html`
          <div class="c6 x xac md-c3">
            <div class="p0-5 c6 md-c4">
              <div class="psr c12 b1-black">
                <div style="padding-bottom: 100%"></div>
                <div
                  class="psa t0 l0 r0 b0"
                  style="background: ${value}"
                ></div>
              </div>
            </div>
            <div class="p0-5">
              ${color}<br>
              <span class="fc-pinker">${value}</span>
            </div>
          </div>
        `
      })}
    </div>
  `
}

function codeblock () {
  return html`
    <div class="p1 markdown-body">
      ${format(`
\`\`\`
var el = html\`
  <section>
    <div id="first">hello</div>
    <div id="second">world</div> // nice one
  </section>
\`
\`\`\`
      `)}
    </div>
  `
}
function frame () {
  return html`
<div class="frame" style="font-size: Calc(3.75vw)">${raw(`------------------------------------
------------------------------------
----------------choo----------------
------------------------------------
------------------------------------
`)}</div>
`
}
