# * request module
# * part of engine

ua_parser = require('ua-parser')
url = require('url')

class Request
  # constructor with request and response params
  constructor: (@req, @res) ->
    @app = global.app
    @_query_params = undefined
    @_query_info = undefined
    @_device_info = undefined
    @url_parsed = undefined

  # parsing current url, use url.parse
  parse_url: ->
    @url_parsed = url.parse(@req.url, true) if @url_parsed == undefined
    @url_parsed

  # return query params element if name set
  # otherwise return all query params
  query_params: (name = undefined) ->
    if @_query_params == undefined
      # parse query once on demand
      @_query_params = @parse_url().query
    return @_query_params if name == undefined
    @_query_params[name]

  # return query info element if name set
  # otherwise return all query info
  query_info: (name = undefined) ->
    if @_query_info == undefined
      # set query info once on demand
      @_query_info =
        path: @parse_url().pathname         # url without query
        agent: @req.headers['user-agent']   # user agent
        url: @req.url                       # full url
        headers: @req.headers               # headers
        # user ip
        ip: @req.headers['x-forwarded-for'] || @req.connection.remoteAddress || @req.socket.remoteAddress || @req.connection.socket.remoteAddress
        geo: undefined                      #TODO: users geo location
    return @_query_info if name == undefined
    @_query_info[name]

  # return device info element if name set
  # otherwise return all device info object
  device_info: (name = undefined) ->
    if @_device_info == undefined
      # set device info once on demand
      user_agent = @req.headers['user-agent']
      device = ua_parser.parseDevice(user_agent)
      browser = ua_parser.parseUA(user_agent)
      os = ua_parser.parseOS(user_agent)

      os_family = os.family.toLowerCase()
      dev_family = device.family.toLowerCase()

      # use dictionaries to acknowledge device type
      dev_type = undefined
      if dev_family in @app.conf.dict_devices.tablets
        dev_type = "tablet"
      else if dev_family in @app.conf.dict_devices.smartphones
        dev_type = "smartphone"

      @_device_info =
        # true if device is mobile
        is_mobile: os_family in @app.conf.dict_os.mobile || /mobile/ig.test(browser.family)
        os: os                # os name and version
        browser: browser      # browser name and version
        vendor: device.family # device vendor
        type: dev_type        # type of device
        # width, height, ratio, js_enabled, flash_enabled, html5_enabled

      # normalize browser type
      if @_device_info.is_mobile
        @_device_info.browser.type = @_device_info.browser.family.replace(/\s*mobile\s*/i, "")
      else
        @_device_info.browser.type = @_device_info.browser.family
    return @_device_info if name == undefined
    @_device_info[name]

  # check if user is authenticated
  user_is_auth: ->
    # TODO: not working
    return @app.api.call '/internal/auth/check', 'get', {}, {}

  # return auth user if authenticated
  auth_user: ->
    # TODO: not working
    return @app.api.call '/internal/info/user', 'get', {}, {}

  # return session if set
  session: ->
    # TODO: not working
    return @app.api.call '/internal/info/session', 'get', {}, {}

  # output html with code to user and ends request
  response: (code, html = undefined) ->
    @res.writeHead code, {"Content-Type": "text/html"}
    if html != undefined
      @res.write html
    @res.end()

  # output html with code 200
  response_html: (html) ->
    @response 200, html

  # output code with msg if defined
  response_code: (code, msg = undefined) ->
    @response code, msg

module.exports = Request