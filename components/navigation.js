var Nanocomponent = require('nanocomponent')
var raw = require('choo/html/raw')
var assert = require('assert')
var html = require('choo/html')
var css = require('sheetify')
var xtend = require('xtend')
var raf = require('raf')

var style = css`
  :host {
    z-index: 99;
    transform: translate3d(0, 0, 0);
    transition: transform 350ms cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  :host.nav-page-hide {
    transform: translate3d(0, -100%, 0);
  }

  :host .line {
    opacity: 0;
    transition: opacity 350ms ease-in-out;
  }

  :host .line-active {
    opacity: 1;
  }
`

module.exports = class Navigation extends Nanocomponent {
  constructor () {
    super()

    this.state = {
      scrollY: 0,
      active: false,
      aboveFold: true,
      links: [{
        title: 'Index',
        url: '/'
      }, {
        title: 'Reference',
        url: '/reference'
      }, {
        title: 'Log',
        url: '#'
      }, {
        title: 'Repo',
        url: 'github'
      }]
    }

    this.frame
    this.handleScroll = this.handleScroll.bind(this)
    this.renderLink = this.renderLink.bind(this)
  }

  load () {
    var self = this
    setTimeout(function () {
      self.frame = raf(self.handleScroll)
      self.state.active = true
      self.rerender()
    }, 100)
  }

  unload () {
    raf.cancel(this.frame)
    this.state.active = false
    this.state.scrollY = 0
  }

  createElement (props) {
    this.state = xtend(this.state, props)
    console.log(props, this.state)
    return html`
      <div class="bgc-pink psf t0 l0 r0 x xjb py0-5 w100 ${style} ${this.state.active ? '' : 'nav-page-hide'}">
        <div class="x px0-5">
          ${this.state.links.map(this.renderLink)}
        </div>
        <div class="px1">
          ${renderNpm()}
        </div>
        <div class="psa b0 l0 r0 mx1 bgc-pinker line ${this.state.aboveFold ? '' : 'line-active'}" style="height: 2px"></div>
      </div>
    `
  }


  handleScroll () {
    var scrollY = window.scrollY
    if (scrollY === this.state.scrollY) {
      this.frame = raf(this.handleScroll)
      return 
    } else {
      if (scrollY > this.state.scrollY && scrollY > 100) {
        this.hide()
      } else {
        this.show()
      }
      if (scrollY < window.innerHeight * 0.9) {
        this.aboveFold()
      } else {
        this.belowFold()
      }
      this.state.scrollY = scrollY
      this.frame = raf(this.handleScroll)
    }
  }

  aboveFold () {
    if (!this.state.aboveFold) {
      this.state.aboveFold = true
      this.rerender()
    }
  }

  belowFold () {
    if (this.state.aboveFold) {
      this.state.aboveFold = false
      this.rerender()
    }
  }

  show () {
    if (!this.state.active) {
      this.state.active = true
      this.rerender()
    }
  }

  hide () {
    if (this.state.active) {
      this.state.active = false
      this.rerender()
    }
  }

  renderLink (props) {
    var activeClass = this.state.href === props.url ? 'fc-pinker' : ''
    return html`
      <div class="px0-5">
        <a href="${props.url}" class="tdn ${activeClass}">${props.title}</a>
      </div>
    `
  }

  update (props) {
    return props.href !== this.state.href
  }
}

function renderNpm () {
  return html`
    <input
      type="text"
      value="npm i choo"
      class="psr fs1 db tar"
      style="width: 5.5rem"
      onclick=${selectText}
    />
  `
}

function selectText (event) {
  event.target.select()
}
