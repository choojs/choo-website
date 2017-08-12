var jsSyntax = require('highlight-syntax/js')
var Highlight = require('highlight-syntax')
var nanobeacon = require('nanobeacon')
var html = require('choo/html')
var css = require('sheetify')
var choo = require('choo')
var log = require('choo-log')
var path = require('path')
var fs = require('fs')

if (typeof window === 'object') {
  window.addEventListener('DOMContentLoaded', function () {
    nanobeacon('https://analytics.choo.io', { type: 'load' })
  }, false)

  window.addEventListener('unload', function () {
    nanobeacon('https://analytics.choo.io', { type: 'unload' })
  }, false)
}

var highlight = Highlight([ jsSyntax ])

css('tachyons')
css('vhs/css/vhs.css')
css('highlight-syntax-pastel')
var bodyStyles = css`:host { background-color: #ffc0cb }`
var heroStyles = css`:host { background: linear-gradient(to top, #fff 50%, #ffc0cb) }`

var app = choo()
app.use(log())
app.route('/', mainView)

if (!module.parent) app.mount('body')
else module.exports = app

function mainView () {
  return html`
    <body class="${bodyStyles} sans-serif">
      ${toHtml(fs.readFileSync(path.join(__dirname, 'sprite.svg'), 'utf8'))}
      ${Main()}
      ${Principles()}
      ${Usage()}
      ${Start()}
      ${Sponsors()}
      ${Footer()}
    </body>
  `
}

function Main () {
  return html`
    <main class="${heroStyles} cf pt4 pt5-l ph4 ph5-l center tc">
      ${Logo('sturdy frontend framework')}
      <div class="f5 lh-copy vhs-top vhs-delay-5 center">
        ${tiny('tiny API')}
        ${tiny('performs well')}
        ${tiny('4kb in size')}
        ${tiny('v impressive')}
      </div>
      ${Description()}
      ${Example()}
    </main>
  `

  function tiny (text) {
    return html`
      <div class="dib-ns ph4-ns">
        ${text}
      </div>
    `
  }
}

function Example () {
  var codeMargin = css`
    /* this css is super gross; let's move onto tachyons when possible */
    :host {
      margin-left: -2em;
      margin-right: -2em;
    }
    @media screen and (min-width: 30em) {
      :host {
        margin-left: 0;
        margin-right: 0;
      }
    }
  `
  var code = html`
    <pre class="lh-copy mt0-ns db bg-dark-gray pa4 mv0 f6 f5-l overflow-auto"><code>${
      toHtml(highlight(fs.readFileSync(path.join(__dirname, 'assets/example.js'), 'utf8'), { lang: 'js' }))
    }</code></pre>
  `
  return html`
    <div class="mw9 center cf tl pv5 vhs-top vhs-delay-5">
      <header class="fn fl-l w-40-l pr4-l">
        <h1 class="f2 lh-title fw9 mb3 mt0 pt3 bt bw2">
          Input field example
        </h1>
        <h2 class="f3 black-70 lh-title">
          The goal of this example is to show how to combine logic and views.
          It's all just JavaScript and HTML.
        </h2>
        <div class="f6 ttu tracked dark-gray" href="#">
          Run online (soon) ❯
        </div>
      </header>
      <div class="fn fl-l w-60-l mt5 mt0-l ${codeMargin}">
        ${code}
      </div>
    </div>
  `
}

function Description () {
  return html`
    <section class="pt4 pb0 pb4-ns pt5-l mw7 center vhs-top vhs-delay-5">
      <p class="f4 db mv0 lh-copy tl">
        ${fs.readFileSync(path.join(__dirname, 'assets/intro.txt'), 'utf8')}
      </p>
    </section>
  `
}

