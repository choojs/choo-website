title: Routing
----
view: doc
----
excerpt:

Choo is built up out of two parts: stores and views. In order to render a view,
it must be added to the application through `app.route()`. This is the router.
----
text:

Choo is built up out of two parts: stores and views. In order to render a view,
it must be added to the application through `app.route()`. This is the router.

In many other frameworks, routing is done by a separate library. We found that
routing is common in most applications, so making it part of the framework
makes sense.

Routing has a few parts to it. Routing must handle the browser's history API
(e.g. going forward & backwards). It must handle anchor tags, and programmatic
actions. There's more than a few moving pieces.

To perform routing, Choo uses a [Trie](https://en.wikipedia.org/wiki/Trie) data
structure. This means that our routing is fast, and the order in which routes
are added doesn't matter.

_Note: It's recommended to read the [views]('/reference/views) chapter first, as
we'll assume that you're already familiar with how views work. This chapter is
intended to give an overview of how routing works in Choo._

## Static routing
Every application needs an entry point. Routes in Choo are defined relative to
the host. The route `'/'` maps to `www.mysite.com`. The route `'/foo'` maps to
`www.mysite.com/foo`.

```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()                   // 1.
app.route('/', view)               // 2.
app.mount('body')                  // 3.

function view () {                 // 4.
  return html`
    <body>Hello World</body>
  `
}
```

1. We need an instance of Choo to add our routes to, so let's create that
   first.
2. We're going to add a view on the `'/` route. This means that if people
   navigate to `oursite.com`, this will be the route that is enabled.
3. Now that we have our view, we can start rendering our application.
4. We declare our view at the bottom of the page. Thanks to [scope
   hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting) it
   doesn't matter where in the code we use it. For now it doesn't really matter
   what's in here, just that we return some DOM node.

## Anchor tags
There's no point in routing if you can't navigate between routes. The easiest way
to navigate between routes is to use `<a>` tags (anchor tags). Choo picks up
whenever a tag was clicked, and figures out which route to trigger on the
router.

```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.route('/', view)               // 1.
app.route('/second', second)       // 2.
app.mount('body')                  // 3.

function view () {
  return html`
    <body>
      <a href="/second">
        Navigate to the next route.
      </a>
    </body>
  `
}

function second () {
  return html`
    <body>
      <a href="/">
        Navigate back.
      </a>
    </body>
  `
}
```

1. We define our base view on route `/`. This is the first route that's loaded
   when someone visits our site. It contains a single anchor tag that points to
   `/second`.
2. We defined our second route as `/second`. This won't be shown unless someone
   navigates to `/second`. When it's rendered, it contains a single anchor tag
   that points to `/`.
3. We render our app to the DOM. Once it's loaded, people can click on anchor
   tags to switch between views.

## Fallback routes
Preparing for things to go wrong is an important part of programming. At some
point, someone using your application will land on an unexpected route. It's
important to not just crash the page, but to show something helpful to explain
what just happened. This is where fallback routes come in.

```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.route('/', view)               // 1.
app.route('/404', notFound)        // 2.
app.route('/*', notFound)          // 3.
app.mount('body')                  // 4.

function view () {
  return html`
    <body>
      <a href="/uh-oh">
        Click Click Click
      </a>
    </body>
  `
}

