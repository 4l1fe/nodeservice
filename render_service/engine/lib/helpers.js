// Generated by CoffeeScript 1.8.0
(function() {
  var Helper, app, helpers;

  app = global.app;

  helpers = {};

  Helper = function(name, params) {
    var e;
    if (helpers[name] === void 0) {
      app.log_msg('Loading helper "' + name + '"');
      try {
        helpers[name] = require(app.conf.helpers_path + name);
      } catch (_error) {
        e = _error;
        app.log_msg('Unable to load helper "' + name + '"', "warn");
        helpers[name] = null;
      }
      if (helpers[name] && typeof helpers[name].get !== "function") {
        app.log_msg('Helper "' + name + '" is broken');
        helpers[name] = null;
      }
    }
    if (helpers[name]) {
      return helpers[name].get(params);
    }
    return params;
  };

  module.exports = Helper;

}).call(this);

//# sourceMappingURL=helpers.js.map
