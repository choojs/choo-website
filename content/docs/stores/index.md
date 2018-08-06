title: Stores
----
view: doc
----
excerpt:

Stores are Choo's data abstraction. They're meant to both hold application
data, and listen for events to change it. In traditional systems this is
sometimes also known as "models".
----
text:

Stores are Choo's data abstraction. They're meant to both hold application
data, and listen for events to change it. In traditional systems this is
sometimes also known as "models".

Choo is entirely event-driven. It follows the paradigm of "data down, events
up". This means that in views, only data is ever passed down — and to trigger
something in a parent node, an event is emitted.

## Event emitter
```js
var choo = require('choo')
var app = choo()

app.use((state, emitter) => {     // 1.
  emitter.on('log', (data) => {   // 2.
    console.log(data)             // 3.
  })

  emitter.emit('log', 'bar')      // 4.
})
```

1. We declare a new store by passing a callback to `app.use()`. The callback is
   provided with two values: `state`, and `emitter`. These values are shared by
   all stores.
2. We declare a new event listener. When the `'log'` event is fired, we'll
   trigger a callback and pass it `'data'`.
3. When the callback is triggered, we log out the value of `'data'`.
4. We emit the `'log'` event with a value of `'bar'`.

## Wait for the DOM to load
Choo comes with some built-in events to interact with the DOM. One of these
events is [DOMContentLoaded](http://devdocs.io/dom_events/domcontentloaded),
which fires when the DOM has finished loading. This event only fires in the
browser, which is a great way to prevent code from running while doing server
rendering.

The DOMContentLoaded event is also a great way to improve page load times. By
scheduling expensive pieces of work to wait until the DOM has loaded, pages
will become interactive sooner, which provides for a better user experience.

```js
var choo = require('choo')
var app = choo()

app.use((state, emitter) => {
  emitter.on('DOMContentLoaded', () => {
    console.log('mounted on the DOM')
  })
})
```

#### Notes on DOM loading
- If you're loading stores dynamically, the `'DOMContentLoaded` event will have
  fired by the time you start listening for it. Instead use the
  [document-ready](https://github.com/bendrucker/document-ready) package. It's
  what Choo uses internally to provide the `DOMContentLoaded` event, so there
  is no size cost in using it.

## Updating state and rendering
Choo's state has very few opinions. This means that you, as the application's
architect, can partition it in the way that makes most sense. There are no
constraints in what's possible.

Something that sets Choo aside from most other frameworks, is our explicit
rendering. Updating state does not automatically cause the application to
re-render. Renders only happen when the `'render'` event is emitted.

The biggest benefit of explicit rendering we've found is that it allows storing
values without triggering renders. This allows every part of the application to
store their internal bookkeeping values inside the state. In turn this makes
debugging applications a lot easier, since there is no private state.

```js
var choo = require('choo')
var app = choo()

app.use((state, emitter) => {
  state.count = 0                          // 1.

  emitter.on('DOMContentLoaded', () => {   // 2.
    emitter.on('increment', (num) => {     // 3.
      state.count += num                   // 4.
      emitter.emit('render')               // 5.
    })
  })
})
```

1. Define the initial state for our click counter. We're counting from 0, and
   each click will increase the value.
2. Wait for the DOM to load before we start listening for events. It's safe to
   assume that we won't be handling events before the DOM is rendered, so it's
   best to deprioritize as much work as possible until the DOM has been loaded.
3. Define a listener for the `'increment'` event. It takes one argument of
   `'num'`.
4. Now that we've received a number, increment `state.count` by the number that
   was passed.
5. Now that we've finished processing the event, we can ask the DOM to
   re-render with the new state in the next browser frame.

## Namespace patterns
More complicated applications usually have multiple concerns. For example a
Twitter client will probably need to keep track of both tweets and the user's
profile.

To make splitting up data easier, namespaces exist. It's common to create a
namespace for each store that's defined, both in the events as in the state.

```js
var choo = require('choo')
var app = choo()

app.use((state, emitter) => {                  // 1.
  state.tweets = []                            // 2.

  emitter.on('DOMContentLoaded', () => {
    emitter.on('tweets:add', (tweet) => {      // 3.
      state.tweets.push(tweet)
      emitter.emit('render')
    })
  })
})

app.use((state, emitter) => {                  // 4.
  state.user = {                               // 5.
    username: '',
    loggedIn: false
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('user:login', (name) => {       // 6.
      state.user.username = name
      state.user.loggedIn = true
      emitter.emit('render')
    })

    emitter.on('user:logout', () => {          // 7.
      state.user.username = ''
      state.user.loggedIn = false
      emitter.emit('render')
    })
  })
})
```

1. We're going to create a store for our tweets. Usually this would be a
   separate file, probably stores as `stores/tweets.js`.
2. Because tweets are ordered by timestamp, we're going to create an array to
   store our tweets in.
3. When the `tweets:add` event is emitted, we'll push the new tweet into our
   list of tweets and re-render. In a real app this logic we'd probably do a
   lot more logic here to construct the tweet.
4. We're creating a store for our user user. Usually this would probably be
   stored as `stores/user.js`.
5. We'll need to store two values: the username, and whether or not we're
   logged in.
6. When `user:login` is called, we set the username and set us as logged in.
7. When `user:logout` is called, we reset all values and log us back out.

## Hardening event emitters
Choo's event emitter is modeled after Node.js's `require('events')`. This is
great, because we're using a familiar interface. But it also means we share
some of the same weaknesses. Luckily these can be overcome!

### Handling Unknown events
Probably the most common issue with event emitters is emitting events that
don't exist. This is usually due to typos or emitting events before the
listeners are attached.
[choo-devtools](https://github.com/choojs/choo-devtools/) will warn if this
happens during development, providing details of what happened.

```js
var choo = require('choo')
var app = choo()
app.use(require('choo-devtools')())
```

### Validating types
Probably the least fun part of programming is debugging. Often this means that
someone using an application has encountered a problem, and now you're
responsible for solving it. Usually it's better to encounter these problems
during development rather than when other people are using it.

A common cause of errors in JavaScript is type mismatches. Say we're expecting
a `Number` but instead we get `undefined`, it might cause a subtle bug that can
be hard to trace down. What we want is to assert our input values are correct.

There are many tools available to validate types in JavaScript. Many of these
involve writing some dialect, and compiling it to JavaScript (e.g. `FlowType`,
`TypeScript`).

A compilation-less solution to type validation is to use `require('assert')`,
which is part of the Node.js API.

```js
var assert = require('assert')                 // 1.
var choo = require('choo')
var app = choo()

