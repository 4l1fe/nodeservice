'use strict'

window.mi_app = undefined

error = (txt, type = "norm") ->
  if type == "crit"
    throw new Error "CRITICAL ERROR: " + txt
  else
    console.log "ERROR: " + txt

check_app_is_init = (c) ->
  if !window.mi_app
    error "App is not init", "crit"
  else
    c._app = window.mi_app

scroll_to_obj = (obj, duration = 1000) ->
  $('html, body').stop().animate({scrollTop: obj.offset().top}, duration)

# a basic Page class
class Page
  constructor: (conf) ->
    check_app_is_init(@)
    @e = {}
    @_visible = false
    @conf  = conf || {}
    @app = @_app
    self = @
    $("*[data-mi-pid]").each( ->
      $this = $(this)
      self.e[$this.data("miPid")] = $this
    )

  show: ->
    @_visible = true

  hide: ->
    @_visible = false

  isVisible: ->
    return @_visible

  user_is_auth: (modal) ->
    return @_app.user_is_auth(modal)

class Item
  constructor: (opts = {}, callback = undefined) ->
    check_app_is_init(@)
    if (!@_name)
      error "It's wrong to use parent class", "crit"
    @vals = {}
    @defaults = {}
    @elements = {}
    @e_attrs = {}
    @e_vals = {}

    $.extend @defaults, opts.defaults if opts.defaults
    if opts.place == undefined
      @_place = $('<span class="preload-' + @_name + '"></span>')
      if opts.parent
        if opts.up
          @_place.prependTo(opts.parent)
        else
          @_place.appendTo(opts.parent)
      @_app.get_tpl(
        @_name
        (tpl_obj) =>
          if tpl_obj
            old_place = @_place
            @_place = tpl_obj.clone()
            @set_elements()
            @set_vals opts.vals, opts.do_not_set if opts.vals
            @_place.insertAfter(old_place)
            old_place.remove()
            callback @ if callback
          else
            error 'Unable to load template for object "' + @_name + '"'
      )
    else
      @_place = opts.place
      @set_elements()
      @set_vals opts.vals, opts.do_not_set if opts.vals
      callback @ if callback

  place: ->
    @_place

  parse_element: ($this) ->
    data = $this.data()
    name = undefined
    value = undefined
    e = {self: $this}
    $.each(data, (key,val) =>
      key = key.substr(2).toLowerCase()
      if key == "id"
        @elements[val] = e
        if name == undefined
          name = key
      if key == "name"
        name = val
        @e_vals[val] = [] if @e_vals[val] == undefined
        @e_vals[val].push(e)
      else if key.substr(0,2) == "on"
        method = key.substr(2)
        if typeof @[val] == "function"
          $this.bind(method, => @[val]())
      else if key.substr(0,2) == "at"
        attr = key.substr(2)
        e.attr = {} if e.attr == undefined
        e.attr[attr] = val
        @e_attrs[val] = {} if @e_attrs[val] == undefined
        @e_attrs[val][attr] = [] if @e_attrs[val][attr] == undefined
        @e_attrs[val][attr].push(e)
      else
        e[key] = val
        if key == "val"
          value = val
      if name != undefined && value != undefined
        name_arr = name.split(".")
        o = @vals
        i = 0
        while i < name_arr.length - 2
          o = o[name_arr[i]]
          o = {} if o == undefined
          i++
        o[name_arr[i]] = value
    )

  set_elements: ->
    @elements = {}
    self = @
    $("*", @_place).each(
      ->
        self.parse_element($(this))
    )
    @parse_element(@_place)

  get_val: (name) ->
    if name
      @vals[name]
    else
      @vals

  set_val: (name, val, do_not_set) ->
    val = @transform_val(name, val)
    @vals[name] = val
    if !do_not_set
      @iterate_val(name, val || @defaults[name])

  iterate_val: (s, obj) ->
    if typeof obj == "object"
      for key of obj
        @iterate_val s + "." + key, obj[key]
    else
      if @e_vals[s]
        for e in @e_vals[s]
          e.self.html(obj || e.default)
      if @e_attrs[s]
        for attr of @e_attrs[s]
          for e in @e_attrs[s][attr]
            val = @transform_attr(attr, s, obj)
            if attr == "bg"
              e.self.background_image(val || e.default)
            else
              e.self.attr(attr, val || e.default)

  set_vals: (vals, do_not_set) ->
    @reset()
    for key, val of vals
      @set_val(key, val, do_not_set)
    return vals

  transform_val: (name, val) ->
    return val

  transform_attr: (attr, name, val) ->
    return val

  user_is_auth: ->
    return @_app.user_is_auth()

  reset: ->
    @vals = {}

  show: ->
    @_place.show()

  hide: ->
    @_place.hide()

  remove: ->
    @_place.remove()