function notFound () {
  return html`
    <body>
      <a href="/">
        Route not found. Navigate back.
      </a>
    </body>
  `
}
```

1. We define our base view on route `/`. This is the first route that's loaded
   when someone visits our site. It contains a single anchor tag that points
   to `/uh-oh`, which is a route that doesn't exist.
2. It's good practice to define a fallback route as `/404`. This
   helps with debugging, and is often treated specially when deploying to
   production.
3. We define our fallback route as `*`. The asterisk symbol is pronounced
   "glob". Our glob route will now handle all routes that didn't match
   anything.
4. We mount the application on the DOM. If someone now clicks the link that's
   rendered in `/`, it will be handled by the fallback route.

## Querystrings
Sometimes you want to encode some meta information in a URL. This is
often done with querystrings. Querystrings look somewhat like this:
`?foo=bar&bin=baz`. This querystring contains two pairs: `foo=bar` and
`bin=baz`.

While using querystrings is great for URLs, when you want to use them
in a project, you'll probably want to convert them to an Object first.
Choo does this for you when URLs are updated, and exposes the
querystring pairs as `state.query`.

So `?foo=bar&bin=baz` would be exposed as `state.query.foo` and
`state.query.bin`.

## Dynamic routing
Sometimes there will be pages that have the same layout, but different data.
For example user pages, or blog entries. This requires _dynamic routing_. In
Choo we have two types of syntax for dynamic routing.

### Params
Params are declared with the `:` syntax. For example `/foo/:bar`. This means
that the `/foo` part is static, and `:bar` can be any value, up until the next
slash (`/`).

The value from a param is exposed in Choo as `state.params`. So say we have
the route `/foo/:bar`, and we navigate to `/foo/beep`, the value of
`state.params.bar` will be `'beep'`.

```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.route('/', placeholder)
app.route('/:user', placeholder)
app.route('/:user/:repo', placeholder)
app.route('/:user/settings', placeholder)
app.route('/404', placeholder)

