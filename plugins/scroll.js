module.exports = scroll

function scroll (state, emitter, app) {
  emitter.on(state.events.NAVIGATE, function () {
    window.scrollTo(0, 0)
  })
}
