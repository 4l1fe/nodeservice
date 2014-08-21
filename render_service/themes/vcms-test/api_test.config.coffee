prepare = ($) ->
  $.api "/test/echo/:id", "get", $.args(), $.params()

module.exports = prepare