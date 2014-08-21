# * test api module
# * part of engine
#
# usage: api.call(method, method_type, args, params, callback)
make_ipc_pack = (method, method_type, params) ->
  ipc_pack =
    api_method: method
    api_type: method_type
    token: params.token
    x_token: params.x_token
    query_params: params

  return ipc_pack

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

    ipc_pack = make_ipc_pack(method, method_type, params)
    @client.connect app.config.connection_string
    @client.invoke 'route', ipc_pack, (err, res, more) ->
      if err
        callback 500
      else
        try
          callback 200, res
        catch e
          callback 500

module.exports = Api