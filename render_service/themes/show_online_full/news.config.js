// Generated by CoffeeScript 1.7.1
(function() {
  var prepare, success, tpl;

  tpl = void 0;

  success = function(code, params) {
    var onenews, topic, topic_name;
    if (code === tpl.req.app.api.STATUS_OK && params.data) {
      topic_name = tpl.args("topic");
      topic = void 0;
      onenews = params.data;
      tpl.params("topic", topic);
      tpl.params("topic_name", topic_name);
      tpl.params("onenews", onenews);
      return tpl.api_get("news/list", "news_little", {}, {
        limit: "5"
      });
    } else {
      return tpl.set_fail(404);
    }
  };

  prepare = function($) {
    var args;
    tpl = $;
    args = $.args();
    if (args.id === void 0 || !/d+/.test(args.id.test)) {
      return $.set_fail(404);
    } else {
      return $.api_get("news/:id/info", success, {
        id: args.id
      }, {
        with_obj: true
      });
    }
  };

  module.exports = prepare;

}).call(this);
