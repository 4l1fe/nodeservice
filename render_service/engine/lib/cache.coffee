# * cache module
# * part of engine


class Cache
  constructor: () ->
    @cached = {}
    @maintanance = false
    setInterval(@_maintain.bind(@), 1000)

  get: (name) ->
    el = @cached[name]
    return JSON.parse( JSON.stringify( el.val ) ) if el != undefined
    return undefined

  in_cache: (name) ->
    return false if @cached[name] == undefined
    true

  put: (name, value, expired = undefined) ->
    @cached[name] = {val: JSON.parse( JSON.stringify( value ) )}
    if expired != undefined
      dt = new Date()
      dt.setSeconds(dt.getSeconds() + expired)
      @cached[name].expired = dt

  remove: (name) ->
    @clear(name)

  clear: (name = undefined) ->
    if name == undefined
      @cached = []
    else
      delete @cached[name]

  _maintain: () ->
    return if @maintanance
    @maintanance = true
    nw = new Date()
    for index, el of @cached
      delete(@cached[index]) if el.expired != undefined && nw > el.expired
    @maintanance = false

module.exports = Cache