// Generated by CoffeeScript 1.8.0
(function() {
  var prepare;

  prepare = function($) {
    $.params("res", $.req.app.conf.resources);
    $.params("auth_user", $.req.auth_user());
    return $.params("topics_bg", {
      "fizruk": $.req.app.conf.resources.img + "fizruk_bg.jpg",
      "dom2": {
        "fizruk": $.req.app.conf.resources.img + "dom2_bg.jpg"
      }
    });
  };

  module.exports = prepare;

}).call(this);

//# sourceMappingURL=.config.js.map
