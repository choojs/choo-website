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
    transform: translateY(100%);
    opacity: 0;
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
      active: true,
      aboveFold: true,
      placeholder: false,
      border: true,
      links: [{
        title: 'Home',
        url: '/'
      }, {
        title: 'Reference',
        url: '/reference'
      }, {
        title: 'Log',
        url: 'https://medium.com/choojs'
      }]
    }

    this.frame

    this.handleMouseMove = this.handleMouseMove.bind(this)
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
    window.addEventListener('mousemove', this.handleMouseMove, false)
  }

  unload () {
    raf.cancel(this.frame)
    this.state.active = false
    this.state.scrollY = 0
    window.removeEventListener('mousemove', this.handleMouseMove, false)
  }


  createElement (props) {
    this.state = xtend(this.state, props)
    this.elementNavigation = this.renderNavigation()
    return html`
      <div>
        ${this.elementNavigation}
        ${this.state.placeholder !== false ? this.renderPlaceholder() : ''}
      </div>
    `
  }

  handleMouseMove (event) {
    if (event.clientY < this.element.querySelector('[data-nav]').offsetHeight * 1.25) {
      this.show()
    }
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

      if (scrollY < this.getBoundingHeight()) {
        this.aboveFold()
      } else {
        this.belowFold()
      }

      this.state.scrollY = scrollY
      this.frame = raf(this.handleScroll)
    }
  }

  getBoundingHeight () {
    if (typeof this.state.getBoundingHeight === 'function') {
      return this.state.getBoundingHeight()
    } else {
      return window.innerHeight
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

  renderNavigation () {
    return html`
      <div class="bgc-pink psf t0 l0 r0 w100 ${style} ${this.state.active ? '' : 'nav-page-hide'}" data-nav>
        <div class="w100 wmx1100 mxa">
          <div class="x xjb py0-5 w100 psr">
            <div class="x px0-5">
              ${this.state.links.map(this.renderLink)}
            </div>
            <div class="x px0-5">
              <div class="px0-5 psr">
                ${renderNpm()}
              </div>
              <div class="px0-5">
                <a href="https://github.com/choojs/choo" target="_blank" class="tdn">repo</a>
              </div>
            </div>
            <div class="psa b0 l0 r0 mx1 bb2-pinker line ${!this.state.aboveFold || this.state.border ? 'line-active' : ''}"></div>
          </div>
        </div>
      </div>
    `
  }

  renderPlaceholder () {
    return html`
      <div class="py0-5">${raw('&nbsp;')}</div>
    `
  }

  renderLink (props, i, arr) {
    var activeClass

    if (this.state.href === '/' && props.url === '/') {
      activeClass = true
    } else if (props.url !== '/' && this.state.href.indexOf(props.url) >= 0) {
      activeClass = true
    }

    return html`
      <div class="px0-5 psr ${activeClass ? 'fc-pinker' : ''}">
        <a href="${props.url}" class="tdn">${props.title}</a>
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
      class="psr fs1 db tar fc-black"
      style="width: 5.5rem"
      onclick=${selectText}
    />
  `
}

function renderLineVert () {
  return html`<div class="psa t0 r0 b0 br2-pinker"></div>`
}

function selectText (event) {
  event.target.select()
}

