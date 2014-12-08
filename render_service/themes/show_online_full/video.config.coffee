tpl = undefined

media_success = (code, params) ->
  if code == tpl.req.app.api.STATUS_OK
    topic_name = tpl.args("topic")
    topic = undefined
    unit = undefined
    media = params.data
    if media.units && media.units.length
      if topic_name == undefined
        unit = media.units[0]
      else
        for u in media.units
          if u.topic && u.topic && u.topic.name == topic_name
            unit = u
    if unit
      topic = unit.topic
      topic_name = unit.topic.name
      tpl.params("media", params.data)
      tpl.params("unit", unit)
      tpl.params("topic", topic)
      tpl.api_get("news/list", "news", {limit: 5})
    else
      tpl.set_fail(404)
  else
    tpl.set_fail(404)

prepare = ($) ->
  tpl = $
  args = $.args()
  if args.id == undefined || !/d+/.test(args.id.test)
    $.set_fail(404)
  else
    $.api_get("media/:id/info", media_success, {id: args.id}, {})

module.exports = prepare