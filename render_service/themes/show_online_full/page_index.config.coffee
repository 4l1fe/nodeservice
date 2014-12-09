prepare = ($) ->
  $.api_cache("media_new", 600, "media/list", {limit: 12, sort: "date"})
  $.api_cache("media_pop", 600, "media/list", {limit: 12, sort: "views"})
  $.api_cache("news", 1800, "news/list", {limit: 11, sort: "date"})
  #$.api_cache("top_users", 1800, "users/list", {limit: 6, sort: "rating"})
  #$.api_cache("top_persons", 1800, "persons/list", {limit: 6, sort: "rating"})
  $.params("stat", {'views_count': 780000, 'episodes_count': 350, 'users_count': 25000, 'comments_count': 7000})

module.exports = prepare