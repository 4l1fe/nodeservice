tpl = undefined

units_success = (code, params) ->
  if code == tpl.req.app.api.STATUS_OK
    units = params.data
    if units && units.length
      for u in units
        tpl.api_get("media/list", "unit." + u.id, {limit: 12, units: u.id})
      tpl.params("params", tpl.params())
      tpl.params("units", units)

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
      tpl.api_get("news/list", "news_little", {limit: 5})
      tpl.api_get("mediaunits/list", units_success, {topic: topic.name}, {})
      tpl.api_get("media/list", "films_popular", {topic: topic.name, sort: "views", limit: 4})
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