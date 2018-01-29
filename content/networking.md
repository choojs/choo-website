# Networking
A fun way to think about browsers, is as a standardized Virtual Machine (VM)
that includes high-level APIs to do networking, sandboxed code execution and
disk access. It runs on almost every platform, behaves similarly everywhere, and
is always kept backwards compatible.

An important part of this machinery is networking. In the browser, there's 8 (or
so) different ways to access the network:

- By navigating to a new page
- Through `<script>`, `<link>`, & other tags.
- Using `prefetch` headers.
- Using `new XMLHTTPRequest()`, `window.fetch()`, & `navigator.sendBeacon()`.
- Using (dynamic) `import()`.
- Using the Server Sent Events API.
- Using the WebSocket API.
- Using WebRTC.

## HTTP Requests
Most of the browser's networking happens through HTTP requests. HTTP is a
data protocol on top of a TCP stream. Knowing that HTTP is based on TCP is
useful, because it means that the browser will try its very best to make sure a
request goes through. If it fails, it usually means that something is very
wrong, like when the internet connection has dropped entirely.

You might be seeing the word HTTP/2 getting thrown around regularly. You don't
need to worry too much about this, as HTTP/2 doesn't change any existing browser
APIs. You can think of it as a "more efficient version HTTP". For now, don't
worry about things like HTTP/2 push either - they're mostly details for servers,
which we won't be covering here.

The browser has several ways of performing HTTP requests.
- __Navigating to a new page:__ performs an HTTP request whenever you type in a
  url in your browser. The server then replies with some `index.html` file which
  contains more links to assets and other pages.
- __Through `<script>`, `<link>` & other tags:__ When an `index.html` page is
  loaded, the browser will read out all `<link>` and `<script>` tags in the
  document's head. This will trigger requests for more resources, which in turn
  can request even more resources. There's also the `<a>` and `<img>` tags,
  which act similarly.
- __Using `prefetch` headers.__ When a browser page is loaded, the server can
  set headers for additional resources that should be loaded. The browser then
  proceeds to request those.
- __Using `new XMLHTTPRequest()` & `window.fetch()`:__ In order to make dynamic
  requests to say, a JSON API, you can use these APIs. `XMLHTTPRequest` is the
  classic way of performing requests, but these days there's the more modern
  `window.fetch()` API. Regardless of which API you use, they produce similar
  results.
- __Using `navigator.sendBeacon()`:__ Sometimes you want to perform an HTTP
  Request, but want to allow more important requests to be prioritized first.
  For example with analytics data. The `sendBeacon()`  API, allows for exactly
  this: it allows you to create an HTTP POST request, but schedules it to occur
  in the background. Even if the page is closed before the request had a chance
  to complete.
- __Using (dynamic) `import`:__ Scripts can request other scripts, by using the
  `import` syntax. This can either be dynamic or static - but in both cases it
  makes an HTTP request to require JavaScript.

### Fetch
There's many ways of creating an HTTP request, but the most common one these
days is using `fetch()`. In Choo you might want to trigger a request based on
some other event coming through the EventEmitter. Let's look at a brief example
of how to trigger a request based on a Choo event:

_note: we recommend going through [the stores docs](/reference/stores) first. We
assume you'll know how Choo's event emitter model works for the next few
sections._

```js
var choo = require('choo')

var app = choo()
app.store((state, emitter) => {
  state.tweets = []
  emitter.on('fetch-tweets', (username) => {   // 1.
    window.fetch(`/${username}/tweets`)        // 2.
      .then((res) => res.json())               // 3.
      .then((json) => JSON.parse(json))        // 4.
      .then((data) => {
        state.tweets.concat(data)              // 5.
        emitter.emit('render')
      })
      .catch((err) => {
        emitter.emit('error', err)             // 6.
      })
  })
})
```

1. We create a listener for the `'fetch-tweets'` event.
2. When the listener is called, we create a new `fetch()` call to a JSON
   endpoint. The url is dynamically created based on the username that's passed.
3. We know the response will be JSON, so we try and convert the binary blob to
   JSON.
4. Now that it's a JSON blob, we want to convert it to a JavaScript Object. We
   do this using `JSON.parse()`.
5. Now that we have our JavaScript Object, we add the new tweets to our existing
   list of tweets. Once the new data is set, we emit the `'render'` event to
   trigger a DOM update.
6. If any of the steps above failed for any reason, we emit the `'error'` event.
   If this was a real-world project, this is where we'd also make sure we had a
   good user-facing error, and would report the error to our analytics server.
   Good error handling is a very imporant aspect of production applications.

And that's about it. Depending on the application's requirements, you can switch
up the arguments that are passed to `fetch()`. Perhaps you might even want to
create an abstraction to reduce boilerplate. Whichever way you go: the
abstraction is going to be similar.

## Import
`import` is a new keyword added to JavaScript in ES6. It allows loading
JavaScript from inside JavaScript - allowing the browser to cache responses
along the way.

