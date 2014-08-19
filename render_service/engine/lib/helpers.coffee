# * helper module
# * part of engine
#
# usage: helper(helper_name, params)
#   module tries to load helpers from conf.helper_path and run it with params
#
app = global.app
helpers = {}

Helper = (name, params) ->
  if helpers[name] == undefined
    app.log_msg('Loading helper "' + name + '"')
    try
      helpers[name] = require(app.conf.helpers_path + name)
    catch e
      app.log_msg 'Unable to load helper "' + name + '"', "warn"
      helpers[name] = null
    if helpers[name] && typeof helpers[name].get != "function"
      app.log_msg 'Helper "' + name + '" is broken'
      helpers[name] = null
  if helpers[name]
    return helpers[name].get(params)
  params

module.exports = Helper