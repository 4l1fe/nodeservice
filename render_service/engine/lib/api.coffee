# * test api module
# * part of engine
#
# usage: api.call(method, method_type, args, params, callback)

fs = require('fs')
app = global.app

class Api
  constructor: (@app) ->
    @STATUS_OK = 200
    @STATUS_NOT_FOUND = 404
    @STATUS_INTERNAl_ERROR = 500

  call: (method, method_type, args, params, callback) ->
    # method - method path (/user/info or /films/:id/info)
    # method_type - type of request: get, post, delete
    # args - arguments object (replaces param in method, for example:
    #         method = /films/:id/info
    #         args = {id: 10}
    #         result method = /films/10/info
    # params - params for method call
    # callback - callback function, call with params:
    #         code - return code (HTTP code usually)
    #         json - json response

    # replace params in method with args
    if args != undefined
      for own key, val of args
        method = method.replace(":" + key, val)

    # TEST BLOCK
    # ignore method_type and params, just test
    method = "/" + method if method[0] != "/"
    fs.readFile @app.conf.path + '/tmp/api' + method, 'utf8', (err,data) ->
      if err
        callback(500)
      else
        try
          json = JSON.parse(data.toString())
          callback(200, json)
        catch e
          callback(500)

module.exports = Api