class FilmThumb extends Item
  constructor: (opts = {}, callback) ->
    @_name = "film-thumb"
    super

  transform_attr: (attr, name, val) ->
    if attr == "href" && name == "id"
      if @vals.units && @vals.units[0]
        href = @vals.units[0].topic.name + "/media/" + @vals.id
      else
        href = "/media/" + @vals.id
      return href
    if (attr == "alt" || attr == "title") && name == "name"
      return @vals["name"]
    if attr == "src" && name == "id"
      # TODO:
      # return "/content/media/" + @vals["id"] + "/poster_200x200"
      return @_app.config("content_media") + @vals.id + "/poster"
    super

  transform_val: (name, val) ->
    if name == "duration"
      return duration_text(val || 0)
    super

  set_vals: (vals, do_not_set) ->
    if vals.releasedate
      vals["date"] = time_text(new Date(vals.releasedate))
    vals["topic"] = "" if vals["topic"] == undefined
    if vals.units && vals.units[0]
      vals["topic"] = vals.units[0].topic.title
      vals["title"] = vals.units[0].title
      if vals.units[0].morder
        vals["title"]+= ", " + vals.units[0].morder + " серия"
    if vals["topic"]
      vals["title"] = vals["topic"] + ": " + vals["title"]
    super

class Chat
  constructor: (id, opts) ->
    @id = id
    @lastMsgId = 0
    @timeouts = [3000, 7000, 10000, 40000]
    # full, part, empty, fail
    @cur_timeout = 0
    @counters = {}
    @loading = false
    @queryId = 0
    @queryUsersId = 0
    @app = window.mi_app
    @e = {}
    @e.output = opts.output
    if opts.online_users
      @e.online_users = opts.online_users
    if opts.form
      @e.form = opts.form
      @e.form.submit(
        (e) =>
          e.preventDefault();
          @send()
      )
      @e.input = $('input[type="text"]', @e.form)
    if opts.input
      @e.input = opts.input
    if @e.input
      @e.input.focus(
        (e) =>
          @app.user_is_auth()
      )
      @e.input.keyup (
        (e) =>
          if e.keyCode == 13
            e.preventDefault()
            @send()
          if e.keyCode == 27
            e.preventDefault()
            @e.input.val("").focus()
      )
    start_update_counter = 0
    start_update = =>
      if start_update_counter >= 2
        @update(-1)
        @update_users(-1)

    @app.get_tpl(
      "chat-msg-thumb"
      (tpl) => @e.tpl_msg = tpl; start_update_counter++; start_update()
    )

    @app.get_tpl(
      "chat-msg-user"
      (tpl) => @e.tpl_user = tpl; start_update_counter++; start_update()
    )


  send: ->
    #TODO: remove true
    if @app.user_is_auth()
      val = @e.input.val().trim()
      if val.length < 10
        @app.notify("В сообщении должно быть больше 10 символов")
        return
      @e.input.prop('disabled', true);
      @app.rest.create("chat/:id/send",
        {
          params: {id: @id}
          auth: true
          data: {text: val}
          always: (success, data) =>
            if success
              @update(-1)
              @e.input.val("")
            else
              @app.notify("Не могу отослать сообщение в чат (status: " + data + ")")
            @e.input.prop("disabled", false).focus()
        }
      )

  _update_ticker: (queryId) ->
    return if queryId != @queryId
    @app.rest.read("chat/:id/stream",
      {
        params: {id: @id}
        data: {limit: "10,," + @lastMsgId}
        always: (success, data) =>
          return if queryId != @queryId
          timeout_id = @cur_timeout
          increase = undefined
          clear = undefined
          if success
            if data && data.length
              is_scroll_bottom = @e.output[0].scrollHeight - @e.output.scrollTop() <= (@e.output.outerHeight() + 10)
              for i, item of data
                item_tpl = @e.tpl_msg.clone()
                $(".name", item_tpl).text(item.user.name + ":").attr("href","/users/" + item.user.id)
                $(".text", item_tpl).text(item.text)
                @e.output.append(item_tpl.fadeIn(700 + 150*i))
                @lastMsgId = item.id if item.id > @lastMsgId
              if is_scroll_bottom
                @e.output.stop().animate({scrollTop: @e.output[0].scrollHeight}, 500 + i * 100)
              if data.length < 10
                if timeout_id > 1
                  timeout_id = 1
                else if timeout_id == 0
                  increase = true
                else
                  clear = true
              else
                if timeout_id > 0
                  timeout_id = 0
                else
                  clear = true
            else
              if timeout_id < 2
                increase = true
              else if timeout_id > 2
                timeout_id = 2
          else
            # something wrong with chat
            if timeout_id < 3
              timeout_id = 3
              @app.notify("Ошибка при получении сообщений чата (status: " + data + ")")
          @update(timeout_id, increase, clear)
      }
    )

  update: (timeout_id, increase = false, clear = false) ->
    timeout_id = @cur_timeout if timeout_id == undefined
    update_now = false
    if timeout_id == -1
      timeout_id = 0
      update_now = true
      @counters = {}
    if timeout_id != @cur_timeout
      @counters = {}
    @counters[timeout_id] = 0 if clear || @counters[timeout_id] == undefined
    @counters[timeout_id]++ if increase
    if @counters[timeout_id] > 5 && timeout_id < 2
      @counters = {}
      timeout_id++
    @cur_timeout = timeout_id
    @queryId++
    tick_queryId = @queryId
    if update_now
      @_update_ticker(tick_queryId)
    else
      setTimeout(
        =>
          @_update_ticker(tick_queryId)
        @timeouts[timeout_id] || @timeouts[@timeouts.length - 1]
      )

  _update_users: (queryId) ->
    return if queryId != @queryUsersId
    @app.rest.read("chat/:id/who",
      {
        params: {id: @id}
        data: {limit: "50"}
        always: (success, data) =>
          return if queryId != @queryUsersId
          if success
            data = data || []
            id_list = []
            for item in data
              id_list.push(item.id)
            $(".chat-user", @e.online_users).each( ->
              $this = $(this)
              id = $this.data("userId")
              if id in id_list
                i = 0
                while i < id_list.length
                  if id_list[i] == id
                    id_list.splice(i, 1)
                  else
                    i++
              else
                $this.remove()
            )
            for item in data
              if item.id in id_list
                obj = @e.tpl_user.clone().data("userId", item.id)
                $(".name", obj).text(item.name).attr("href", "/users/" + item.id)
                @e.online_users.prepend(obj.fadeIn("700"))
          @update_users(success)
      }
    )

  update_users: (success) ->
    @queryUsersId++
    multiply = 3
    tick_queryId = @queryUsersId
    if success == -1
      @_update_users(tick_queryId)
    else
      if success
        timeout = @timeouts[@cur_timeout] * multiply
      else
        timeout = @timeouts[3] * multiply
      setTimeout(
        =>
          @_update_users(tick_queryId)
        timeout
      )

