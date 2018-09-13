title: Server Rendering
----
view: doc
----
excerpt:
Server rendering is an excellent way to speed up the load time of your pages.
This section shows how to effectively render Choo apps in Node.
----
text:
Building fast applications is a tricky challenge. Usually you want to optimize
the [time to first
render](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)
and then make sure the page becomes interactive quickly. And once that's done,
you want it to all keep feeling snappy. And then some.

Server rendering is a technique to improve time to first render in applications
that rely on JavaScript to update the DOM. Instead of waiting for JavaScript to
render in the client, it figures out what the DOM should look like on the
server. The server then sends the right HTML to the client, so the first render
happens instantly.

Choo was built with both Node and the Browser in mind. One of its main features
is that it works in any environment. Let's dig in to look at what that looks
like.

_note: all of this is available out of the box in
[choojs/bankai](https://github.com/choojs/bankai). We recommend using Bankai if
you're looking for a solution to Server Rendering. However, even if you end up
using a prebuilt solution, it can still be useful to know how the underlying
mechanisms work._

## Rendering Choo in Node
The main method to use in Choo for server rendering is `.toString(routeName)`.
Using it looks something like this:

```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()                    // 1.
app.route('/', (state, emit) => {   // 2.
  return html`
    <body>Hello humans</body>
  `
})

var dom = app.toString('/')         // 3.
console.log(dom)
```

1. Create a new Choo app instance.
2. Create a new route, it returns some HTML.
3. Here is where the rendering happens. We call our application with
   `.toString(route)`, and it returns a string. The resulting string will be
   `'<body>Hello humans</body>'`.

## Adding in Data
There hasn't been too much going on so far. Instead of rendering to the DOM,
we've been creating strings instead. However, what's often the case with server
rendering is that you need some data passed in for your initial rendering.
Luckily the `.toString()` method accepts a second argument: `state`. Let's see
how this works.

```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()
var state = { message: 'doggos' }           // 1.
app.route('/', (state, emit) => {         // 2.
  return html`
    <body>Hello ${state.message}</body>
  `
})

var dom = app.toString('/', state)        // 3.
console.log(dom)
```

1. We create a `state` object with some values in it.
2. We render a `<body>` element. It takes a value from the `state`.
3. We pass the `state` object to `app.toString()` as the second argument. It
   returns a string of `<body>Hello doggos</body>`.

## Isomorphic Rendering.
In JavaScript the term "isomorphic code" often refers to code that can run in
both Node and the Browser. For Choo code to be isomorphic, it should render in
the browser, and should export the `app` instance in Node so it can be called
for server rendering.

### Classic
The "classic" version assumes we use `require()` for our application.
```js
var choo = require('choo')

var app = choo()
app.route('/', () => html`<body>hello world</body>`)

if (!module.parent) {   // 1.
  app.mount('body')
} else {                // 2.
  module.exports = app
}
```

1. If the current file isn't required by any other file, we `mount` the app on
 the `<body>` tag.
2. If the current file is required by some other file, we export it instead.

### Modern
The `import` keyword is what's going to be used to load JavaScript modules in
the near future. It already works in Node, but isn't quite prevalent yet.
Because the details of `import` are different from `require`, using it requires
a slightly different approach.

```js
import html from 'choo/html'
import choo from 'choo'

var app = choo()
app.route('/', () => html`<body>hello world</body>`)

if (typeof window !== 'undefined') {  // 1.
  app.mount('body')
}

export app                            // 2.
```

1. We detect whether or not we're in the browser, and if we are, we render to
   the DOM.
2. Because the `import` spec doesn't have dynamic `exports`, we always need to
   export our `app` instance.
