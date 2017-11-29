# Routing
Choo is built up out of two parts: stores and views. In order to render a view,
it must be added to the application through `app.route()`. This is the router.

In many other frameworks, routing is done by a separate library. We found that
routing is common in most applications, so making it part of the framework
makes sense.

Routing has a few parts to it. Routing must handle the browser's history API
(e.g.  going forward & backwards). It must handle anchor tags, and programmatic
actions. There's more than a few moving pieces.

To perform routing, Choo uses a [Trie](https://en.wikipedia.org/wiki/Trie) data
structure. This means that our routings is fast, and the order in which routes
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
4. We declare our view at the bottom of the page. Thanks to "Scope Hoisting",
   we can use it higher in the code. For now it doesn't really matter what's in
   here, just that we return some DOM node.

## Anchor tags
There's no point in routing if you can't navigate between them. The easiest way
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
    <body>
      <a href="/">
        Navigate back.
      </a>
    </body>
}
```

1. We define our base view on route `/`. This is the first route that's loaded
   when a person visits our site. It contains a single anchor tag that points
   to `/second`.
2. We defined our second route as `/second`. This won't be shown unless someone
   navigates to `/second`. When it's rendered, it contains a single anchor tag
   that points to `/`.
3. We render our app to the DOM. Once it's loaded, people can click on anchor
   tags to switch between views.

## Fallback routes
Preparing for things to go wrong is a large part of programming. At some point,
someone using an application will land on an unexpected route. It's important
to not just crash the page, but to show something helpful to explain what just
happened. This is where fallback routes come in.

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

function not found () {
    <body>
      <a href="/">
        Route not found. Navigate back.
      </a>
    </body>
}
```

1. We define our base view on route `/`. This is the first route that's loaded
   when a person visits our site. It contains a single anchor tag that points
   to `/uh-oh`, which is a route that doesn't exist.
2. It's good practice to define a fallback route statically as `/404`. This
   helps with debugging, and is often treated specially when deploying to
   production.
3. We define our fallback route as `*`. The asterix symbol is pronounced
   "glob". Our glob route will now handle all routes that didn't match
   anything.
4. We mount the application on the DOM. If someone now clicks the link that's
   rendered in `/`, it will be handled by the fallback route.