app.use((state, emitter) => {
  state.heading = 'Basic Header'               // 2.

  emitter.on('DOMContentLoaded', () => {
    emitter.on('heading', (heading) => {
      assert.equal(typeof heading, 'string')   // 3.
      state.heading = heading                  // 4.
      emitter.emit('render')
    })
  })
})
```

1. Import the `'assert'` package.
2. We define a default value for our `'header'` (we're doing something with a
   header here, not sure what — it's all made up code).
3. We validate that that `num` is type `String`.
4. That went well, now we can assign the value to state, and re-render.

#### Notes on Type Checking
- Even if `assert` won't catch all edge cases, it's generally good enough to
  rest assured input types are right.
- If for example `Nan` slips through a `assert.equal(typeof num, 'number')`
  check, we can add more assertions to prevent that from happening:
  `assert.notOk(Number.isNaN(num))`.
- `assert.equal()` uses loose equality (`==`). `assert.deepEqual()` uses strict
  equality (`===`).
- `assert.ok()` is an alias for `assert()`.
- We provide typings for TypeScript, and work out of the box with FlowType.
  You're free to use whichever method works best for you.

### Enumerating events
Maintaining applications is hard. As an application grows over time, the amount
of code grows with it and reasoning about it becomes harder.

To make working with stores easier, it can be useful to provide an overview of
all events at the top of a file. The `state.events` property exists exactly for
this purpose.

```js
var choo = require('choo')
var app = choo()

app.use((state, emitter) => {
  state.math = {
    result: 0  // The result of the last computation.
  }

  state.events.math_increment = 'math:increment' // Increment a number by 1.
  state.events.math_decrease = 'math:decrease'   // Lower a number by 1.
  state.events.math_multiply = 'math:multiply'   // Multiply two numbers.
  state.events.math_divide = 'math:divide'       // Divide two numbers.

  emitter.on('DOMContentLoaded', () => {
    emitter.on(state.events.math_increment, (num) => {
      state.math.result =  num + 1
      emitter.emit('render')
    })

    emitter.on(state.events.math_decrease, (num) => {
      state.math.result =  num - 1
      emitter.emit('render')
    })

    emitter.on(state.events.math_multiply, (a, b) => {
      state.math.result = a * b
      emitter.emit('render')
    })

    emitter.on(state.events.math_divide, (a, b) => {
      state.math.result = a / b
      emitter.emit('render')
    })
  })
})
```

## Writing Plugins
Sometimes it can be useful to extends Choo's functionality. For example in
`choo-devtools` we can trace each mutation in the state, and output a stack
trace. This requires access to the application itself. This is possible by a
third argument that's passed to stores: `app`.

Plugins are a specialized type of store. They're usually small wrappers around
the DOM API, and expose events on the event emitter. Or they somehow interact
with the application instance, and are used during development.

It can be useful to create reusable plugins, and publish them to npm. At the
time of writing there's plugins available on npm for service workers,
debugging, networking, text-to-speech and more.

```js
var choo = require('choo')
var app = choo()

app.use(log)                                    // 1.

function log (state, emitter, app) {            // 2.
  emitter.on('*', (eventname, data) => {        // 3.
    console.log('info: ' + eventname, data)
  })
}
```

1. We're using the `log` plugin here. Usually we would require the plugin from
   npm instead.
2. We create a new store. Because this is for debuggin purposes only, it's more
   of a plugin. Notice that we're exposing a third argument: `app`. These are
   available in all stores, but should probably only ever be used in plugins.
3. This is some example logic. Whenever any event is emitted on the event
   emitter, we log out the eventname and data.
