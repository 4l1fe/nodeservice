// Generated by CoffeeScript 1.7.1
(function() {
  var Stack, Template, app, e, fs, global_config, jade, templates;

  jade = require('jade');

  fs = require('fs');

  templates = {};

  app = global.app;

  global_config = void 0;

  try {
    global_config = require(app.conf.theme_global_config);
  } catch (_error) {
    e = _error;
    app.log_msg('Unable to load global config for theme "' + app.conf.theme_name + '"');
    global_config = void 0;
  }

  Stack = (function() {
    function Stack(_success, _fail) {
      this._success = _success != null ? _success : void 0;
      this._fail = _fail != null ? _fail : void 0;
      this._counter = 0;
      this._timeout = 0;
      this._queue = [];
      this._final_marker = false;
    }

    Stack.prototype.push = function(callback, params_names) {
      var obj, time;
      if (callback == null) {
        callback = void 0;
      }
      if (params_names == null) {
        params_names = void 0;
      }
      time = new Date();
      this._counter++;
      obj = {
        time: time,
        callback: callback,
        running: true
      };
      this._queue.push(obj);
      return (function(_this) {
        return function(data) {
          var i, params, _i, _ref;
          if (callback) {
            params = [];
            if (params_names !== void 0) {
              for (i = _i = 0, _ref = params_names.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                params[params_names[i]] = arguments[i + 1];
              }
            }
            callback(data, params, arguments);
          }
          obj.running = false;
          _this._counter--;
          if (_this._counter <= 0) {
            return _this.final(false);
          }
        };
      })(this);
    };

    Stack.prototype.final = function(marker) {
      if (marker == null) {
        marker = true;
      }
      if (marker) {
        this._final_marker = true;
      }
      if (this._final_marker && this._counter <= 0 && this._success) {
        return this._success();
      }
    };

    Stack.prototype.fail = function() {
      if (this._fail) {
        return this._fail();
      }
    };

    return Stack;

  })();

  Template = (function() {
    function Template(name, req, route) {
      this.name = name;
      this.req = req;
      this.route = route;
      if (templates[this.name] && templates[this.name].is_broken) {
        this.req.response_code(500);
      } else {
        if (templates[this.name] === void 0) {
          templates[this.name] = {};
        }
        this._proceed();

        /*
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
         */
      }
    }

    Template.prototype._proceed = function() {
      var tpl;
      this._params = {};
      this.stack = new Stack((function(_this) {
        return function() {
          return _this._compile();
        };
      })(this), (function(_this) {
        return function() {
          return _this._fail();
        };
      })(this));
      tpl = templates[this.name];
      if (global_config) {
        global_config(this);
      }
      if (!tpl.config_loaded) {
        try {
          tpl.config = require(this.req.app.conf.theme_path + this.name + this.req.app.conf.tpl_config_ext);
        } catch (_error) {
          e = _error;
          this.req.app.log_msg('Unable to load config for template "' + this.name + '"');
        }
        tpl.config_loaded = true;
      }
      if (tpl.config) {
        tpl.config(this);
      }
      return this.stack.final();
    };

    Template.prototype._compile = function() {
      try {
        return this.req.response_html(jade.renderFile(this.req.app.conf.theme_path + this.name + this.req.app.conf.jade_ext, this.params()));
      } catch (_error) {
        e = _error;
        this.req.response_code(500);
        this.req.app.log_msg('Failed to compile template "' + this.name + '". Error message: ' + e.toString(), "warn");
        if (templates[this.name] === void 0) {
          templates[this.name] = {};
        }
        templates[this.name].is_broken = true;
        return this.req.app.log_msg('Template "' + this.name + '" marked as "broken"', "warn");
      }
    };

    Template.prototype._fail = function() {
      this.req.app.log_msg('Unable to proceed template "' + this.name + '" for session ' + this.session().id);
      return this.req.response_code(500);
    };

    Template.prototype._api = function(_args) {
      var args, self;
      args = app.parseParams(_args, [["method_type", "string", "get"], ["args", "object", {}], ["params", "object", {}]], 2);
      if (_args.length < 2) {
        return;
      }
      args.method = _args[0];
      if (typeof _args[1] === "function") {
        args.callback = _args[1];
      } else {
        args.param_name = _args[1];
      }
      if (args.method === void 0 || (args.callback === void 0 && args.param_name === void 0)) {
        return;
      }
      self = this;
      if (args.callback === void 0) {
        args.callback = (function(_this) {
          return function(code, params) {
            if (code === _this.req.app.api.STATUS_OK) {
              return _this.params(args.param_name, params.data);
            }
          };
        })(this);
      }
      return this.req.app.api.call(args.method, args.method_type, args.args, args.params, this.stack.push(args.callback, ["data"]));
    };

    Template.prototype.api = function() {
      return this._api(arguments);
    };

    Template.prototype.api_cache = function(param_name, expire) {
      var args, val;
      val = this.cache(param_name);
      if (val === void 0) {
        args = arguments.splice(2);
        return args.splice(1, 0, (function(_this) {
          return function(code, params) {
            if (code === _this.req.app.api.STATUS_OK) {
              _this.params(param_name, params.data);
              return _this.cache(param_name, params.data, expire);
            }
          };
        })(this));
      } else {
        return val;
      }
    };

    Template.prototype.api_get = function() {
      arguments.splice(1, 0, "get");
      return this._api(arguments);
    };

    Template.prototype.api_post = function() {
      arguments.splice(1, 0, "post");
      return this._api(arguments);
    };

    Template.prototype.api_delete = function() {
      arguments.splice(1, 0, "delete");
      return this._api(arguments);
    };

    Template.prototype.query_info = function(name) {
      return this.req.query_info(name);
    };

    Template.prototype.device_info = function(name) {
      return this.req.device_info(name);
    };

    Template.prototype.query_params = function(name) {
      return this.req.query_params(name);
    };

    Template.prototype.user_is_auth = function() {
      return this.req.user_is_auth();
    };

    Template.prototype.auth_user = function() {
      return this.req.auth_user();
    };

    Template.prototype.session = function() {
      return this.req.session();
    };

    Template.prototype.params = function(name, value) {
      if (name == null) {
        name = void 0;
      }
      if (value == null) {
        value = void 0;
      }
      if (name === void 0) {
        return this._params;
      } else if (value !== void 0) {
        this._params[name] = value;
      }
      return this._params[name];
    };

    Template.prototype.args = function(name) {
      if (name == null) {
        name = void 0;
      }
      if (name === void 0) {
        return this.route.args || {};
      } else if (this.route.args === void 0) {
        return void 0;
      }
      return this.route.args[name];
    };

    Template.prototype.matches = function(id) {
      if (id == null) {
        id = void 0;
      }
      if (id === void 0) {
        return this.route.matches;
      } else if (this.route.matches === void 0) {
        return void 0;
      }
      return this.route.matches[id];
    };

    Template.prototype.cache = function(name, value, expired) {
      if (value == null) {
        value = void 0;
      }
      if (expired == null) {
        expired = void 0;
      }
      if (value === void 0) {
        return app.cache.get(name);
      } else {
        return app.cache.put(name, value, expired);
      }
    };

    Template.prototype.cache_remove = function(name) {
      return app.cache.clear(name);
    };

    Template.prototype.redirect = function(url, status) {
      if (status == null) {
        status = 200;
      }
    };

    return Template;

  })();

  module.exports = Template;

}).call(this);