title: State Machines
----
view: doc
----
excerpt:
State machines are a great way to manage different states in your application.
In this section we'll learn how to use and implement state machines.
----
text:
If you work in software long enough, you'll have to deal with legacy codebases.
but you'll also have had the chance to start projects from scratch. And
eventually you'll see your project become a legacy codebase itself.

A big challenge in software engineering is: "how do we keep applications
maintainable?" Because if software isn't maintainable, it can be hard to change,
and get other people involved. This is not great for many reasons, but most
importantly: it makes working with the code less fun!

So we try and keep code maintainable. Like with gardening, this is an active
effort. Because if we don't pay attention, weeds will sprout. So we document
things. Plan things. Refactor things. All so we can find the right abstractions
to keep our code maintainable.

Today we'll be talking about an abstraction that works particularly well for
User Interfaces: State Machines.

## What is a state machine?
You can think of a state machine as a data structure that's used to express
states and the relationships between them. A state machine can only be in a
single state at any given time, and from that state it can only progress to
particular states.

Let's make this a little more practical. Take for example a (Dutch) traffic
light. In the Netherlands, traffic lights start out as "green". From "green"
they can transition to "orange". And from "orange", go to "red". And from "red",
back to "green". We could write this down as:

```txt
green  => { orange }
orange => { red }
red    => { green }
```

From the chart above, we can see that "green" can go to "orange". But green can
never directly transition to "red". So we've now successfully expressed
relations between code. Neat!

Let's take this a step further though. What if we wanted to have different
transitions available? We'd need to start by giving our transitions names. Let's
name the existing transition "timer", because transitions of the current state
are all based on a timer.

```txt
green  => { timer: orange }
orange => { timer: red }
red    => { timer: green }
```

And that's the basics. From here we could go on to add more states and
transitions, expanding the graph.

## State machines in JavaScript
Let's implement the traffic light example in JavaScript. In order for this to
work, we'll need to implement:
- Saving the states & transitions in an Object
- The core state machine algorithm
- Creating a small, stateful class to hold the state
- Combining all of these to form the complete state machine.

Let's dig in!

### Data
The first step is to write down our states and transitions:

```js
var transitions = {
  green: { timer: 'orange' },
  orange: { timer: 'red' },
  red: { timer: 'green' }
}
```

There's only one piece of information missing now: our initial state. Let's
define it.

```js
var initialState = 'green'
```

### Core Algorithm
Each state links to several other states, which are referenced by transition
names. The base algorithm for state machines is:
- Look up the current state in the state machine data.
- Look up the desired transition onto the current state.
- Return the new state.

```js
function stateMachine (transitions, currentState, transitionName) {
  var newState = transitions[currentState][transitionName]
  return newState
}
```

Or in a more compact notation:

```js
var stateMachine = (t, c, n) => t[c][n]
```

### Class
While the state machine algorithm is quite simple, it requires us to keep track
of what the current state is. This means that state machines themselves are
stateful. Luckily we can create a simple interface for this using classes.

Let's create a class that takes an initial state + state map as the initial
arguments, and implements one method called `.transition(transitionName)`.

_note: the `class` notation here is for brevity. It's the idea that matters more
than the implementation. So feel free to write this down however you prefer!_

```js
class StateMachine {
  constructor (initialState, transitions) {
    this.state = initialState
    this.transitions = transitions
  }

  transition (transitionName) {
    var nextState = this.transitions[this.state][transition]
    if (!nextState) throw new Error(`invalid: ${this.state} -> ${transitionName}`)
    this.state = nextState
  }
}
```

The value of `.state` is the current state we're in. If an invalid transtion
occurs, the state machine throws an error explaining which transition was
invalid.

### Combining Data & State
Now that we have all our individual bits, let's combine it all together:

```js
var machine = new StateMachine('green', {
  green: { timer: 'orange' },
  orange: { timer: 'red' },
  red: { timer: 'green' }
})

machine.transition('timer')
console.log(machine.state) // => 'orange'

machine.transition('timer')
console.log(machine.state) // => 'red'

machine.transition('timer')
console.log(machine.state) // => 'green'
```

## Wrapping Up
And that's all it takes to implement a fully functional state machine. As you
can see there's not much code to it.

From here there are a few more features that could be added, such as:
- Event hooks to trigger events when certain transitions happen.
- Combining several state machines into a larger one.
- Automatic traversal of state machines using pathfinding algorithms.
- Parallel state machines.
- Nested state machines.

We'll leave this as an exercise up to the reader.

## Nanostate
If you're looking for a solid state machine implementation, check out
[choojs/nanostate](https://github.com/choojs/nanostate). It's similar to the
state machine we implemented in the section above, but adds event hooks, clean
error messages, and more.