class App
  conf = window.mi_conf || {}

  user =
    id: null
    name: ""

  templates = {}
  pages = {}
  active_page = undefined
  query_params = undefined

  constructor: (opts = {}, name) ->
    # App is Singleton
    if window.mi_app
      error "App is already running", "crit"
    window.mi_app = @
    # We need Rest lib
    if window.MiRest == undefined
      error "We need rest lib", "crit"
    window.mi_rest = @rest = new window.MiRest {url: conf.api_url}

    $.extend conf, opts

    if name != undefined
      @page_show(name, conf.page_conf)

    @auth_modal = $("#auth_modal")

    self = @
    $(".login-url").click (e) =>
      e.preventDefault()
      e.stopPropagation()
      @show_auth_modal("login")

    $(".register-url").click (e) =>
      e.preventDefault()
      e.stopPropagation()
      @show_auth_modal("reg")

    current_url = window.location.href.toString().split(window.location.host)[1]
    $("form", @auth_modal).each ->
      $this = $(this)
      action = $this.attr("action")
      if /\?/.test(action)
        action+= "&"
      else
        action+= "?"
      $this.attr("action", action + "back_url=" + encodeURIComponent(current_url))

    $("a", $(".soc-hor", @auth_modal)).each ->
      $this = $(this)
      href = $this.attr("href")
      if /\?/.test(href)
        href+= "&"
      else
        href+= "?"
      $this.attr("href", href + "next=" + encodeURIComponent("/tokenize/?back_url=" + current_url))

  show_auth_modal: (index) ->
    index = "reg" if index == undefined
    if index == "reg"
      $('.nav-tabs >li, .popup-content > div').removeClass('active');
      $('.nav-tabs >li:eq(1), .popup-content > div:eq(1)', @auth_modal).addClass('active');
    else
      $('.nav-tabs >li, .popup-content > div', @auth_modal).removeClass('active');
      $('.nav-tabs >li:eq(0), .popup-content > div:eq(0)', @auth_modal).addClass('active');
    @auth_modal.modal("show")

  config: (name) ->
    if name == undefined
      return conf
    else
      return conf[name]

  user_is_auth: (ask_sign_in = true) ->
    if !@rest.has_auth()
      if ask_sign_in
        @auth_modal.modal("show")
        false
    else
      true

  query_params: (name) ->
    if !query_params
      query_params = $.parseParams()
    if name
      return query_params[name]
    else
      return query_params

  page_hide: (name) ->
    if !_pages[name]
      if active_page == name
        pages[name].hide()
        active_page = undefined
      else
        error "Page " + name + " is not active"
    else
      error "No page " + name + " found"

  page_show: (name, conf) ->
    p = @page(name, conf)
    if p
      active_page = name
      p.show()
    else
      error "No page " + name + "found"

  page_active: (name) ->
    return active_page if name == undefined
    return pages[name] if active_page == name
    page_show(name)

  page: (name, conf) ->
    if name == undefined
      name = active_page
    return pages[name] if pages[name]
    #try
    page_obj = new (eval("Page_" + name))(conf)
    page_obj.app = @
    return pages[name] = page_obj
    #catch
    #  error "Unable to init page " + name, "crit"
    #  return undefined

  notify: (text, type = "norm") ->
    $(".top-right").notify({
      message: { text: text, type: "warning" }
    }).show();

  # get template or load it from scratch
  get_tpl: (name, callback) ->
    if templates[name]
      if callback
        callback templates[name]
    else
      ajax_opts =
        url: @config("tpl_url") + name
        dataType: "html"
        error: ->
          error "Unable to load template name \"" + name + "\""
          if callback
            callback undefined
        success: (data) =>
          if callback
            callback templates[name] = $(data)
      $.ajax ajax_opts

  # register template with current jQuery object
  register_tpl: (name, jObj) ->
    templates[name] = jObj

