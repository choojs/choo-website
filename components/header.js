var Nanocomponent = require('nanocomponent')
var html = require('choo/html')
var domcss = require('dom-css')

module.exports = class Header extends Nanocomponent {
  constructor () {
    super()

    this.state = {
      active: false,
      count: 75,
      cards: [ ],
      featured: this.createFeatured(),
      text: text()
    }

    this.handleCardClick = this.handleCardClick.bind(this)
    this.createCard = this.createCard.bind(this)
  }

  load (element) {
    this.state.cards = this.createCards()
    var cardsLen = this.state.cards.length
    this.state.cards.forEach(function (card, i) {
      var t = i / cardsLen
      var ease = (t*t*t) * 100
      setTimeout(function() {
        var el = element.querySelector('#header-card-' + i)
        card.opacity = 1 
        el.style.opacity = ''
      }, ease * 250)
    })
    this.rerender()
  }

  unload (element) {

  }

  createElement (props) {
    var content = ''

    if (typeof window !== 'undefined') {
      content = [
        this.state.cards.map(this.renderCard),
        this.renderCard(this.state.featured)
      ]
    }

    return html`
      <div class="h100 w100 bgc-pinker psr oh curd usn">
        ${content}
      </div>
    `
  }

  update (props) {
    return false
  }

  createFeatured () {
    return {
      id: 999,
      scale: (Math.random() * 1) + 5,
      invert: true,
      index: 11,
      ignore: true,
      text: 'choo',
      opacity: 1,
      position: {
        x: (Math.random() * 20) + 40,
        y: (Math.random() * 20) + 40
      },
      rotate: (Math.random() * 45) - 22.5
    }
  }

  createCard (card, i) {
    var handleCardClick = this.handleCardClick
    var s = Math.random()
    var scale = ((s*s*s) * 7) + 1
    var index = 10 - Math.floor(scale)

    return {
      id: i,
      scale: scale,
      invert: Math.random() >= 0.5,
      index: index,
      text: this.state.text[Math.floor(Math.random() * this.state.text.length)],
      opacity: 0,
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      },
      rotate: Math.random() * 360,
      handleClick: handleCardClick
    }
  }

  createCards (props) {
    return Array(this.state.count).fill(null).map(this.createCard)
  }

  renderCard (props) {
    var style = {
      opacity: props.opacity,
      padding: `${0.25 * props.scale}rem ${0.5 * props.scale}rem`,
      fontSize: props.scale + 'rem',
      top: props.position.y + '%',
      left: props.position.x + '%',
      transform: `translate(-50%, -50%) rotate(${props.rotate}deg) `,
      zIndex: props.index
    }

    var classList = props.invert
      ? 'bgc-pink fc-pinker'
      : 'bgc-pinker fc-pink'

    if (props.ignore) classList = 'bgc-white fc-black'

    var el = html`
      <div
        id="header-card-${props.id}"
        class="header-card psa t0 l0 lh1 tac ${classList} ${props.ignore ? 'pen' : ''}"
        style=${style}
        onclick=${handleClick}
      >
        ${props.text}
      </div>
    `

    domcss(el, style)
    return el

    function handleClick (event) {
      if (typeof props.handleClick === 'function') {
        props.handleClick(props)
      }
    }
  }

  handleCardClick (props) {
    var card = this.state.cards[props.id]
    card.invert = !card.invert
    card.index = Math.floor(Math.random() * 10)
    this.rerender()
  }
}


function text () {
  return [
    'choo',
    '4kilobytes',
    'nano',
    'smol'
  ]
}