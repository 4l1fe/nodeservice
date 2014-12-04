# * template library
# * part of engine

jade = require('jade')
fs = require('fs')
templates = {}
app = global.app

global_config = undefined

# load global config for theme
try
  global_config = require(app.conf.theme_global_config)
catch e
  app.log_msg 'Unable to load global config for theme "' + app.conf.theme_name + '"'
  global_config = undefined

# Stack class
# use for async request (e.g. API)
#TODO: terminate on timeout

class Stack
  # init instance
  constructor: (@_success = undefined, @_fail = undefined) ->
    # _success - callback on success
    # _fail - callback on fail
    @_counter = 0
    @_timeout = 0
    @_queue = []
    @_final_marker = false

  # push async callback
  push: (callback = undefined, params_names = undefined) ->
    # callback - function to callback
    # params_names - names params in returned result, start from 1

    # init queue element and increase counter
    time = new Date()
    @_counter++
    obj =
      time: time
      callback: callback
      running: true
    @_queue.push obj

    # return callback to be run
    (data) =>
      if callback
        # run callback with retured params
        params = {}
        if params_names != undefined
          for i in [0..params_names.length - 1]
            params[params_names[i]] = arguments[i + 1]
        callback(data, params, arguments)
      # clear queue element state and decrease counter
      obj.running = false
      @_counter--
      # call final if counter is zero
      @final(false) if @_counter <= 0

  # final event
  final: (marker = true) ->
    @_final_marker = true if marker
    # call _success if counter is zero and final marker set to true
    @_success() if @_final_marker && @_counter <=0 && @_success

  fail: ->
    @_fail() if @_fail


class Template
  # init template instance
  constructor: (@name, @req, @route) ->
    # name - name of template
    # req - request instance
    # route - route object
    if templates[@name] && templates[@name].is_broken
      # return 500 if template marked as broken
      @req.response_code(500)
    else
      templates[@name] = {} if templates[@name] == undefined
      # proceed tempalte
      @_proceed()
      ###
        fs.readFile @req.app.conf.theme_path + @name + @req.app.conf.jade_ext, (err, data) =>
          templates[@name] = {} if templates[@name] == undefined
          if err
            @req.app.log_msg 'Unable to load template "' + @name + '" for theme "' + @req.app.conf.theme_name + '"\nFile ' + @req.app.conf.theme_path + @name + @req.app.conf.jade_ext + ' not found', "warn"
            templates[@name].is_broken = true
            @req.response_code(500)
          else
            templates[@name].jade = jade.compile(data.toString())
            templates[@name].is_loaded = true
            @_compile(templates[@name])
      ###

  _proceed: () ->
    # init params and stack
    @_params = {}
    @stack = new Stack(
      => @_compile()
      => @_fail()
    )
    tpl = templates[@name]
    global_config(@) if global_config
    if !tpl.config_loaded
      # trying to load template config if it is not loaded
      try
        tpl.config = require(@req.app.conf.theme_path + @name + @req.app.conf.tpl_config_ext)
      catch e
        @req.app.log_msg 'Unable to load config for template "' + @name + '"'
      tpl.config_loaded = true
    # run template config and finalize
    tpl.config(@) if tpl.config
    @stack.final()

  _compile: () ->
    # try to render template
    try
      @req.response_html jade.renderFile(@req.app.conf.theme_path + @name + @req.app.conf.jade_ext, @params())
    catch e
      # return 500 if fail
      @req.response_code 500
      @req.app.log_msg 'Failed to compile template "' + @name + '". Error message: ' + e.toString(), "warn"
      templates[@name] = {} if templates[@name] == undefined
      templates[@name].is_broken = true
      @req.app.log_msg 'Template "' + @name + '" marked as "broken"', "warn"

  _fail: () ->
    @req.app.log_msg 'Unable to proceed template "' + @name + '" for session ' + @session().id
    @req.response_code 500

  # call api function from api engine module
  _api: (_args) ->
    # method, param_name/callback [, method_type] [, args] [, params]
    args = app.parseParams(_args, [["method_type", "string", "get"], ["args", "object", {}], ["params", "object", {}]], 2)
    if _args.length < 2
      return
    args.method = _args[0]
    if typeof (_args[1]) == "function"
      args.callback = _args[1]
    else
      args.param_name = _args[1]
    if args.method == undefined || (args.callback == undefined && args.param_name == undefined)
      return
    self = @
    if args.callback == undefined
      # set own callback if not defined
      args.callback = (code, params) =>
        if code == @req.app.api.STATUS_OK
          @.params(args.param_name, params.data)

    @req.app.api.call args.method, args.method_type, args.args, args.params, @stack.push(args.callback, ["data"])

  api: () ->
    # method, param_name/callback [, method_type] [, args] [, params]
    # call api with arguments
    @_api arguments

  api_cache: (param_name, expire) ->
    # param_name, expire, method[, method_type] [, args] [, params]
    val = @cache(param_name)
    if val == undefined
      args = arguments.splice(2)
      args.splice 1, 0, (code, params) =>
        if code == @req.app.api.STATUS_OK
          @.params(param_name, params.data)
          @.cache(param_name, params.data, expire)
    else
      return val

  api_get: () ->
    # method, param_name/callback [, args] [, params]
    # call api with arguments and method_type = get
    arguments.splice(1, 0, "get")
    @_api arguments

  api_post: () ->
    # method, param_name/callback [, args] [, params]
    # call api with arguments and method_type = post
    arguments.splice(1, 0, "post")
    @_api arguments

  api_put: () ->
    # method, param_name/callback [, args] [, params]
    # call api with arguments and method_type = put
    arguments.splice(1, 0, "put")
    @_api arguments

  api_delete: () ->
    # method, param_name/callback [, args] [, params]
    # call api with arguments and method_type = delete
    arguments.splice(1, 0, "delete")
    @_api arguments

  query_info: (name) ->
    @req.query_info name

  device_info: (name) ->
    @req.device_info name

  query_params: (name) ->
    @req.query_params name

  user_is_auth: ->
    @req.user_is_auth()

  auth_user: (callback) ->
    @req.auth_user callback

  session: ->
    @req.session()

  # return or set template params
  params: (name = undefined, value = undefined) ->
    if name == undefined
      return @_params
    else if value != undefined
      @_params[name] = value
    @_params[name]

  # return arguments from route
  args: (name = undefined) ->
    if name == undefined
      return @route.args || {}
    else if @route.args == undefined
      return undefined
    @route.args[name]

  # return matches from route
  matches: (id = undefined) ->
    if id == undefined
      return @route.matches
    else if @route.matches == undefined
      return undefined
    @route.matches[id]

  cache: (name, value = undefined, expired = undefined) ->
    if value == undefined
      return app.cache.get(name)
    else
      return app.cache.put(name, value, expired)

  cache_remove: (name) ->
    app.cache.clear(name)

  redirect: (url, status = 200) ->


module.exports = Template