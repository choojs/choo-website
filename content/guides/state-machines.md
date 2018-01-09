# state machines
If you work in software long enough, you'll have to deal with legacy codebases.
but you'll also have had the chance to start projects from scratch. And
eventually see your project become a legacy codebase itself.

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

----

Pretty cool! Now we've given names to our events. We're called the event
"timer",

Note that "green" can never transition to "red" directly. It will always have to
change to "orange" first. We have now successfully expressed the different
states we can be in - and the relationships between them. Pretty neat!
