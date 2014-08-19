prepare = ($) ->
  $.api_cache("last_news", 120, "news/list", {limit: 7, sort: "id", sort_desc: true})
  $.api_cache("users_pop", 60, "users/list", {limit: 5, sort: "rating", sort_desc: true})
  $.api_cache("media_new", 180, "media/list", {limit: 7, sort: "date", sort_desc: true})
  $.api_cache("media_pop", 180, "media/list", {limit: 7, sort: "views", sort_desc: true})
  $.api("persons/list", "person_rand", {limit: 1, sort: "rand"})
  $.api_cache("service_stat", 600, "service/stat")

module.exports = prepare