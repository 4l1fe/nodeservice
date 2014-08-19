# * router module
# * part of engine
#
# usage:
#   router.add("/mypage", "tpl", "mypage_jade")
#   router.add("/films/:id", "func", my_func)
#   router.add(/^\/films\/([0-9]{3,})\/, "tpl", "page_film")
#
#   router.alias("/films/:id", "/f/:id")
#   router.alias("/films/:id", /^\/film_([0-9]+)\.html$/i)


class Router
  constructor: () ->
    @app = global.app
    @routes = []
    @_default = {type: "code", param: 404}
    return @

  # complete path object
  _path_to_obj: (path) ->
    res =
      regexp: null
      args: null
      path: path

    if path instanceof RegExp
      # set as is, if path is regexp yet
      res.regexp = path
    else
      # test if path has some params
      if /\/\:[a-z0-9]+/i.test(path)
        # create regexp for path
        path_arr = path.split("/")
        path_restr = "^"
        args = []
        for i in [1..path_arr.length - 1]
          path_el = path_arr[i]
          if path_el[0] == ":"
            args.push(path_el.substr(1))
            path_el = "([a-z0-9A-Z\-\.]+)"
          path_restr+= "\/" + path_el
        res.regexp = new RegExp(path_restr + "$")
        res.args = args
    res

  # add new path
  add: (path) ->
    # set type and param depends on arguments
    # path can be:
    #   1. RegExp
    #       example: ^\/somepath\/([0-9])+\/([abcde]{3,4})$
    #   2. Simple path
    #       example: /myapp/info.html
    #   3. Path with arguments
    #       example: /films/:id
    type = "tpl"
    if arguments.length > 2
      type = arguments[1]
      param = arguments[2]
    else
      param = arguments[1]
      if typeof param == "function"
        type = "func"

    # default type is "tpl"
    if type != "tpl" && type != "func" && type != "code" && type != "html"
      type = "tpl"

    # init route object
    route =
      type: type
      param: param
      path: path

    # parse and push new route
    path_parsed = @_path_to_obj(path)
    route.regexp = path_parsed.regexp
    route.args = path_parsed.args
    @routes.push(route)

    # return new route, useful for @alias
    route

  # add alias to path
  alias: (path, alias) ->
    path_found = undefined
    if typeof path != "object"
      # if path is not object, looking for path in routes
      i = 0
      while i < @routes.length && @routes[i].path != path
        i++
      if i < @routes.length
        path_found = @routes[i]
    else
      # path is object, no need to find
      path_found = path

    if path_found
      # add new alias to route
      if path_found.alias == undefined
        path_found.alias = []
      path_found.alias.push(@_path_to_obj(alias))

    path_found

  # set default route
  default: (type, param) ->
    @_default =
      type: type
      param: param

  # clear all routes
  clear: () ->
    @routes = []
    @default "code", 404

  # run request, looking for route
  run: (request, callback) ->
    # prepare
    path = request.query_info("path")
    i = @routes.length - 1
    route = undefined
    # look for route, LIFO
    while i >= 0 && !route
      # check if route regexp test or path is equal
      if (@routes[i].regexp && @routes[i].regexp.test(path)) || (!@routes[i].regexp && @routes[i].path == path)
        # set route if equal
        route =
          type: @routes[i].type
          param: @routes[i].param
          regexp: @routes[i].regexp
          args_names: @routes[i].args

      # check aliases
      if !route && @routes[i].alias
        n = 0
        alias = @routes[i].alias
        # check if alias regexp or path is equal
        while n < alias.length && !((alias[n].regexp && alias[n].regexp.test(path)) || (!alias[n].regexp && alias[n].path == path))
          n++
        if n < alias.length
          # set route if equal
          route =
            type: @routes[i].type
            param: @routes[i].param
            regexp: alias[n].regexp
            args_names: alias[n].args
      i--

    # set route to default if not found
    route = @_default if route == undefined

    if route.type == "code"
      # return code in callback
      callback({type: "code", code: route.param})
    else if route.type == "html"
      # return html in callback
      callback({type: "html", html: route.param})
    else
      if route.regexp
        # if route has regexp, set args and matches
        route.args = {}
        route.matches = route.regexp.exec(path)
        if route.args_names
          for i in [0..route.args_names.length - 1]
            route.args[route.args_names[i]] = route.matches[i + 1]
      if route.type == "tpl"
        # return tpl name and route if route is tpl
        tpl = route.param
        if route.args
          for own key, arg of route.args
            tpl = tpl.replace("{" + key + "}", arg)
        if route.matches
          for match, i in route.matches
            tpl = tpl.replace("$" + i, match)
        callback({type: "tpl", tpl: tpl, matches: route.matches, args: route.args})
      else if route.type == "func"
        # call function if route has callback
        route.param(request, route, callback)
      else
        # return error if route type is unknown
        @app.log_msg('Unknown route type "' + route.type + '" (path: ' + path + ')', "warn")
        callback({type: "code", param: 500})

module.exports = Router
