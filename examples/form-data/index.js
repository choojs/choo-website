var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.route('/', main)
app.mount('body')

function main () { // 1.
  return html`
    <body>
      <form id="login" onsubmit=${onsubmit}>
        <label for="username">
          username
        </label>
        <input id="username" name="username"
          type="text"
          required
          pattern=".{1,36}"
          title="Username must be between 1 and 36 characters long."
        >
        <label for="password">
          password
        </label>
        <input id="password" name="password"
          type="password"
          required
        >
        <input type="submit" value="Login">
      </form>
    </body>
  `

  function onsubmit (e) { // 2.
    e.preventDefault()
    var body = new window.FormData(e.currentTarget) // 4.
    window.fetch('/dashboard', { method: 'POST', body }) // 5.
      .then(res => console.log('request ok!'))
      .catch(err => console.log('oh no!', err))
  }
}
