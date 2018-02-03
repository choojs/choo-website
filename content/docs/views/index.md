title: Views
----
view: doc
----
excerpt:

Views are Choo's rendering abstraction. It's the part that takes the internal
state and renders elements to the DOM.
----
text:

Views are Choo's rendering abstraction. It's the part that takes the internal
state and renders elements to the DOM.

Choo is entirely event-driven. It follows the paradigm of "data down, events
up". This means that in views, only data is ever passed down — and to trigger
something in a parent node, an event is emitted.

In Choo we wanted to make rendering _declarative_. This means that you declare
what the DOM should look like, and Choo takes care of making it happen. This is
similar in spirit to _virtual DOM_ libraries, but instead of using a "virtual"
DOM, we use actual DOM nodes.

Declarative rendering is great, because it generally leads to more
maintainable, performant and reliable code.

## Routing
To render something in Choo, there's a few steps we need to follow. First we
create an application instance, then we declare a route, and finally we mount
the application on the DOM.

Each route takes a route name, and a callback as arguments. The route maps
directly to the browser's `window.location`.

```js
var html = require('choo/html')    // 1.
var choo = require('choo')

var app = choo()                   // 2.
app.route('/', (state, emit) => {  // 3.
  return html`
    <body>                       <!-- 4. -->
      Hello World
    </body>
  `
})
app.mount('body')                  // 5.
```
1. In order to declare elements, we must import the `choo/html` module. It's
   common to name the import `html` which is picked up for syntax highlighting
   by GitHub and many editors.
2. Let's create an application instance.
3. To declare a view, call `app.route()`. The first argument is the route name,
   the second argument is the view that's called. It's passed two arguments:
   `state` and `emit`. `state` is a shared object that's shared throughout the
   application. `emit` allows emitting events, which in turn can be picked up
   by stores.
4. Each view must return valid DOM elements. Using [tagged template
   literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   we can write inline HTML, which is then translated to valid DOM elements
   that can be mounted on the DOM. Here we're creating a body tag, which
   contains the text `"Hello World"`.
5. Now that we have a route that renders a view, let's attach it to the DOM. By
   calling `app.mount()` we can tell the router to start rendering on the
   DOM's `document` body.

## Mounting on the DOM
`app.mount()` is the primary call to start rendering elements on the DOM. It
takes a [CSS
selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors)
or DOM Node as the first argument, and treats it as the root node to diff it
against. This is ideal in combination with Server Rendering, because the
application in the client can pick up right where the server left off.

`app.start()` is similar to `app.mount()`, but instead of starting to apply
patches on nodes straight away, it returns a node that can be added manually
onto the DOM.

```js
var choo = require('choo')
var app = choo()

app.mount('body')                            // 1.

var target = document.querySelector('body')  // 2.
app.mount(target)

var element = app.start()                    // 3.
document.body.appendChild(element)
```
1. Most commonly Choo will be mounted onto `document.body`. Internally we wait
   for the DOM to finish loading before performing a `document.querySelector()`
   call, and starting diffing the DOM.
2. Alternatively we can also find a DOM node and pass it into `app.mount()`
   directly. Be careful here, because if the DOM hasn't finished loading yet,
   it may not be able to find the node requested by the query selector.
3. The third approach is to create a DOM node, and handle adding it to the DOM
   manually. Also note that some care is required here, as the DOM may not have
   finished loading by the time we try to append a node onto it.

### Notes
- When using `app.mount()`, the DOM node that's being selected as the root node
  must be the same type as the DOM most outer DOM node returned by a view. For
  technical reasons the outer node must stay the same type for DOM diffing to
  work.

## Events
To handle user input, views can attach event listeners onto the DOM. These
listeners can in turn emit events on the event bus. To make sure that the
application's flow is easy to reason about, views cannot attach listeners on
the event bus themselves. This is where "data down, events up" becomes
visible in the code: the view only has access to `emit()`, while anything that is
declared through `app.use()`, such as a store, has access to the whole event bus
throught `emitter`. This can both send events with `emitter.emit()`, as well as
receive them with `emitter.on()`.

There are many events available on DOM elements, and most are available as
attributes on DOM elements. For example form submissions can be detected by
adding an `onsubmit` attribute to the form.

```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.use((state, emitter) => {                   // 1.
  emitter.on('click', () => {                   // 2.
    console.log('clicked')
  })
})

app.route('/', (state, emit) => {
  return html`
    <body>
      <button onclick=${() => emit('click')}> <!-- 3. -->
        Click Me
      </button>
    </body>
  `
})
app.mount('body')
```
1. Let's start off by creating a store. Stores can emit and listen to events,
   where views can only emit events.
2. When the `'click'` event is emitted, we'll `console.log()` some text to the
   console.
3. We're now creating a button inside the body. Whenever the button is clicked,
   we'll emit a `'click'` event. This will be picked up by the store, and in
   turn logs a value to the console.

## Managing views
An application often has multiple views. Defining them all in a single file can
quickly turn a neat application into something unmaintainable. Instead a common
pattern is to define views in a `views/` directory.

Each view then imports all the code it needs, and exports the function to
create the view.

```js
var html = require('choo/html')

module.exports = function (state, emit) {
  return html`
    <body>
      What's up with choo?
    </body>
  `
}
```

## Declaring titles
Every good story needs a good title, and web pages are no different. Choo has
built-in support to edit the page's title through the `'DOMTitleChange` event.

```js
module.exports = function (state, emit) {
  emit('DOMTitleChange', 'Cool main page')

  return html`
    <body>
      I choo choose you
    </body>
  `
}
```

The page title will now update whenever the page loads. Different pages can set
different titles, so it will always be up to date. Even better: when combining
it with server rendering, the title can be picked up from `state.title`, and
used to set the title correctly in the header for initial render.

There are a few downsides though: if you're debugging, this might fire a lot of
title changed events even if nothing's changed. And given that our title is
static, we could be caching it. Let's optimize it a little.

```js
var title = 'Cool main page'                                // 1.

module.exports = function (state, emit) {
  if (state.title !== title) emit('DOMTitleChange', title)  // 2.

  return html`
    <body>
      I choo choose you
    </body>
  `
}
```

1. Let's declare our title outside the main view. This way it's allocated only
   once in memory, and can then be reused by simply pointing to that address in
   memory. Especially nice if running on mobile devices!
2. Whenever we render, we now check what title we're displaying. If we're
   showing the same title we already have, then we don't need to do anything.
   Conditional statements are less instructions on the CPU than function calls,
   so this provides us with a little speedup (and less noise).
