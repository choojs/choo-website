var jsSyntax = require('highlight-syntax/js')
var Highlight = require('highlight-syntax')
var mount = require('choo/mount')
var html = require('choo/html')
var log = require('choo-log')
var css = require('sheetify')
var choo = require('choo')
var path = require('path')
var fs = require('fs')

var highlight = Highlight([ jsSyntax ])

;css('tachyons')
;css('vhs/css/vhs.min.css')
;css('./assets/code.css')
var bodyStyles = css`
  :host { background-color: #ffc0cb }
  .bsbb { box-sizing: border-box }
`

var app = choo()
app.use(log())
app.router([ '/', mainView ])
mount('body', app.start())

function mainView () {
  return html`
    <body class=${bodyStyles}>
      ${toHtml(fs.readFileSync(path.join(__dirname, 'sprite.svg'), 'utf8'))}
      ${Main()}
      ${Description()}
      ${Example()}
      ${Principles()}
      ${Usage()}
      ${Start()}
      ${Architecture()}
      ${Footer()}
    </body>
  `
}

function Main () {
  var prefix = css`
    :host .c,
    :host .h,
    :host .o { letter-spacing: -0.25em }

    @media screen and (min-width: 30em) {
      :host .c { letter-spacing: -0.25em }
      :host .h { letter-spacing: -0.1em }
      :host .o { letter-spacing: 0.05em }
    }
  `
  return html`
    <main class="cf pt3 pt4-m pt5-l ph3 ph4-m ph5-l mw9 center">
      <div class="fr w-100 w-80-l ttu">
        <h1 class="f2 f1-l lh-title mt0 mb4 mb5-ns vhs-left ${prefix}">
          <span class="c">C</span>
          <span class="h">H</span>
          <span class="o">O</span>
          <span>O</span>
          <br class="dn db-ns">
          <span class="vhs-flicker vhs-delay-4">
            sturdy frontend framework
          </span>
        </h1>
      </div>
      <div class="f5 lh-copy fl w-100 mb4 vhs-flicker vhs-delay-5">
        ${tiny('tiny API')}
        ${tiny('performs well')}
        ${tiny('5kb in size')}
        ${tiny('v impressive')}
      </div>
    </main>
  `

  function tiny (text) {
    return html`
      <div class="fl-ns w-100 w-20-l pr3-m pr4-l">
        ${text}
      </div>
    `
  }
}

function Example () {
  var code = html`
    <pre class="lh-copy measure-wide-l mt0-ns db bg-dark-gray pa3 pa4-l mv0 overflow-auto"><code>${
      toHtml(highlight(fs.readFileSync(path.join(__dirname, 'assets/example.js'), 'utf8'), { lang: 'js' }))
    }</code></pre>
  `
  return html`
    <article class="cf ph4 ph5-l pv5 vhs-flicker vhs-delay-5">
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
      <div class="fn fl-l w-60-l mt5 mt0-l">
        ${code}
      </div>
    </article>
  `
}

function Description () {
  return html`
    <section class="cf pt4 pt5-l ph3 ph4-m ph7-l mw9 center vhs-flicker vhs-delay-5">
      <p class="f4 db mh4-l mv0 pb4 lh-copy">
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
    <section class="tl pa4 pa5-l bg-lightest-blue navy">
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
    [ 'Littlstar', 'https://littlstar.com/' ]
  ]
  return html`
    <section class="tl pa4 pa5-l bg-washed-green">
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
      <header class="fn fl-l w-40-l pr4-l">
        <h1 class="f2 lh-title fw9 mb3 mt0 pt3 bt bw2">
          Getting started
        </h1>
        <h2 class="f3 black-70 lh-title">
          Getting started with Choo shouldn't be hard, so we've included some
          options.
        </h2>
      </header>
      <div class="fn fl-l w-60-l mt5 mt0-l">
        <section class="lh-copy mw9">
          <div class="cf">
            <article class="fl w-100 pr4-l">
              <h2 class="f6 f5-ns fw6 mv0 black lh-solid">
                Learn choo step by step
              </h2>
              <a class="ba no-underline br1 black-80 bg-washed-blue grow b inline-flex items-center mr3 mv3 pv2 ph3" href="https://github.com/yoshuawuyts/choo-handbook">
                Read the handbook
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
            <article class="fl w-100 pr4-l mt3">
              <h2 class="f6 f5-ns fw6 mv0 black">
                Install the CLI
              </h2>
              <pre class="pre black-70 overflow-auto"><code class="code f6 dib pv2 ph3 w-100 bg-black-70 washed-green">${
                '$ npm install choo-cli'
              }</code></pre>
            </article>
          </div>
        </section>
      </div>
    </section>
  `
}

function Architecture () {
  return html`
    <section class="tl ph4 pv5 pa5-l bg-washed-green">
      <div class="mw9 center">
        <div class="cf">
          <article class="pb2 fl w-100 bt bw2">
            <h2 class="f4 f1-ns fw6 mb2">
              Let's talk about the choo architecture
            </h2>
          </article>
          <article class="pb2 fl w-100 w-50-l">
            <p class="f5 f4-ns measure lh-copy mt4 mb0">
              choo cleanly structures internal data flow, so that all pieces of logic can be combined into a nice, cohesive machine. Roughly speaking there are two parts to choo: the views and the models. Models take care of state and logic, and views are responsible for displaying the interface and responding to user interactions.
            </p>
          </article>
          <article class="pb2 pl3-l fl w-100 w-50-l">
            <p class="f5 f4-ns measure lh-copy mt4 mb0">
              All of choo's state is contained in a single object and whenever it changes the views receive a new version of the state which they can use to safely render a complete new representation of the DOM. The DOM is efficiently updated using DOM diffing/patching.
            </p>
          </article>
        </div>
      </div>
      <section class="cf mt3 mt4-l ba br1 mw8-l pa4 pb5">
        <svg class="fl w-100 w-50-l">
          <use xlink:href="#icon-logic"/>
        </svg>
        <dl class="lh-title ma0 fl f5 f6-l lh-copy pt4 pt0-l pl4-l w-100 w-50-l">
          <dt class="f6-l b mt3">
            Effects
          </dt>
          <dd class="ml0 measure">
            makes an asynchronous operation and calls another action when
            it's done
          </dd>
          <dt class="f6-l b mt3">
            Subscriptions
          </dt>
          <dd class="ml0 measure">
            (called once when the DOM loads) listens for external input like
            keyboard or WebSocket events and then calls another action.
          </dd>
          <dt class="f6-l b mt3">
            Reducers
          </dt>
          <dd class="ml0 measure">
            receives the current state and returns an updated version of the
            state which is then sent to the views
          </dd>
        </dl>
      </section>
    </section>
  `
}

function Footer () {
  return html`
    <footer class="bg-white ph4 ph5-l pb4 pt4 pt5-l">
      <div class="f5 lh-copy fl w-100">
        ${link('Read the handbook', 'https://github.com/yoshuawuyts/choo-handbook')}
        ${link('Install the CLI', 'https://github.com/trainyard/choo-cli')}
        ${link('Choo on GitHub', 'https://github.com/yoshuawuyts/choo')}
        ${link("Here's a twitter", 'https://twitter.com/yoshuawuyts')}
        ${link('View source', 'https://github.com/yoshuawuyts/choo-website')}
      </div>
      <p class="b pt6 pt5-l">
        Made with 🚂 in Saigon, Tokyo, Berlin
      </p>
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
  return el.children[0]
}