function Principles () {
  var one = el('Minimal in every aspect', fs.readFileSync(path.join(__dirname, 'assets/minimal.txt'), 'utf8'))
  var two = el('No framework lock in', fs.readFileSync(path.join(__dirname, 'assets/frameworks.txt'), 'utf8'))
  var three = el('Easy to start with', fs.readFileSync(path.join(__dirname, 'assets/easy.txt'), 'utf8'))

  return html`
    <section class="tl ph4 ph5-l pv5 bg-lightest-blue navy">
      <div class="mw9 center">
        <h1 class="f2 lh-title fw9 mb3 mt0 pt3 bt bw2">
          Principles
        </h1>
        <section class="lh-copy">
          <div class="cf">
            ${one}
            ${two}
            ${three}
          </div>
        </section>
      </div>
    </section>
  `
  function el (title, text) {
    return html`
      <article class="pv2 fl w-100 w-third-l pr4-l">
        <h2 class="f5 f4-ns fw6 mb0">
          ${title}
        </h2>
        <p class="f6 f5-ns measure lh-copy mt0">
          ${text}
        </p>
      </article>
    `
  }
}

function Usage () {
  var corps = [
    [ 'The Washington Post', 'https://www.washingtonpost.com/' ],
    [ 'Google', 'https://google.com' ],
    [ 'The Freeman Lab', 'http://thefreemanlab.com/' ],
    [ 'Dat Project', 'http://datproject.org/' ],
    [ 'Folder Studio', 'http://folderstudio.com' ],
    [ 'City of Philadelphia', 'https://beta.phila.gov/' ],
    [ 'Variable', 'http://variable.io' ],
    [ 'ABC Australia', 'http://www.abc.net.au/' ],
    [ 'Littlstar', 'https://littlstar.com/' ],
    [ 'Greenkeeper', 'https://greenkeeper.io/' ],
    [ 'Blue Link Labs', 'https://beakerbrowser.com/' ]
  ]
  return html`
    <section class="tl ph4 ph5-l pv5 bg-washed-green">
      <div class="mw9 center">
        <h1 class="f2 lh-title fw9 mb3 mt0 pt3 bt bw2">
          Choo in the wild
        </h1>
        <p class="f4">
          Choo has been used on projects and experiments by folks from a fair
          few groups.
        </p>
        <section class="lh-copy mw9">
          <div class="cf">
            ${corps.map(el)}
            <article class="fl w-100 w-50-m w-25-l pr4-l">
              <h2 class="f5 f4-ns fw6 mb0 black">
                You?
              </h2>
            </article>
          </div>
        </section>
      </div>
    </section>
  `
  function el (tuple) {
    var title = tuple[0]
    var url = tuple[1]
    return html`
      <article class="fl w-100 w-50-m w-25-l pr4-l">
        <a href=${url} class="link">
          <h2 class="f5 f4-ns fw6 mb0 dim black">
            ${title}
          </h2>
        </a>
      </article>
    `
  }
}

function Start () {
  return html`
    <article class="cf ph4 ph5-l pv5">
      <div class="mw9 center">
        <header class="fn fl-l w-40-l pr4-l">
          <h1 class="f2 lh-title fw9 mb3 mt0 pt3 bt bw2">
            Getting started
          </h1>
          <h2 class="f3 black-70 lh-title">
            Getting started with Choo shouldn't be hard, so we've included some
            options.
          </h2>
        </header>
        <div class="fn fl-l w-60-l mt4 mt0-l">
          <section class="lh-copy mw9">
            <div class="cf">
              <article class="fl w-100 pr4-l">
                <h2 class="f6 f5-ns fw6 mv0 black lh-solid">
                  Learn choo step by step
                </h2>
                <a class="ba no-underline br1 black-80 bg-washed-blue grow b inline-flex items-center mr3 mv3 pv2 ph3" href="https://github.com/choojs/choo-handbook">
                  Read the handbook 📖
                </a>
              </article>
              <article class="fl w-100 pr4-l mt3">
                <h2 class="f6 f5-ns fw6 mv0 black">
                  Install from npm
                </h2>
                <pre class="pre black-70 overflow-auto"><code class="code f6 dib pv2 ph3 w-100 bg-black-70 washed-green">${
                  '$ npm install choo'
                }</code></pre>
              </article>
            </div>
          </section>
        </div>
      </div>
    </section>
  `
}