function placeholder (state) {
  console.log(state.params)
  return html`<body>placeholder</body>`
}
```

### Wildcards
In most cases params are the answer for dynamic routing. They're named, readily
available, and easy to traverse. However, they can't cover cases where the
amount of slashes in route will be unknown.

Take for example GitHub's code view. To navigate to Choo's `html/raw` API, the
route is:
[github.com/choojs/choo/blob/master/html/raw.js](https://github.com/choojs/choo/blob/master/html/raw.js) .
In this case, all parts of the route after `master/` are unknown. This means
that `params` can't match the route correctly, because there's an unknown
amount of slashes after `master/`. This is what wildcards are for.

If we were building GitHub's code view with Choo, we could express the route
as: `/:user/:repo/blob/:branch/*`. The value of `state.params.wildcard` would
then be: `'/html/raw.js'`.

Try and use wildcards sparingly. They're the most powerful tool in the routing
toolbox, which means that if you're not careful you might end up reimplementing
a router on top of it yourself.

### 404s
There is one last thing we should touch on with dynamic routing: what to do
when a route is not found.

If you're using params or wildcards, there can always be a case where a route
isn't found. For example if we have the route `/:users`, if a particular user
does not exist, we might want to show a fallback route instead.

There are generally two approaches to this: hard redirects, and soft redirects.
- A hard redirect is when we redirect to a new route. For example if `/foobar`
  doesn't match a known user, we'll navigate to `/404` instead.
- A soft redirect is when the URL is kept the same, but different content is
  shown. For example if `/foobar` doesn't match, we'll require and render the
  content of the `/404` view instead.

It's generally recommended to use soft redirects, as they interfere the least
with the browser, and allow users to recover from an error (e.g. fix typos in a
url).

## Navigating to External Links
Some links in your app will point to other pages. In order to do this safely,
we must add some attributes to our link tags. This is needed, so the pages we
link to can't hijack our page.

In order to link to an external link, we must do one of the following:
- the click event had `.preventDefault()` called on it
- the link has a `target="_blank"` attribute with `rel="noopener noreferrer"`
- a modifier key is enabled (e.g. `ctrl`, `alt`, `shift` or `meta`)
- the link's href starts with protocol handler such as `mailto:` or `dat:`
- the link points to a different host
- the link has a `download` attribute

```js
var html = require('choo/html')
html`
  <a href="other.site.com/something" target=_blank rel="noopener noreferrer">
    Click to open in another page
  </a>
`
```

## Programmatic Navigation
Often it's needed to change routes after some event happens. For example,
someone logs in, and we need to redirect them to the logged in page. We need
programmatic navigation.

Choo comes with several events built-in to allow you to navigate using the
Browser's History API. The History API is a thin wrapper around a
[Stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)). As you
navigate, history entries are added to the stack. And when you hit the back
button, it pops entries off the stack.

These are the events that Choo ships with:

- `'pushState'` - navigate to a new route.
- `'replaceState'` - replace the current route with a new route. This is useful
  for things like redirects.
- `'popState'` - navigate to a previous route.
- `'navigate'` - emitted when any of the above events is emitted.

Most of the time you'll be wanting to use the `pushState` event. `replaceState`
and `popState` are much less common, although you might need them from time to
time.

_note:_ Anchor tags, buttons, and input submissions have slightly different
use cases. `<a>` tags are meant for static links to pages.
`<button>` tags are meant for conditional logic that doesn't always link to
another page. And `<input type="submit">` tags are meant to be used to submit
forms.

```js
var html = require('choo/html')
var choo = require('choo')
var app = choo()

var app = choo()
app.route('/', view)                 // 1.
app.route('/other', other)           // 2.
app.mount('body')

function view () {                   // 3.
  return html`
    <body>
      <a href="/">Navigate</a>
    </body>
  `
}

function other (state, emit) {       // 4.
  return html`
    <body>
      <button onclick=${onclick}>
        Go Back
      </button>
    </body>
  `

  function onClick () {
    emit('popState')
  }
}
```

1. Create an initial view for `/`.
2. Create a second view for `/other`.
3. The initial view renders a single link to `/other`.
4. The second view renders a button. When clicked, it sends you back to the
   previous route.

## Listening For Route Changes
As we briefly mentioned in the previous section, we can listen to route
changes using the `'navigate'` event.

```js
var html = require('choo/html')
var choo = require('choo')
var app = choo()

var app = choo()
app.use((state, emitter) => {            // 1.
  emitter.on('navigate', (route) => {    // 2.
    console.log(`Navigated to ${route}`) // 3.
  })
})
```

1. Create a new store.
2. Listen to a navigate event.
3. Whenever navigate is emitted, we log out what the new route is we're
   navigating to. `route` is a string here.

## Hash Routing
Sometimes when you deploy a static app, you can't control the server
part of it. Changing the route might mean the server interprets it
differently, causing problems to occur when reloading the page.

To work around this, Choo supports hash routing. Instead of writing a
route as `foobar.com/bin/baz`, you can write it as `foobar.com#bin/baz`.

```js
var choo = require('choo')
var app = choo()

app.route('/', view)
app.route('#hi', view)
app.route('#hi/hello', view)

function view (state, emit) {
  return html`
    <body>${state.route}</body>
  `
}
```

## Page Anchors
Another use of hashes in urls is to map to anchors on the page. This is
commonly used for headings in articles. So when a link is shared,
they're navigated to the right heading in the page.

Choo supports page anchors out of the box. It tries to match anchors on
the page first. If no matching anchor is found, Choo will try to find a
matching route in the router. If no matching route is found, the regular
fallback behavior occurs, such as navigating to a 404 route. See
[Fallback Routes](#fallback-routes) for more on this.

## Disabling Routing
There are cases where you might not need routing at all, for example
when using Choo to create iframe widgets. Choo accepts options in the
contructor to disable either hrefs or the entire history API
integration (including hrefs).

Because there is no more routing events available, you'll need to handle
it yourself. You can manually change the value of `state.href`, before
calling the `'render'` event. Or perhaps even simpler would be to only
use a single route. It's up to you at this point.

```js
var choo = require('choo')
var app = choo({ href: false }) // 1.
```
1. Disable the handling of `<a href="">` links.


```js
var choo = require('choo')
var app = choo({ history: false }) // 1.
```
1. Disable the handling of `<a href="">` links, and all built-in history
   events.

## Scroll Restoration
Browsers are generally quite good at scrolling pages. When using the
history API, previous locations on the page are restored. But this is
not great for every app.

If for example you want to always scroll to the top of the page whenever
we navigate, you'll notice the page jumping around. This is not great
user experience.

In order to manually take control of scrolling whenever page navigation
occurs, we can make use of
[history.scrollRestoration](https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration).
Setting the value to `'manual'` disables all default scroll behavior, allowing us to take control
instead.

```js
if (typeof window !== 'undefined' && window.history.scrollRestoration) {
  window.history.scrollRestoration = 'manual'
}
```
