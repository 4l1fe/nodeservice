prepare = ($) ->
  $.params("device_info", $.device_info())
  $.params("query_info", $.query_info())

module.exports = prepare