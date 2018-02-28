var options = require('./options')

module.exports = `
  .hljs {
    color: ${options.colors.grey_75};
  }

  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-title,
  .hljs-section,
  .hljs-doctag,
  .hljs-name,
  .hljs-strong {
    color: ${options.colors.black};
  }

  .bgc-black .hljs-keyword,
  .bgc-black .hljs-selector-tag,
  .bgc-black .hljs-title,
  .bgc-black .hljs-section,
  .bgc-black .hljs-doctag,
  .bgc-black .hljs-name,
  .bgc-black .hljs-strong {
    color: ${options.colors.pink};
  }

  .hljs-comment {
    color: ${options.colors.grey_75};
  }

  .hljs-string,
  .hljs-title,
  .hljs-section,
  .hljs-built_in,
  .hljs-literal,
  .hljs-type,
  .hljs-addition,
  .hljs-tag,
  .hljs-quote,
  .hljs-name,
  .hljs-selector-id,
  .hljs-selector-class {
    color: ${options.colors.pinker};
  }

  .hljs-meta,
  .hljs-subst,
  .hljs-symbol,
  .hljs-regexp,
  .hljs-attribute,
  .hljs-deletion,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-link,
  .hljs-bullet {
    color: ${options.colors.pinker};
  }
`
