var gr8 = require('gr8')
var fs = require('fs')

var ress = fs.readFileSync('node_modules/ress/ress.css', 'utf8')
var options = require('./options')

var utils = [ ]

utils.push({
  prop: 'border-radius',
  unit: 'rem',
  vals: [0.5, 1]
})

utils.push({
  prop: { bgc: 'background-color' },
  join: '-',
  vals: options.colors
})

utils.push({
  prop: { fc: 'color' },
  join: '-',
  vals: options.colors
})

utils.push({
  prop: { fc: 'color' },
  join: '-',
  tail: ' a',
  vals: options.colors
})

utils.push({
  prop: 'font-family',
  join: '-',
  vals: options.fonts
})

utils.push({
  prop: { fsh: 'font-style' },
  tail: ':hover',
  vals: ['normal', 'italic']
})

utils.push({
  prop: { vhmx: 'max-height'},
  unit: 'vh',
  vals: [0, 50, 100]
})

utils.push({
  prop: { fwh: 'font-weight' },
  tail: ':hover',
  vals: ['normal', 'bold']
})

var borderWeights = [0, 1, 2]
var borders = {}
borderWeights.forEach(border => {
  Object.keys(options.colors).forEach(key => {
    borders[border + '-' + key] = `${border * 0.05}rem solid ${options.colors[key]}`
  })
})

utils.push({
  prop: [
    'border',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left'
  ],
  vals: borders
})

var gr8css = gr8({
  lineHeight: [1, 1.25, 1.5],
  fontSize: options.fontSize,
  spacing: options.spacing,
  utils: utils,
  responsive: true,
  breakpointSelector: 'class',
  zIndex: [0, 1, 2, 3, 4, 5]
})

var custom = `
  body {
    margin: 0;
    padding: 0;
  }

  .markup {
    opacity: 0;
    animation: scroll 60s linear infinite;
  }

  @keyframes scroll {
    0 { opacity: 0; transform: translate3d(1rem, 0, 0) }
    2% { opacity: 1; }
    98% { opacity: 1; }
    100% { opacity: 0; transform: translate3d(0, -20rem, 0) }
  }

  .animation {
    white-space: pre;
    font-family: ${options.fonts.mono};
  }

  .copy { max-width: 40rem }
  .mxa { margin: 0 auto }
  .wmx1100 { max-width: 1100px }
  .wmx850 { max-width: 850px }
  .lsn { list-style: none }
  ul ul { margin-left: 1rem }
  .vh90 { height: 90vh }
  .vh75 { height: 75vh }
  .ofct { object-fit: contain }

  @media (min-width: 767px) {
    .copy-content > *:not(pre):not(h2) {
      max-width: 66.666%;
      margin-left: auto;
      margin-right: auto;
    }
  }

  ::selection { background: ${options.colors.pinker}; color: ${options.colors.pink}; }
  ::-moz-selection { background: ${options.colors.pinker}; color: ${options.colors.pink}; }

  .bttn {
    background: ${options.colors.white};
    color: ${options.colors.black};
    text-decoration: none;
    padding: 0.5rem;
    border: 0.1rem solid ${options.colors.black};
    border-top: 0;
    border-left: 0;
  }

  .usn {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
  }

  .bb2-pinker {
    border-bottom: solid ${options.colors.pinker} 0.25rem;
  }

  .glow {
    text-shadow: 0 0 2rem ${options.colors.pink};
  }

  code, pre {
    font-family: ${options.fonts.mono};
  }

  ${typography()}
`

module.exports = ress + custom + gr8css

function typography () {
  return `
    html {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    html {
      font-size: calc(1.25vw + 62.50%);
    }

    @media (max-width: 767px) {
      html {
        font-size: calc(1.75vw + 62.50%)
      }
    }

    @media (min-width: 1100px) {
      html {
        font-size: 155%
      }
    }

    @font-face {
      font-family: 'Cinetype';
      src: url('/assets/GT-Cinetype-Regular.woff');
    }

    @font-face {
      font-family: 'Cinetype';
      font-style: italic;
      src: url('/assets/GT-Cinetype-Regular-Italic.woff');
    }

    @font-face {
      font-family: 'Cinetype';
      font-weight: bold;
      src: url('/assets/GT-Cinetype-Bold.woff');
    }

    @font-face {
      font-family: 'Cinetype Mono';
      src: url('/assets/GT-Cinetype-Mono.woff');
    }
  `
}
