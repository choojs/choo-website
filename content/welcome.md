# Create fun, performant, and maintainable applications in minutes.

Choo is a small framework to build applications of all kinds. It takes care of
wiring up all the bits you need so you can start building things straight away.

Out of the box it comes with a router, view layer, and data layer. To tie it
all together it uses a single state object, and an event emitter. This is then
all neatly packaged together, ready to be used.

## Choo Architecture

```sh
You ----→ DOM ←------- Views
           |             ↑
           |             |
           |             |
           ↓             |
         Stores -----→ Router
```

You can think of Choo as a glue layer between your application code, and the
DOM. It makes updating the DOM easy by using declarative rendering, and make
interacting with the DOM simpler by using a central event emitter.

In Choo there are two main abstractions: stores and views.

## Next steps

- [Follow the quickstart]('/quickstart')
- [Read the introduction]('/introduction')
- [Read the reference]('/reference')