There are two types of `import` statements: static and dynamic. Static `import`
should only be used at the top of files and blocks all other JavaScript
executing until it's been resolved.

Dynamic `import()` can be used anywhere in the code, and returns a Promise which
eventually returns the module you were requesting. Unlike static `import()` it
doesn't block any code execution. This is great for splitting off parts of code
that don't need to be loaded right off the start - the less code that needs
executing, the faster your site will load!

To load JavaScript that can execute static `import` in the browser, we must set
`type="module"` attribute on the script tag: `<script src="/script.js"
type="module">`.

_note: You might have noticed that Choo doesn't default to using `import` yet.
Support for `import` is still experimental in Node, and only partially rolled
out in browsers. Once `import` is stable, we'll switch over in a semver major
release._

## Server Sent Events
So far we've only covered doing request-response (`REQRES`) using HTTP. You send
a request, and you always expect a response. If you don't get a response, it's
considered an error.

But `REQRES` isn't the only type of connection out there. Another common pattern
is that of publisher-subscriber (`PUBSUB`). This pattern has a 'publisher' on
one side, and a 'subscriber' on the other. For example: you might have a server
that knows about events, and a client that listens to them. In the browser you
can achieve `PUBSUB` using the [Server Sent
Events (SSE)](strea://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_eventsm)
API.

It's also useful to know that Server Sent Events are supported by HTTP/2. This
means that unlike some other messaging protocols, Server Sent Events seamlessly
integrate with HTTP/2's socket multiplexing (which means things become more
efficient).

Let's create a small SSE client that connects to an `/sse` url. Whenever an
event comes in, it'll emit an `'sse:message'` event.

_If you're interested in a premade solution for Server Sent Events in Choo,
check out the [choo-sse](https://github.com/yerkopalma/choo-sse) package._

```js
var choo = require('choo')

var app = choo()
app.store((state, emitter) => {
  emitter.on('DOMContentLoaded', () => {                             // 1.
    var source = new window.EventSource('/sse')                      // 2.
    source.addEventListener('open', () => emitter.emit('sse:open'))  // 3.
    window.addEventListener('beforeunload', () => source.close())    // 4.
    source.addEventListener('message', (event) => {                  // 5.
      try {
        var data = JSON.parse(event.data)
      } catch (e) {
        return emitter.emit('sse:error', e)                          // 6.
      }
      emitter.emit('sse:message', data)                              // 7.
    })

    source.addEventListener('error', (event) => {                    // 8.
      if (event.target.readyState === window.EventSource.CLOSED) {   // 9.
        source.close()
        emitter.emit('sse:closed')
      } else if (event.target.readyState === window.EventSource.CONNECTING) {
        emitter.emit('sse:reconnect')                                // 10.
      } else {
        emitter.emit('sse:error', event)                             // 11.
      }
    })
  })
})
```

1. Before we can create an SSE listener in the browser, we need to check if
   we're indeed running in the browser. The best way to achieve this is to
   listen to Choo's `'DOMContentLoaded'` event first. It's never triggered in
   Node, and has the nice side effect of improving time till interactive in the
   browser.
2. Once the DOM is loaded, we create a new `EventSource` instance. We pass it a
   URL to connect to. It makes a regular HTTP request, but keeps the connection
   open so the server can send multiple chunks of data to the client as is
   needed. You can mostly think of it as a fancy HTTP request.
3. Once the connection is opened, we emit the `'sse:open'` event. There might be
   parts of the UI that are interested in this information.
4. When we close the page, we want all connections to be cleaned up nicely. In
   order to do that, we listen to the browser's `window.onBeforeUnload` event,
   and close the connection before closing the page. This prevents errors from
   showing up in our logs.
5. Here's the part that we came for: listening for events. `events.data` doesn't
   require any particular formatting, but it's recommended to use JSON, just
   like with HTTP APIs. So we should try and parse it to JSON before passing it
   to the rest of our application.
6. If for some reason a parsing error occurs, we should emit an `'sse:error'`
   event.
7. If everything has gone well, we can expose the event to the rest of our app
   using the `sse:message` event.
8. Connection errors can occur. The connection can be closed from the server,
   it can be reconnecting or some other unknown error might have occured.
9. If the connection was closed cleanly, we emit the `'sse:closed'` connection,
   and close the whole connection.
10. If the connection is trying to reconnect, we emit the `'sse:reconnect'`
    event.
11. If an actual error occured, we emit the `'sse:error'` event.

## Websockets
Server Sent Events allow you to create a `PUBSUB` channel that sends data from
one side to the other. But what if we want to send and receive events on both
sides? This is where WebSockets (WS) come in.

At the moment WebSockets don't integrate with HTTP/2, so in order to use them
both the server and client will need to negotiate a new handshake and establish
a new connection.

Let's take a look at how to integrate websockets with Choo.

_If you're interested in a premade solution for Server Sent Events in Choo,
check out the [choo-websocket](https://github.com/yerkopalma/choo-websocket)
package._

```js
```
