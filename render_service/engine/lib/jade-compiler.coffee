jade = require("jade")
fs = require("fs")
path_req = require('path')

class JadeCompiler
  constructor: ->
    @jade_tpls = {}

  load: (path, opts) ->
    if path.substr(-5) == ".jade"
      path_to_read = path
      path = path.substr(0, path.length - 5)
    else
      path_to_read = path + ".jade"

    @jade_tpls[path] = {}

    @jade_tpls[path].orig = fs.readFileSync(path_to_read).toString()

    root = path_req.dirname(path)
    root+= "/" if root != ""

    self = @
    replace_includes = (str, p1, p2) ->
      psub = root + p2
      psub = psub.substr(0, path.length - 5) if psub.substr(-5) == ".jade"
      self.load psub if self.jade_tpls[psub] == undefined || !self.jade_tpls[psub].orig
      inc_text = self.jade_tpls[psub].orig
      if p1 != ""
        inc_text = p1 + inc_text.replace(/\n/gm, "\n" + p1)
      return inc_text

    @jade_tpls[path].orig = @jade_tpls[path].orig.replace(/([\t ]*)include\s+(.+)/gm, replace_includes)

  compile: (path) ->
    path = path.substr(0, path.length - 5) if path.substr(-5) == ".jade"
    @load path if @jade_tpls[path] == undefined || !@jade_tpls[path].orig
    @jade_tpls[path].compiled = jade.compile(@jade_tpls[path].orig)

  render: (path, params) ->
    path = path.substr(0, path.length - 5) if path.substr(-5) == ".jade"
    @compile path if @jade_tpls[path] == undefined || !@jade_tpls[path].compiled
    #fs.writeFileSync("test.jade", @jade_tpls[path].orig)
    return @jade_tpls[path].compiled(params)

module.exports = JadeCompiler
