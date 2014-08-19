# global tpl config

prepare = ($) ->
  $.params("res", $.req.app.conf.resources)

module.exports = prepare