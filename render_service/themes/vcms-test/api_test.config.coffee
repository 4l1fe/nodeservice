prepare = ($) ->
  $.api("/test/:id", "data", $.args())

  test_func = (code, params) ->
    if code == $.req.app.api.STATUS_OK
      $.params("simple", params.data.text + ". GOT IT!")
    else
      $.params("simple_error", "Something wrong")

  $.api("simple", test_func)

module.exports = prepare