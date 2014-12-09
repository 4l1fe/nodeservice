prepare = ($) ->
  opts1 = {limit: 9, sort: "comments"}
  opts2 = {limit: 12, sort: "date"}
  topic_name = $.args("topic")
  if topic_name
    opts2.obj_type = opts1.obj_type = "topic"
    opts2.obj_name = opts2.obj_name = topic_name
  $.api_cache("news", 1800, "news/list", {}, opts1)
  $.api_cache("other_news", 1800, "news/list", {}, opts2)
  $.params("topic_name", topic_name)

module.exports = prepare