# state machines
If you've been writing software long enough, you'll probably have had to work on
legacy codebases, but also had the chance to start things from scratch - and
eventually hand them off.

A big challenge in software engineering is: "how do we keep applications
maintainable?" Because if software isn't maintainable, it can be hard to change,
and onboard new people into the codebase. This has all sorts of downsides, but
most notably: it makes working on the codebase less fun!

The way to solve maintainability is to find the right abstractions. I't

[TODO]

The same question applies to building User Interfaces. How can we keep iterating
on our application, but keep the codebase managable. The answer often lies in
finding the right abstractions.

Today we'll be talking about an abstraction that works particularly well for
User Interfaces: State Machines.

## What is a state machine?
You can think of a state machine as a data structure used to express states and
the relationships between them. A state machine can only be in a single state at
any given time, and from that state it can only progress to particular states.

Let's make this a little less abstract. Take for example a (Dutch) traffic
light. In the Netherlands, traffic lights start out as "green". From "green"
they can transition to "orange". And from "orange", they can transition to
"red". And "red" can in turn transition to "green". We could write this down as:

```txt
green  => orange
orange => red
red    => green
```

Note that "green" can never transition to "red" directly. It will always have to
change to "orange" first. We have now successfully expressed the different
states we can be in - and the relationships between them. Pretty neat!
