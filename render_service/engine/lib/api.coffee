# * test api module
# * part of engine
#
# usage: api.call(method, method_type, args, params, callback)

fs = require('fs')
Client = require('zerorpc').Client
app = global.app

class Api
  constructor: (@app) ->
    @STATUS_OK = 200
    @STATUS_NOT_FOUND = 404
    @STATUS_INTERNAl_ERROR = 500
    @client = new Client();

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

    method = "/" + method if method.substr(0,1) != "/"
    ipc_pack = app.makeIpcPack(method, method_type, params, params.token, params.x_token, params.meta)
    @client.connect app.config.connection_string
    @client.invoke 'route', ipc_pack, (err, res, more) ->
      if err
        callback err.code
      else
        try
          callback 200, res
        catch e
          callback 500

module.exports = Api