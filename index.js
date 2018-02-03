var hypha = require('hypha')
var choo = require('choo')
require('./design')

var wrapper = require('./components/wrapper')
var app = choo()

var site = hypha.readSiteSync('./content', {
  parent: 'content',
  file: 'index.md'
})

if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}

app.use(require('./plugins/ui'))
app.use(require('./plugins/scroll'))
app.use(require('./plugins/content')(site))

app.route('/example', wrapper(require('./views/example')))
app.route('reference', require('./views/redirect-reference'))
app.route('/reference/*', require('./views/redirect-reference'))

if (!module.parent) app.mount('body')
else module.exports = app
