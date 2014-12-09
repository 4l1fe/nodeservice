tpl = undefined

success = (code, params) ->
  if code == tpl.req.app.api.STATUS_OK && params.data
    topic_name = tpl.args("topic")
    topic = undefined
    onenews = params.data
    #if onenews.object
    #  topic = onenews.object
    #  if topic_name && topic_name != topic.name
    #    tpl.set_fail(404)
    #  else
    tpl.params("topic", topic)
    tpl.params("topic_name", topic_name)
    tpl.params("onenews", onenews)
    tpl.api_get("news/list", "news_little", {}, {limit: 5})
    #else
    #  tpl.set_fail(404)
  else
    tpl.set_fail(404)

prepare = ($) ->
  tpl = $
  args = $.args()
  if args.id == undefined || !/d+/.test(args.id.test)
    $.set_fail(404)
  else
    $.api_get("news/:id/info", success, {id: args.id}, {with_obj: true})

module.exports = prepare