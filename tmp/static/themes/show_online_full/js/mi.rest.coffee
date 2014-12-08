defaultOpts =
  url: ''
  verbs:
    'create' : 'POST'
    'read'   : 'GET'
    'update' : 'PUT'
    'destroy': 'DELETE'
  ext: ''
  ajax:
    dataType: 'json'
  # websocket
  keepAlive: true
  autoReconect: true
  #auth / session
  auth_callback: undefined
  auth:
    header_session: "X-MI-SESSION"
    header_token: "X-MI-TOKEN"
    cookie_session: "x-session"
    cookie_token: "x-token"
    methods:
      login: "auth/login"
      session: "auth/session"
      revoke: "auth/revoke"
    auto: true

error = (msg) ->
  throw new Error "ERROR: mi.rest: #{msg}"

inheritExtend = (a, b) ->
  F = () ->
  F.prototype = a
  $.extend true, new F(), b

class MiRest
  constructor: (opts) ->
    @opts = inheritExtend defaultOpts, opts
    @_auth =
      token: undefined
      session: undefined
      lastSessionUpdate: undefined
      cb_queue: []
      running: false

    @_auth.token = $.cookie(@opts.auth.cookie_token)
    @_auth.session = $.cookie(@opts.auth.cookie_session)

  has_auth: ->
    return @_auth.session != undefined

  refresh_session: (opts, verb, method) ->
    @_auth.cb_queue.push({opts: opts, verb: verb, method: method})
    if !@_auth.running
      # the process is going
      @_auth.running = true
      if !@_auth.token
        # token is not set
        for opts in @_auth.cb_queue
          op = opts.opts
          if op.fail
            op.fail()
          if op.always
            op.always(false)
        @_auth.cb_queue = []
        @_auth.session = undefined
        @_auth.running = false
      else
        # token is set, try to refresh session
        headers = {}
        headers[@_auth.header_token] = @_auth.token
        $.ajax @_auth.methods.session + @opts.ext, {
            cache: false,
            headers: headers
            type: "GET"
            dataType: "json"
            complete: (xhr) =>
              if xhr.status == 200 && xhr.responseJSON && xhr.responseJSON.session_token
                @_auth.session = xhr.responseJSON.session_token
                $.cookie(@_auth.cookie_session, @_auth.session, {expires: 30, path: "/"})
                $.cookie(a_auth.cookie_token, @_auth.token, {expires: 30, path: "/"})
                for opts in @_auth.cb_queue
                  opts.opts = {} if opts.opts == undefined
                  if opts.method
                    opts.opts.noloop = true
                    @call(opts.verb || @opts.verbs.read, opts.methid, opts.opts)
                  else
                    if opts.opts.success
                      opts.opts.success()
                    if opts.opts.always
                      opts.opts.always(true)
              else
                @_auth.token = undefined
                @_auth.session = undefined
                $.cookie(@_auth.cookie_session, "", -1)
                $.cookie(a_auth.cookie_token, "", -1)
                for opts in @_auth.cb_queue
                  opts.opts = {} if opts.opts == undefined
                  if opts.opts.fail
                    opts.opts.fail(403)
                  if opts.opts.always
                    opts.opts.always(false, 403)
              @_auth.cb_queue = []
              @_auth.running = false
          }

  revoke_session: (callback) ->
    # revoke session here

  call: (verb, method, opts) ->
    if @opts.verbs[verb] == undefined
      error 'Verb "' + verb + '" is unknown'
    if method == '' || method == undefined
      error 'Method is undefined'

    opts = {} if opts == undefined

    if opts.auth && !@has_auth()
      if @_auth.token != undefined
        @refresh_session(opts, verb, method)
      else
        if opts.fail
          opts.fail(403)
        if opts.always
          opts.always(false, 403)
      return

    if opts.params
      # replace params (ex. films/:id/recommendation
      for key,val of opts.params
        method = method.replace(":"+ key, val)

    headers = {}
    if @has_auth()
      headers[@_auth.header_session] = @_auth.session

    http_method = @opts.verbs[verb]
    # TODO: add method override

    ajaxOpts = opts.ajax || {}
    url = @opts.url + method + @opts.ext
    ajaxOpts.type = http_method
    ajaxOpts.headers = headers
    ajaxOpts.data = opts.data if opts.data
    ajaxOpts = $.extend true, {}, @opts.ajax, ajaxOpts

    ajaxOpts.complete = (xhr, status) =>
      if xhr.status == 200
        data = xhr.responseJSON
        if opts.success
          opts.success(data)
        if opts.always
          opts.always(true, data)
      else
        if (xhr.stauts == 401 || xhr.status == 403) && !opts.noloop
            @refresh_session(opts, verb, method)
        else
          if opts.fail
            opts.fail(xhr.status)
          if opts.always
            opts.always(false, xhr.status)

    $.ajax url, ajaxOpts

  create: (method, opts) ->
    @call("create", method, opts)

  read: (method, opts) ->
    @call("read", method, opts)

  update: (method, opts) ->
    @call("update", method, opts)

  destroy: (method, opts) ->
    @call("destroy", method, opts)

window.MiRest = MiRest