function Sponsors () {
  var corps = [
    [ 'Dat Project', 'https://datproject.org/' ],
    [ 'X-Team', 'https://x-team.com' ],
    [ 'Andrew Joslin', 'https://twitter.com/andrewtjoslin' ],
    [ 'Remi Nyborg', 'https://twitter.com/reminyborg' ],
    [ 'Jacob Burden', 'https://twitter.com/jekrb' ],
    [ 'Pavel', 'https://opencollective.com/pavel' ],
    [ 'Terkel Gjervig', 'https://twitter.com/terkelg' ]
  ]
  return html`
    <article class="cf tl ph4 ph5-l pv5 bg-lightest-blue">
      <div class="mw9 center">
        <section class="fn fl-l w-100 w-40-l pr4-l">
          <h2 class="f3 f1-ns lh-title fw9 mb3 mt0 pt3 bt bw2">
            We're supported by some fine folk
          </h2>
          <a href="https://opencollective.com/choo"
            class="f5 f4-ns ba no-underline br1 black-80 bg-washed-blue grow b inline-flex items-center mr3 mv3 pv2 ph3">
            Support the community 🙏
          </a>
        </section>
        <div class="fl w-100 w-60-l pa3-l mt0-l">
          ${corps.map(el)}
        </div>
      </div>
    </article>
  `

  function el (tuple) {
    var title = tuple[0]
    var url = tuple[1]
    return html`
      <article class="fl w-100 w-50-m w-33-l pr4-l">
        <a href=${url} class="link">
          <h2 class="f4 f3-ns fw6 mb0 dim black lh-title">
            ${title}
          </h2>
        </a>
      </article>
    `
  }
}

function Footer () {
  return html`
    <footer class="bg-white ph4 ph5-l pb4 pt4 pt5-l">
      <div class="mw9 center">
        <div class="f5 lh-copy fl w-100">
          ${link('📖 Read the handbook', 'https://github.com/choojs/choo-handbook')}
          ${link('🐈 Choo on GitHub', 'https://github.com/choojs/choo')}
          ${link("🐦 Here's a twitter", 'https://twitter.com/yoshuawuyts')}
          ${link('🔎 View source', 'https://github.com/choojs/choo-website')}
        </div>
        <p class="b pt6 pt5-l cf lh-copy">
          <span class="fl-m">Made with 🚂 in Saigon, Tokyo, Berlin</span>
          <br class="db dn-m">
          <span class="fr-m">
            By <a class="black link dim b" href="https://github.com/choojs">Yosh & friends</a>
          </span>
        </p>
      </div>
    </footer>
  `

  function link (text, url) {
    return html`
      <div class="fl-ns w-100 w-20-l pr3-m pr4-l">
        <a class="black link dim b" href=${url}>
          ${text}
        </a>
      </div>
    `
  }
}

function toHtml (str) {
  var el = html`<div></div>`
  el.innerHTML = str
  return el.childNodes[0]
}

function Logo (text) {
  var prefix = css`
    :host .c,
    :host .h,
    :host .o { letter-spacing: -0.05em }

    @media screen and (min-width: 30em) {
      :host .c { letter-spacing: -0.05em }
      :host .h { letter-spacing: 0.05em }
      :host .o { letter-spacing: 0.15em }
    }
  `
  return html`
  <div class="dib center mb4 mb5-ns">
    <h1 class="f2 f1-l lh-title ma0 vhs-left ${prefix}">
      <span className="c">c</span>
      <span className="h">h</span>
      <span className="o">o</span>
      <span>o</span>
      <div class="pl3 dib vhs-right vhs-delay-3">🚂🚋🚋🚋</div>
    </h1>
    <h2 class="f2-l dib vhs-bottom vhs-delay-4 ttu ma0">
      ${text}
    </h2>
  </div>
  `
}
