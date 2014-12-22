tpl = undefined

topic_success = (code, params) ->
  if code == tpl.req.app.api.STATUS_OK
    topic = params.data
    tpl.api_get("media/list", "media_pop", {}, {limit: "12", topic: topic.name, sort: "views"})
    tpl.api_get("media/list", "media_new", {}, {limit: "12", topic: topic.name, sort: "date"})
    tpl.api_get("news/list", "news", {}, {limit: "10", obj_name: topic.name}) #obj_type: "topic", })
    topic.country = "Россия"
    if topic.name == "fizruk"
      topic.genre = "Сериал"
    else
      topic.genre = "Шоу"
    topic.pg_rating = "16+"
    topic.votes_cnt = 10500
    topic.rating = 8
    tpl.params("topic", topic)
    if topic.name == "fizruk"
      more_topic = {title: "Дом 2", name: "dom2"}
    else
      more_topic = {title: "Физрук", name: "fizruk"}
    tpl.params("more_topic", more_topic)
  else
    tpl.set_fail(404)

prepare = ($) ->
  tpl = $
  url = $.req.query_info("url").substr(1)
  if url != "fizruk" && url != "dom2"
    $.set_fail(404)
  else
    $.api_get("topics/:topic/info", topic_success, {topic: url})

module.exports = prepare