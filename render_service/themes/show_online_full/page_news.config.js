// Generated by CoffeeScript 1.7.1
(function() {
  var prepare;

  prepare = function($) {
    var opts1, opts2, topic_name;
    opts1 = {
      limit: 9,
      sort: "comments"
    };
    opts2 = {
      limit: 12,
      sort: "date"
    };
    topic_name = $.args("topic");
    if (topic_name) {
      opts2.obj_type = opts1.obj_type = "topic";
      opts2.obj_name = opts2.obj_name = topic_name;
    }
    $.api_cache("news", 1800, "news/list", {}, opts1);
    $.api_cache("other_news", 1800, "news/list", {}, opts2);
    return $.params("topic_name", topic_name);
  };

  module.exports = prepare;

}).call(this);