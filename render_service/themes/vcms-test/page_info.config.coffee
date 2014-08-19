md5 = require "MD5"
prepare = ($) ->
  device_hash = $.query_info("ip") + " " + md5($.query_info("agent"))
  console.log $.cache(device_hash)
  if $.cache(device_hash) != undefined
    device_hash+= "/!\\"
  else
    $.cache(device_hash, "here", 10)

  $.params("device_hash", device_hash)
  $.params("device_info", $.device_info())
  $.params("query_info", $.query_info())

module.exports = prepare