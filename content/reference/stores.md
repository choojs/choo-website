# stores
## Event emitter
Choo is entirely built around event emitters.
```js
var choo = require('choo')
var app = choo()

app.use((state, emitter) => {
  emitter.on('data', (data) => console.log(data))

  var data = 'bar'
  emitter.emit('foo', data)
})
```

## Only emit events in the browser
Choo comes with a `DOMContentLoaded` event, which directly maps to the
[DOMContentLoaded Event](http://devdocs.io/dom_events/domcontentloaded).
Because this event only fires in the Browser, it's a great tool to prevent code
from running while doing server rendering.

It's also a great tool to optimize page load in the browser, because it can
delay initializing expensive pieces of work until the browser has become
interactive.

```js
var choo = require('choo')
var app = choo()

app.use((state, emitter) => {
  emitter.on('DOMContentLoaded', () => {
    emitter.on('data', (data) => console.log(data))

    var data = 'bar'
    emitter.emit('foo', data)
  })
})
```
