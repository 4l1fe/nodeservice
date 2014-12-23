 # log (output to console) messages
@log_msg = (msg, type = "normal") ->
  # type =
  #   normal - normal messages (general)
  #   warn - warning messages
  #   crit - critical messages, halt on event
  time = new Date()
  prefix = ''
  if type == "crit"
    prefix = '(E) '
  if type == "warn"
    prefix = '(!) '
  console.log prefix + time + ". " + msg
  if type == "crit"
    halt()

# parse function parameters (arguments)
@parseParams = (args, params, start = 0) ->
  # args - function arguments
  # params -  name and type of params, array
  #           element = [name, type (typeof), default (optional)]
  # start - start index
  result = {}
  args_pos = start
  for param in params
    if param[1] == undefined
      result[param[0]] = args[args_pos]
    else if typeof(args[args_pos]) == param[1]
      result[param[0]] = args[args_pos]
      args_pos++
    else
      result[param[0]] = param[2]
  result

# function to make ipc_pack
@makeIpcPack = (method, method_type, params, token = null, x_token = null, meta = {}) ->
  # method - method path (/user/info or /films/1/info)
  # method_type - type of request: get, post, delete
  # params - params for method call
  ipc_pack =
    api_method: method
    api_type: method_type
    token: token
    x_token: x_token
    query_params: params
    meta: meta

  return ipc_pack

@log_msg("Set up application")
# include common libs
sys = require ('sys')
http = require('http')
url = require('url')

# set ap global var "app", you can use it in any modules
global.app = app = @

# load config
@log_msg("Loading global config")
@conf = app.config = require('./config')

#load engine libs
@log_msg("Loading libraries")
app.helper = require(@conf.lib_path + "helpers")
app.Request = require(@conf.lib_path + "request")
app.Template = require(@conf.lib_path + "template")
Cache = require(@conf.lib_path + "cache")
Router = require(@conf.lib_path + "router")
Api = require(@conf.lib_path + "api")
JadeCompiler = require(@conf.lib_path + "jade-compiler")

# create router and api instances
app.router = new Router(@)
app.api = new Api(@)
app.cache = new Cache()
app.jade_compiler = new JadeCompiler()

# add default routes
# / and /index.html - template {tpl_page_prefix}_index
# /{page} - temlate {tpl_page_prefix}_{page}
app.router.add("/", "tpl", @conf.tpl_page_prefix + "index")
page_route = app.router.add(/^\/([a-z0-9\-]+)$/i, "tpl", @conf.tpl_page_prefix + "$1")
app.router.alias(page_route, /^\/([a-z0-9\-]+)\.html?$/i)

# load theme config
@log_msg('Use theme "' + @conf.theme_name + '"')
@log_msg("Loading theme config")
try
  @theme_conf = app.theme_conf = require(@conf.themes_path + @conf.theme_name + "/config")
catch e
  @log_msg("No theme config found", "warn")
  console.log e

# set up HTTP server
@log_msg("Starting HTTP server on " + @conf.app_host+":"+@conf.app_port + " with backend on " + @conf.backend_host+":"+@conf.backend_port)
server = http.createServer (req, res) ->
  if req.url != "/favicon.ico"
    # create request instance
    user_request = new app.Request(req, res)
    # run router
    app.router.run user_request, (route) ->
      # if pure html, output it
      if route.type == "html"
        user_request.response_html(route.html)
      # if template found, move to template generation
      else if route.type == "tpl"
        tpl = new app.Template(route.tpl, user_request, route)
      # if code, output it
      else if route.type == "code"
        user_request.response_code(route.code, "HTML Error " + route.code)
      # output 404 error on unknown type
      else
        user_request.response_code(404)

# start up HTTP server
server.listen(@conf.app_port, @conf.app_host)

@log_msg("Application is running and ready")