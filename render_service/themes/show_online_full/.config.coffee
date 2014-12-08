# global tpl config
prepare = ($) ->
  $.params("res", $.req.app.conf.resources)
  $.params("auth_user", $.req.auth_user())
  $.params("topics_bg", {"fizruk": $.req.app.conf.resources.img + "fizruk_bg.jpg", "dom2": "fizruk": $.req.app.conf.resources.img + "dom2_bg.jpg"})

module.exports = prepare