class Page_Simple extends Page

class Page_Main extends Page
  current_vid = "new"
  vid_opts =
    popular: {cur_page: 0, pages_num: 1, limit: false, loading: false}
    new: {cur_page: 0, pages_num: 1, limit: false, loading: false}

  constructor: ->
    super

    @e["btn_vid_popular"].click(
      (e) => e.preventDefault(); @switch_vid("popular")
    )
    @e["btn_vid_new"].click(
      (e) => e.preventDefault(); @switch_vid("new")
    )
    @e["btn_vid_left"].click(
      (e) => e.preventDefault(); @change_vid_page("left")
    )
    @e["btn_vid_right"].click(
      (e) => e.preventDefault(); @change_vid_page("right")
    )
    @app.get_tpl("film-thumb")
    @chat = new Chat("1", {output: @e.chat_output, online_users: @e.chat_online_users, form: @e.chat_form})

  switch_vid: (type) ->
    return if type == current_vid
    @e["vid_" + current_vid].hide(); @e["vid_" + type].show()
    @e["btn_vid_" + current_vid].removeClass("tab-btn-active"); @e["btn_vid_" + type].addClass("tab-btn-active");
    current_vid = type
    @refresh_vid_page_btn()

  change_vid_page: (dir) ->
    op = vid_opts[current_vid]
    if dir == "right"
      if op.cur_page < (op.pages_num - 1)
        @move_to_vid_page(current_vid, op.cur_page + 1)
      else
        return if op.limit || op.loading
        op.loading = true
        place = $('<div class="vid-page vid-page-loading"></div>')
        op.pages_num++
        @e["vid_" + current_vid].append(place).width((op.pages_num * 100) + "%")
        $(".vid-page", @e["vid_" + current_vid]).width((100 / op.pages_num) + "%")
        @move_to_vid_page(current_vid, op.pages_num - 1)
        if current_vid == "new"
          order = "date"
        else
          order = "votes"

        @app.rest.read("media/list",
          {
            data: {order: order, limit: "12," + 12 * (op.pages_num - 1)},
            always: (success, data) =>
              if success
                if data && data.length
                  for item in data
                    new FilmThumb({parent: place, vals: item})
                  place.removeClass("vid-page-loading")
                  # place.text(data.toString())
                  op.limit = true if data.length < 12
                else
                  op.pages_num--
                  @move_to_vid_page(current_vid, op.pages_num - 1)
                  place.remove()
                  op.limit = true
                op.loading = false
              else
                op.pages_num--
                @move_to_vid_page(current_vid, op.pages_num - 1)
                place.remove()
                op.loading = false
                op.limit = true
                #@app.notify("Can't load data")
          }
        )
    else
      @move_to_vid_page current_vid, op.cur_page - 1

  move_to_vid_page: (type, page) ->
    op = vid_opts[type]
    return if op.cur_page == page
    return if page < 0 || ((op.loading || op.limit) && page >= op.pages_num)
    e = @e["vid_" + type]
    e.stop().animate({"margin-left": (- page * 100) + "%"})
    op.cur_page = page
    @refresh_vid_page_btn()

  refresh_vid_page_btn: ->
    op = vid_opts[current_vid]
    if op.cur_page == 0
      @e["btn_vid_left"].removeClass("tab-btn-active")
    else
      @e["btn_vid_left"].addClass("tab-btn-active")

    if (op.cur_page >= (op.pages_num - 1)) && (op.limit || op.loading)
      @e["btn_vid_right"].removeClass("tab-btn-active")
    else
      @e["btn_vid_right"].addClass("tab-btn-active")

class Page_Video extends Page
  constructor: (@conf) ->
    super
    self = @

    videojs("video").ready( ->
      self.player = new Player(this)
    )
    @update_media_list_size()

  update_media_list_size: ->
    self = @
    $(".media-list", @e.units_media).each( ->
      width = 0
      $this = $(this)
      $(".cast-thumb", $this).each(->
        console.log $(this).outerWidth()
        width+= $(this).outerWidth() + 20
      )
      console.log width
      $this.width(width)
    )
  true

class Page_News extends Page
  constructor: (@conf) ->
    super

window.InitApp =  (opts = {}, page_name) ->
  new App(opts, page_name)
  delete window.InitApp