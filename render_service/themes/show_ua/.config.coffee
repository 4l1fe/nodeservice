# global tpl config

prepare = ($) ->
  $.params("res", $.req.app.conf.resources)
  $.params("user_is_auth", $.user_is_auth())
  $.params("auth_user", $.auth_user())
  $.params("page_title", "Шоу онлайн")
  $.params("meta_keywords", "")
  $.params("meta_description", "")

module.exports = prepare