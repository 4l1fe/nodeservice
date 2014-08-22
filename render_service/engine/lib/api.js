// Generated by CoffeeScript 1.7.1
(function() {
  var Api, Client, app, fs,
    __hasProp = {}.hasOwnProperty;

  fs = require('fs');

  Client = require('zerorpc').Client;

  app = global.app;

  Api = (function() {
    function Api(app) {
      this.app = app;
      this.STATUS_OK = 200;
      this.STATUS_NOT_FOUND = 404;
      this.STATUS_INTERNAl_ERROR = 500;
      this.client = new Client();
    }

    Api.prototype.call = function(method, method_type, args, params, callback) {
      var ipc_pack, key, val;
      if (args !== void 0) {
        for (key in args) {
          if (!__hasProp.call(args, key)) continue;
          val = args[key];
          method = method.replace(":" + key, val);
        }
      }
      ipc_pack = app.makeIpcPack(method, method_type, params, params.token, params.x_token);
      this.client.connect(app.config.connection_string);
      return this.client.invoke('route', ipc_pack, function(err, res, more) {
        var e;
        if (err) {
          return callback(500);
        } else {
          try {
            return callback(200, res);
          } catch (_error) {
            e = _error;
            return callback(500);
          }
        }
      });
    };

    return Api;

  })();

  module.exports = Api;

}).call(this);
