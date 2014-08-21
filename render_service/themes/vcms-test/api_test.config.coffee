prepare = ($) ->
  $.api "/test/echo/1", "get", $.args(), $.params()

module.exports = prepare