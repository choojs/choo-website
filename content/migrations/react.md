# Migrating From React
Choo borrows heavily from React. For many of us, it was the first experience we
had with declarative rendering, and separation of events and data.

However, there are a good amount of differences. At its core Choo is
"declarative rendering" + "shared event emitter" + "router". Once you understand
how these pieces fit together, you'll quickly be able to create an intuition for
how Choo operates.

## Creating New Projects
React recommends using
[create-react-app](https://github.com/facebookincubator/create-react-app) to
create new project. Choo has a similar project called
[create-choo-app](https://github.com/choojs/create-choo-app/). The output is
different, but the process should feel familiar coming from React.

## Declarative Rendering
Both React and Choo have a system that allows you to define of "this is what the
DOM should look like". React uses JSX, and Choo uses Template String Literals.
Let's take a look at how a "hello world" example compares:

#### React
```js
var { ReactDOM } = require('react')

var tree = (<h1>Hello, world!</h1>)
ReactDOM.render(tree, document.body)
```

#### Choo
```js
var html = require('choo/html')

var tree = html`<h1>Hello, world!</h1>`
document.body.appendChild(tree)
```

Quite similar, but not the same.

### Attribute names
HTML elements take all sorts of attributes. In React these attributes are named
differently from the DOM (usually camel cased, but sometimes including other
changes too). In Choo they have the same name as the DOM.

Take for example the `class` attribute. In React this would be `className=`. In
Choo it remains `class`.

#### React
```js
var tree = (
  <h1 className="foo bar">
    Hello, world!
  </h1>
)
```

#### Choo
```js
var tree = html`
  <h1 class="foo bar">
    Hello, world!
  </h1>
`
```

### The Style Attribute
A special attribute in React is the `style=` attribute. It takes an object
containing style properties. In Choo we follow the DOM specification, and accept
CSS directly.

#### React
```js
var styles = {
  color: 'white',
  background: 'black'
}
var tree = (
  <h1 style={styles}>
    Hello, world!
  </h1>
)
```

#### Choo
```js
var styles = `
  color: white;
  background: black;
`
var tree = html`
  <h1 style=${styles}>
    Hello, world!
  </h1>
`
```

### DOM Events
React uses a wrapper around DOM events called ["synthetic
events"](https://reactjs.org/docs/events.html). Choo exposes the DOM's events
directly. The most notable difference here is that you can pass DOM events
around asynchronously in Choo, while you can't do that in React.

Binding events in Choo and React is quite similar, with a few syntactic
differences.

#### React
```js
var tree = (
  <button onclick={onclick}>
    Click me!
  </button>
)

function onclick (e) {
  console.log('click!')
}
```

#### Choo
```js
var tree = html`
  <button onclick={onclick}>
    Click me!
  </button>
`

function onclick (e) {
  console.log('click!')
}
```

## Classes
React uses classes with lifecycles to componentize application code. We're in
the process of introducing classes into Choo as well, because we like this
pattern. You can follow along on the progress in
[choojs/choo#593](https://github.com/choojs/choo/issues/593) and
[choojs/choo#606](https://github.com/choojs/choo/pull/606).

## Routing
The most common router in React is probably `react-router`. It uses custom HTML
tags to do the routing inline.

### Base routing
Let's create a basic routing example. We create two routes: `/`, and `/foo`.

#### React
```js
var { BrowserRouter, Switch, Route } = require('react-router-dom')
var render = require('react-dom').render
var React = require('react')

var tree = (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={mainView} />
      <Route path='/foo' component={fooView} />
    </Switch>
  </BrowserRouter>
)
render(tree, document.body)

function mainView () {
  return (
    <div>
      Woot, main view!
    </div>
  )
}

function fooView () {
  return (
    <div>
      Woot, foo view!
    </div>
  )
}
```

#### Choo
```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.route('/', mainView)
app.route('/foo', fooView)
app.render('body')

function mainView (state, emit) {
  return html`
    <body>
      Woot, main view!
    </body>
  `
}

function fooView (state, emit) {
  return html`
    <body>
      Woot, foo view!
    </body>
  `
}
```

### Hyperlinks
Linking from one page to another is a common thing. In HTML we use `<a>`
(anchor) tags for this purpose. With `react-router`, the recommended way is by
using the `<Link>` tag. In Choo we detect whenever an `<a>` tag has been
clicked, and handle routing inside our router.

#### React
```js
var { BrowserRouter, Switch, Route } = require('react-router-dom')
var render = require('react-dom').render
var React = require('react')

var tree = (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={mainView} />
      <Route path='/foo' component={fooView} />
    </Switch>
  </BrowserRouter>
)
render(tree, document.body)

function mainView () {
  return (
    <div>
      <Link to="/foo">
        Click to go to foo.
      </Link>
    </div>
  )
}

function fooView () {
  return (
    <div>
      <Link to="/">
        Click to go back home.
      </Link>
    </div>
  )
}
```

#### Choo
```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.route('/', mainView)
app.route('/foo', fooView)
app.render('body')

function mainView (state, emit) {
  return html`
    <body>
      <a href="/foo">
        Click to go to foo.
      </a>
    </body>
  `
}

function fooView (state, emit) {
  return html`
    <body>
      <a href="/">
        Click to go to back home.
      </a>
    </body>
  `
}
```
