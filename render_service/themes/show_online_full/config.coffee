app = global.app

app.router.add("/tpl/:name", "tpl", "templates/:name")
app.router.add("/video/:id", "tpl", "video")
app.router.add("/:topic/video/:id", "tpl", "video")
app.router.add("/:topic/news", "tpl", "page_news")
app.router.add("/news/:id", "tpl", "news")
app.router.add("/:topic/news/:id", "tpl", "news")
app.router.add("/fizruk", "tpl", "show")
app.router.add("/Dom2", "tpl", "show")
app.router.add("/news/:id", "tpl", "news")
app.router.add("/:topic/news/:id", "tpl", "news")