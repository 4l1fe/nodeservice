// Generated by CoffeeScript 1.7.1
(function() {
  var JadeCompiler, fs, jade, path_req;

  jade = require("jade");

  fs = require("fs");

  path_req = require('path');

  JadeCompiler = (function() {
    function JadeCompiler() {
      this.jade_tpls = {};
    }

    JadeCompiler.prototype.load = function(path, opts) {
      var path_to_read, replace_includes, root, self;
      if (path.substr(-5) === ".jade") {
        path_to_read = path;
        path = path.substr(0, path.length - 5);
      } else {
        path_to_read = path + ".jade";
      }
      this.jade_tpls[path] = {};
      this.jade_tpls[path].orig = fs.readFileSync(path_to_read).toString();
      root = path_req.dirname(path);
      if (root !== "") {
        root += "/";
      }
      self = this;
      replace_includes = function(str, p1, p2) {
        var inc_text, psub;
        psub = root + p2;
        if (psub.substr(-5) === ".jade") {
          psub = psub.substr(0, path.length - 5);
        }
        if (self.jade_tpls[psub] === void 0 || !self.jade_tpls[psub].orig) {
          self.load(psub);
        }
        inc_text = self.jade_tpls[psub].orig;
        if (p1 !== "") {
          inc_text = p1 + inc_text.replace(/\n/gm, "\n" + p1);
        }
        return inc_text;
      };
      return this.jade_tpls[path].orig = this.jade_tpls[path].orig.replace(/([\t ]*)include\s+(.+)/gm, replace_includes);
    };

    JadeCompiler.prototype.compile = function(path) {
      if (path.substr(-5) === ".jade") {
        path = path.substr(0, path.length - 5);
      }
      if (this.jade_tpls[path] === void 0 || !this.jade_tpls[path].orig) {
        this.load(path);
      }
      return this.jade_tpls[path].compiled = jade.compile(this.jade_tpls[path].orig);
    };

    JadeCompiler.prototype.render = function(path, params) {
      if (path.substr(-5) === ".jade") {
        path = path.substr(0, path.length - 5);
      }
      if (this.jade_tpls[path] === void 0 || !this.jade_tpls[path].compiled) {
        this.compile(path);
      }
      return this.jade_tpls[path].compiled(params);
    };

    return JadeCompiler;

  })();

  module.exports = JadeCompiler;

}).call(this);