// Generated by CoffeeScript 1.7.1
(function() {
  var Router,
    __hasProp = {}.hasOwnProperty;

  Router = (function() {
    function Router() {
      this.app = global.app;
      this.routes = [];
      this._default = {
        type: "code",
        param: 404
      };
      return this;
    }

    Router.prototype._path_to_obj = function(path) {
      var args, i, path_arr, path_el, path_restr, res, _i, _ref;
      res = {
        regexp: null,
        args: null,
        path: path
      };
      if (path instanceof RegExp) {
        res.regexp = path;
      } else {
        if (/\/\:[a-z0-9]+/i.test(path)) {
          path_arr = path.split("/");
          path_restr = "^";
          args = [];
          for (i = _i = 1, _ref = path_arr.length - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
            path_el = path_arr[i];
            if (path_el[0] === ":") {
              args.push(path_el.substr(1));
              path_el = "([a-z0-9A-Z\-\.]+)";
            }
            path_restr += "\/" + path_el;
          }
          res.regexp = new RegExp(path_restr + "$");
          res.args = args;
        }
      }
      return res;
    };

    Router.prototype.add = function(path) {
      var param, path_parsed, route, type;
      type = "tpl";
      if (arguments.length > 2) {
        type = arguments[1];
        param = arguments[2];
      } else {
        param = arguments[1];
        if (typeof param === "function") {
          type = "func";
        }
      }
      if (type !== "tpl" && type !== "func" && type !== "code" && type !== "html") {
        type = "tpl";
      }
      route = {
        type: type,
        param: param,
        path: path
      };
      path_parsed = this._path_to_obj(path);
      route.regexp = path_parsed.regexp;
      route.args = path_parsed.args;
      this.routes.push(route);
      return route;
    };

    Router.prototype.alias = function(path, alias) {
      var i, path_found;
      path_found = void 0;
      if (typeof path !== "object") {
        i = 0;
        while (i < this.routes.length && this.routes[i].path !== path) {
          i++;
        }
        if (i < this.routes.length) {
          path_found = this.routes[i];
        }
      } else {
        path_found = path;
      }
      if (path_found) {
        if (path_found.alias === void 0) {
          path_found.alias = [];
        }
        path_found.alias.push(this._path_to_obj(alias));
      }
      return path_found;
    };

    Router.prototype["default"] = function(type, param) {
      return this._default = {
        type: type,
        param: param
      };
    };

    Router.prototype.clear = function() {
      this.routes = [];
      return this["default"]("code", 404);
    };

    Router.prototype.run = function(request, callback) {
      var alias, arg, i, key, match, n, path, route, tpl, _i, _j, _len, _ref, _ref1, _ref2;
      path = request.query_info("path");
      i = this.routes.length - 1;
      route = void 0;
      while (i >= 0 && !route) {
        if ((this.routes[i].regexp && this.routes[i].regexp.test(path)) || (!this.routes[i].regexp && this.routes[i].path === path)) {
          route = {
            type: this.routes[i].type,
            param: this.routes[i].param,
            regexp: this.routes[i].regexp,
            args_names: this.routes[i].args
          };
        }
        if (!route && this.routes[i].alias) {
          n = 0;
          alias = this.routes[i].alias;
          while (n < alias.length && !((alias[n].regexp && alias[n].regexp.test(path)) || (!alias[n].regexp && alias[n].path === path))) {
            n++;
          }
          if (n < alias.length) {
            route = {
              type: this.routes[i].type,
              param: this.routes[i].param,
              regexp: alias[n].regexp,
              args_names: alias[n].args
            };
          }
        }
        i--;
      }
      if (route === void 0) {
        route = this._default;
      }
      if (route.type === "code") {
        return callback({
          type: "code",
          code: route.param
        });
      } else if (route.type === "html") {
        return callback({
          type: "html",
          html: route.param
        });
      } else {
        if (route.regexp) {
          route.args = {};
          route.matches = route.regexp.exec(path);
          if (route.args_names) {
            for (i = _i = 0, _ref = route.args_names.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
              route.args[route.args_names[i]] = route.matches[i + 1];
            }
          }
        }
        if (route.type === "tpl") {
          tpl = route.param;
          if (route.args) {
            _ref1 = route.args;
            for (key in _ref1) {
              if (!__hasProp.call(_ref1, key)) continue;
              arg = _ref1[key];
              tpl = tpl.replace("{" + key + "}", arg);
            }
          }
          if (route.matches) {
            _ref2 = route.matches;
            for (i = _j = 0, _len = _ref2.length; _j < _len; i = ++_j) {
              match = _ref2[i];
              tpl = tpl.replace("$" + i, match);
            }
          }
          return callback({
            type: "tpl",
            tpl: tpl,
            matches: route.matches,
            args: route.args
          });
        } else if (route.type === "func") {
          return route.param(request, route, callback);
        } else {
          this.app.log_msg('Unknown route type "' + route.type + '" (path: ' + path + ')', "warn");
          return callback({
            type: "code",
            param: 500
          });
        }
      }
    };

    return Router;

  })();

  module.exports = Router;

}).call(this);
