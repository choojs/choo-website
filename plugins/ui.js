var xtend = require('xtend')

module.exports = plugin

function plugin (state, emitter, app) {
  state.ui = {
    exampleActive: false
  }

  state.events.UI = 'ui'
  emitter.on(state.events.UI, handleUpdate)

  function handleUpdate (data) {
    if (typeof data === 'object') {
      var render = data.render
      delete data.render
      state.ui = xtend(state.ui, data)
      if (render !== false) emitter.emit(state.events.RENDER)
    }
  }
}
