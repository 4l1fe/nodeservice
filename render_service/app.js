// Generated by CoffeeScript 1.8.0
(function() {
  var Api, Cache, JadeCompiler, Router, app, e, http, page_route, server, sys, url;

  this.log_msg = function(msg, type) {
    var prefix, time;
    if (type == null) {
      type = "normal";
    }
    time = new Date();
    prefix = '';
    if (type === "crit") {
      prefix = '(E) ';
    }
    if (type === "warn") {
      prefix = '(!) ';
    }
    console.log(prefix + time + ". " + msg);
    if (type === "crit") {
      return halt();
    }
  };

  this.parseParams = function(args, params, start) {
    var args_pos, param, result, _i, _len;
    if (start == null) {
      start = 0;
    }
    result = {};
    args_pos = start;
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      param = params[_i];
      if (param[1] === void 0) {
        result[param[0]] = args[args_pos];
      } else if (typeof args[args_pos] === param[1]) {
        result[param[0]] = args[args_pos];
        args_pos++;
      } else {
        result[param[0]] = param[2];
      }
    }
    return result;
  };

  this.makeIpcPack = function(method, method_type, params, token, x_token, meta) {
    var ipc_pack;
    if (token == null) {
      token = null;
    }
    if (x_token == null) {
      x_token = null;
    }
    if (meta == null) {
      meta = {};
    }
    ipc_pack = {
      api_method: method,
      api_type: method_type,
      token: token,
      x_token: x_token,
      query_params: params,
      meta: meta
    };
    return ipc_pack;
  };

  this.log_msg("Set up application");

  sys = require('sys');

  http = require('http');

  url = require('url');

  global.app = app = this;

  this.log_msg("Loading global config");

  this.conf = app.config = require('./config');

  this.log_msg("Loading libraries");

  app.helper = require(this.conf.lib_path + "helpers");

  app.Request = require(this.conf.lib_path + "request");

  app.Template = require(this.conf.lib_path + "template");

  Cache = require(this.conf.lib_path + "cache");

  Router = require(this.conf.lib_path + "router");

  Api = require(this.conf.lib_path + "api");

  JadeCompiler = require(this.conf.lib_path + "jade-compiler");

  app.router = new Router(this);

  app.api = new Api(this);

  app.cache = new Cache();

  app.jade_compiler = new JadeCompiler();

  app.router.add("/", "tpl", this.conf.tpl_page_prefix + "index");

  page_route = app.router.add(/^\/([a-z0-9\-]+)$/i, "tpl", this.conf.tpl_page_prefix + "$1");

  app.router.alias(page_route, /^\/([a-z0-9\-]+)\.html?$/i);

  this.log_msg('Use theme "' + this.conf.theme_name + '"');

  this.log_msg("Loading theme config");

  try {
    this.theme_conf = app.theme_conf = require(this.conf.themes_path + this.conf.theme_name + "/config");
  } catch (_error) {
    e = _error;
    this.log_msg("No theme config found", "warn");
    console.log(e);
  }

  this.log_msg("Starting HTTP server on " + this.conf.app_host + ":" + this.conf.app_port + " with backend on " + this.conf.backend_host + ":" + this.conf.backend_port);

  server = http.createServer(function(req, res) {
    var user_request;
    if (req.url !== "/favicon.ico") {
      user_request = new app.Request(req, res);
      return app.router.run(user_request, function(route) {
        var tpl;
        if (route.type === "html") {
          return user_request.response_html(route.html);
        } else if (route.type === "tpl") {
          return tpl = new app.Template(route.tpl, user_request, route);
        } else if (route.type === "code") {
          return user_request.response_code(route.code, "HTML Error " + route.code);
        } else {
          return user_request.response_code(404);
        }
      });
    }
  });

  server.listen(this.conf.app_port, this.conf.app_host);

  this.log_msg("Application is running and ready");

}).call(this);
