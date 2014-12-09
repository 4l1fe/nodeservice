// Generated by CoffeeScript 1.7.1
(function() {
  'use strict';
  var App, Chat, FilmThumb, Item, MediaBlock, Page, Page_Main, Page_News, Page_OneNews, Page_Show, Page_Simple, Page_Video, check_app_is_init, error, scroll_to_obj,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.mi_app = void 0;

  error = function(txt, type) {
    if (type == null) {
      type = "norm";
    }
    if (type === "crit") {
      throw new Error("CRITICAL ERROR: " + txt);
    } else {
      return console.log("ERROR: " + txt);
    }
  };

  check_app_is_init = function(c) {
    if (!window.mi_app) {
      return error("App is not init", "crit");
    } else {
      return c._app = window.mi_app;
    }
  };

  scroll_to_obj = function(obj, duration) {
    if (duration == null) {
      duration = 1000;
    }
    return $('html, body').stop().animate({
      scrollTop: obj.offset().top
    }, duration);
  };

  Page = (function() {
    function Page(conf) {
      var self;
      check_app_is_init(this);
      this.e = {};
      this._visible = false;
      this.conf = conf || {};
      this.app = this._app;
      self = this;
      $("*[data-mi-pid]").each(function() {
        var $this;
        $this = $(this);
        return self.e[$this.data("miPid")] = $this;
      });
    }

    Page.prototype.show = function() {
      return this._visible = true;
    };

    Page.prototype.hide = function() {
      return this._visible = false;
    };

    Page.prototype.isVisible = function() {
      return this._visible;
    };

    Page.prototype.user_is_auth = function(modal) {
      return this._app.user_is_auth(modal);
    };

    return Page;

  })();

  Item = (function() {
    function Item(opts, callback) {
      if (opts == null) {
        opts = {};
      }
      if (callback == null) {
        callback = void 0;
      }
      check_app_is_init(this);
      if (!this._name) {
        error("It's wrong to use parent class", "crit");
      }
      this.vals = {};
      this.defaults = {};
      this.elements = {};
      this.e_attrs = {};
      this.e_vals = {};
      if (opts.defaults) {
        $.extend(this.defaults, opts.defaults);
      }
      if (opts.place === void 0) {
        this._place = $('<span class="preload-' + this._name + '"></span>');
        if (opts.parent) {
          if (opts.up) {
            this._place.prependTo(opts.parent);
          } else {
            this._place.appendTo(opts.parent);
          }
        }
        this._app.get_tpl(this._name, (function(_this) {
          return function(tpl_obj) {
            var old_place;
            if (tpl_obj) {
              old_place = _this._place;
              _this._place = tpl_obj.clone();
              _this.set_elements();
              if (opts.vals) {
                _this.set_vals(opts.vals, opts.do_not_set);
              }
              _this._place.insertAfter(old_place);
              old_place.remove();
              if (callback) {
                return callback(_this);
              }
            } else {
              return error('Unable to load template for object "' + _this._name + '"');
            }
          };
        })(this));
      } else {
        this._place = opts.place;
        this.set_elements();
        if (opts.vals) {
          this.set_vals(opts.vals, opts.do_not_set);
        }
        if (callback) {
          callback(this);
        }
      }
    }

    Item.prototype.place = function() {
      return this._place;
    };

    Item.prototype.parse_element = function($this) {
      var data, e, name, value;
      data = $this.data();
      name = void 0;
      value = void 0;
      e = {
        self: $this
      };
      return $.each(data, (function(_this) {
        return function(key, val) {
          var attr, i, method, name_arr, o;
          key = key.substr(2).toLowerCase();
          if (key === "id") {
            _this.elements[val] = e;
            if (name === void 0) {
              name = key;
            }
          }
          if (key === "name") {
            name = val;
            if (_this.e_vals[val] === void 0) {
              _this.e_vals[val] = [];
            }
            _this.e_vals[val].push(e);
          } else if (key.substr(0, 2) === "on") {
            method = key.substr(2);
            if (typeof _this[val] === "function") {
              $this.bind(method, function() {
                return _this[val]();
              });
            }
          } else if (key.substr(0, 2) === "at") {
            attr = key.substr(2);
            if (e.attr === void 0) {
              e.attr = {};
            }
            e.attr[attr] = val;
            if (_this.e_attrs[val] === void 0) {
              _this.e_attrs[val] = {};
            }
            if (_this.e_attrs[val][attr] === void 0) {
              _this.e_attrs[val][attr] = [];
            }
            _this.e_attrs[val][attr].push(e);
          } else {
            e[key] = val;
            if (key === "val") {
              value = val;
            }
          }
          if (name !== void 0 && value !== void 0) {
            name_arr = name.split(".");
            o = _this.vals;
            i = 0;
            while (i < name_arr.length - 2) {
              o = o[name_arr[i]];
              if (o === void 0) {
                o = {};
              }
              i++;
            }
            return o[name_arr[i]] = value;
          }
        };
      })(this));
    };

    Item.prototype.set_elements = function() {
      var self;
      this.elements = {};
      self = this;
      $("*", this._place).each(function() {
        return self.parse_element($(this));
      });
      return this.parse_element(this._place);
    };

    Item.prototype.get_val = function(name) {
      if (name) {
        return this.vals[name];
      } else {
        return this.vals;
      }
    };

    Item.prototype.set_val = function(name, val, do_not_set) {
      val = this.transform_val(name, val);
      this.vals[name] = val;
      if (!do_not_set) {
        return this.iterate_val(name, val || this.defaults[name]);
      }
    };

    Item.prototype.iterate_val = function(s, obj) {
      var attr, e, key, val, _i, _len, _ref, _results, _results1;
      if (typeof obj === "object") {
        _results = [];
        for (key in obj) {
          _results.push(this.iterate_val(s + "." + key, obj[key]));
        }
        return _results;
      } else {
        if (this.e_vals[s]) {
          _ref = this.e_vals[s];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            e = _ref[_i];
            e.self.html(obj || e["default"]);
          }
        }
        if (this.e_attrs[s]) {
          _results1 = [];
          for (attr in this.e_attrs[s]) {
            _results1.push((function() {
              var _j, _len1, _ref1, _results2;
              _ref1 = this.e_attrs[s][attr];
              _results2 = [];
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                e = _ref1[_j];
                val = this.transform_attr(attr, s, obj);
                if (attr === "bg") {
                  _results2.push(e.self.background_image(val || e["default"]));
                } else {
                  _results2.push(e.self.attr(attr, val || e["default"]));
                }
              }
              return _results2;
            }).call(this));
          }
          return _results1;
        }
      }
    };

    Item.prototype.set_vals = function(vals, do_not_set) {
      var key, val;
      this.reset();
      for (key in vals) {
        val = vals[key];
        this.set_val(key, val, do_not_set);
      }
      return vals;
    };

    Item.prototype.transform_val = function(name, val) {
      return val;
    };

    Item.prototype.transform_attr = function(attr, name, val) {
      return val;
    };

    Item.prototype.user_is_auth = function() {
      return this._app.user_is_auth();
    };

    Item.prototype.reset = function() {
      return this.vals = {};
    };

    Item.prototype.show = function() {
      return this._place.show();
    };

    Item.prototype.hide = function() {
      return this._place.hide();
    };

    Item.prototype.remove = function() {
      return this._place.remove();
    };

    return Item;

  })();

  FilmThumb = (function(_super) {
    __extends(FilmThumb, _super);

    function FilmThumb(opts, callback) {
      if (opts == null) {
        opts = {};
      }
      this._name = "film-thumb";
      FilmThumb.__super__.constructor.apply(this, arguments);
    }

    FilmThumb.prototype.transform_attr = function(attr, name, val) {
      var href;
      if (attr === "href" && name === "id") {
        if (this.vals.units && this.vals.units[0]) {
          href = this.vals.units[0].topic.name + "/media/" + this.vals.id;
        } else {
          href = "/media/" + this.vals.id;
        }
        return href;
      }
      if ((attr === "alt" || attr === "title") && name === "name") {
        return this.vals["name"];
      }
      if (attr === "src" && name === "id") {
        return this._app.config("content_media") + this.vals.id + "/poster";
      }
      return FilmThumb.__super__.transform_attr.apply(this, arguments);
    };

    FilmThumb.prototype.transform_val = function(name, val) {
      if (name === "duration") {
        return duration_text(val || 0);
      }
      return FilmThumb.__super__.transform_val.apply(this, arguments);
    };

    FilmThumb.prototype.set_vals = function(vals, do_not_set) {
      if (vals.releasedate) {
        vals["date"] = time_text(new Date(vals.releasedate));
      }
      if (vals["topic"] === void 0) {
        vals["topic"] = "";
      }
      if (vals.units && vals.units[0]) {
        vals["topic"] = vals.units[0].topic.title;
        vals["title"] = vals.units[0].title;
        if (vals.units[0].morder) {
          vals["title"] += ", " + vals.units[0].morder + " серия";
        }
      }
      if (vals["topic"]) {
        vals["title"] = vals["topic"] + ": " + vals["title"];
      }
      return FilmThumb.__super__.set_vals.apply(this, arguments);
    };

    return FilmThumb;

  })(Item);

  MediaBlock = (function() {
    var current_vid, vid_opts;

    current_vid = "new";

    vid_opts = {
      popular: {
        cur_page: 0,
        pages_num: 1,
        limit: false,
        loading: false
      },
      "new": {
        cur_page: 0,
        pages_num: 1,
        limit: false,
        loading: false
      }
    };

    function MediaBlock(parent, param_opts) {
      this.parent = parent;
      this.param_opts = param_opts != null ? param_opts : {};
      this.app = window.mi_app;
      this.e = {
        btn_vid_popular: $(".btn_vid_popular", this.parent),
        btn_vid_new: $(".btn_vid_new", this.parent),
        btn_vid_left: $(".btn_vid_left", this.parent),
        btn_vid_right: $(".btn_vid_right", this.parent),
        vid_new: $(".vid_new", this.parent),
        vid_popular: $(".vid_popular", this.parent)
      };
      this.e["btn_vid_popular"].click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.switch_vid("popular");
        };
      })(this));
      this.e["btn_vid_new"].click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.switch_vid("new");
        };
      })(this));
      this.e["btn_vid_left"].click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.change_vid_page("left");
        };
      })(this));
      this.e["btn_vid_right"].click((function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.change_vid_page("right");
        };
      })(this));
      this.app.get_tpl("film-thumb");
    }

    MediaBlock.prototype.switch_vid = function(type) {
      if (type === current_vid) {
        return;
      }
      this.e["vid_" + current_vid].hide();
      this.e["vid_" + type].show();
      this.e["btn_vid_" + current_vid].removeClass("tab-btn-active");
      this.e["btn_vid_" + type].addClass("tab-btn-active");
      current_vid = type;
      return this.refresh_vid_page_btn();
    };

    MediaBlock.prototype.change_vid_page = function(dir) {
      var op, order, param, place;
      op = vid_opts[current_vid];
      if (dir === "right") {
        if (op.cur_page < (op.pages_num - 1)) {
          return this.move_to_vid_page(current_vid, op.cur_page + 1);
        } else {
          if (op.limit || op.loading) {
            return;
          }
          op.loading = true;
          place = $('<div class="vid-page vid-page-loading"></div>');
          op.pages_num++;
          this.e["vid_" + current_vid].append(place).width((op.pages_num * 100) + "%");
          $(".vid-page", this.e["vid_" + current_vid]).width((100 / op.pages_num) + "%");
          this.move_to_vid_page(current_vid, op.pages_num - 1);
          if (current_vid === "new") {
            order = "date";
          } else {
            order = "votes";
          }
          param = $.extend({}, this.param_opts);
          param.order = order;
          param.limit = "12," + 12 * (op.pages_num - 1);
          return this.app.rest.read("media/list", {
            data: param,
            always: (function(_this) {
              return function(success, data) {
                var item, _i, _len;
                if (success) {
                  if (data && data.length) {
                    for (_i = 0, _len = data.length; _i < _len; _i++) {
                      item = data[_i];
                      new FilmThumb({
                        parent: place,
                        vals: item
                      });
                    }
                    place.removeClass("vid-page-loading");
                    if (data.length < 12) {
                      op.limit = true;
                    }
                  } else {
                    op.pages_num--;
                    _this.move_to_vid_page(current_vid, op.pages_num - 1);
                    place.remove();
                    op.limit = true;
                  }
                  return op.loading = false;
                } else {
                  op.pages_num--;
                  _this.move_to_vid_page(current_vid, op.pages_num - 1);
                  place.remove();
                  op.loading = false;
                  return op.limit = true;
                }
              };
            })(this)
          });
        }
      } else {
        return this.move_to_vid_page(current_vid, op.cur_page - 1);
      }
    };

    MediaBlock.prototype.move_to_vid_page = function(type, page) {
      var e, op;
      op = vid_opts[type];
      if (op.cur_page === page) {
        return;
      }
      if (page < 0 || ((op.loading || op.limit) && page >= op.pages_num)) {
        return;
      }
      e = this.e["vid_" + type];
      e.stop().animate({
        "margin-left": (-page * 100) + "%"
      });
      op.cur_page = page;
      return this.refresh_vid_page_btn();
    };

    MediaBlock.prototype.refresh_vid_page_btn = function() {
      var op;
      op = vid_opts[current_vid];
      if (op.cur_page === 0) {
        this.e["btn_vid_left"].removeClass("tab-btn-active");
      } else {
        this.e["btn_vid_left"].addClass("tab-btn-active");
      }
      if ((op.cur_page >= (op.pages_num - 1)) && (op.limit || op.loading)) {
        return this.e["btn_vid_right"].removeClass("tab-btn-active");
      } else {
        return this.e["btn_vid_right"].addClass("tab-btn-active");
      }
    };

    return MediaBlock;

  })();

  Chat = (function() {
    function Chat(id, opts) {
      var start_update, start_update_counter;
      this.id = id;
      this.lastMsgId = 0;
      this.timeouts = [3000, 7000, 10000, 40000];
      this.cur_timeout = 0;
      this.counters = {};
      this.loading = false;
      this.queryId = 0;
      this.queryUsersId = 0;
      this.app = window.mi_app;
      this.e = {};
      this.e.output = opts.output;
      if (opts.online_users) {
        this.e.online_users = opts.online_users;
      }
      if (opts.form) {
        this.e.form = opts.form;
        this.e.form.submit((function(_this) {
          return function(e) {
            e.preventDefault();
            return _this.send();
          };
        })(this));
        this.e.input = $('input[type="text"]', this.e.form);
      }
      if (opts.input) {
        this.e.input = opts.input;
      }
      if (this.e.input) {
        this.e.input.focus((function(_this) {
          return function(e) {
            return _this.app.user_is_auth();
          };
        })(this));
        this.e.input.keyup(((function(_this) {
          return function(e) {
            if (e.keyCode === 13) {
              e.preventDefault();
              _this.send();
            }
            if (e.keyCode === 27) {
              e.preventDefault();
              return _this.e.input.val("").focus();
            }
          };
        })(this)));
      }
      start_update_counter = 0;
      start_update = (function(_this) {
        return function() {
          if (start_update_counter >= 2) {
            _this.update(-1);
            return _this.update_users(-1);
          }
        };
      })(this);
      this.app.get_tpl("chat-msg-thumb", (function(_this) {
        return function(tpl) {
          _this.e.tpl_msg = tpl;
          start_update_counter++;
          return start_update();
        };
      })(this));
      this.app.get_tpl("chat-msg-user", (function(_this) {
        return function(tpl) {
          _this.e.tpl_user = tpl;
          start_update_counter++;
          return start_update();
        };
      })(this));
    }

    Chat.prototype.send = function() {
      var val;
      if (this.app.user_is_auth()) {
        val = this.e.input.val().trim();
        if (val.length < 10) {
          this.app.notify("В сообщении должно быть больше 10 символов");
          return;
        }
        this.e.input.prop('disabled', true);
        return this.app.rest.create("chat/:id/send", {
          params: {
            id: this.id
          },
          auth: true,
          data: {
            text: val
          },
          always: (function(_this) {
            return function(success, data) {
              if (success) {
                _this.update(-1);
                _this.e.input.val("");
              } else {
                _this.app.notify("Не могу отослать сообщение в чат (status: " + data + ")");
              }
              return _this.e.input.prop("disabled", false).focus();
            };
          })(this)
        });
      }
    };

    Chat.prototype._update_ticker = function(queryId) {
      if (queryId !== this.queryId) {
        return;
      }
      return this.app.rest.read("chat/:id/stream", {
        params: {
          id: this.id
        },
        data: {
          limit: "10,," + this.lastMsgId
        },
        always: (function(_this) {
          return function(success, data) {
            var clear, i, increase, is_scroll_bottom, item, item_tpl, timeout_id;
            if (queryId !== _this.queryId) {
              return;
            }
            timeout_id = _this.cur_timeout;
            increase = void 0;
            clear = void 0;
            if (success) {
              if (data && data.length) {
                is_scroll_bottom = _this.e.output[0].scrollHeight - _this.e.output.scrollTop() <= (_this.e.output.outerHeight() + 10);
                for (i in data) {
                  item = data[i];
                  item_tpl = _this.e.tpl_msg.clone();
                  $(".name", item_tpl).text(item.user.name + ":").attr("href", "/users/" + item.user.id);
                  $(".text", item_tpl).text(item.text);
                  _this.e.output.append(item_tpl.fadeIn(700 + 150 * i));
                  if (item.id > _this.lastMsgId) {
                    _this.lastMsgId = item.id;
                  }
                }
                if (is_scroll_bottom) {
                  _this.e.output.stop().animate({
                    scrollTop: _this.e.output[0].scrollHeight
                  }, 500 + i * 100);
                }
                if (data.length < 10) {
                  if (timeout_id > 1) {
                    timeout_id = 1;
                  } else if (timeout_id === 0) {
                    increase = true;
                  } else {
                    clear = true;
                  }
                } else {
                  if (timeout_id > 0) {
                    timeout_id = 0;
                  } else {
                    clear = true;
                  }
                }
              } else {
                if (timeout_id < 2) {
                  increase = true;
                } else if (timeout_id > 2) {
                  timeout_id = 2;
                }
              }
            } else {
              if (timeout_id < 3) {
                timeout_id = 3;
                _this.app.notify("Ошибка при получении сообщений чата (status: " + data + ")");
              }
            }
            return _this.update(timeout_id, increase, clear);
          };
        })(this)
      });
    };

    Chat.prototype.update = function(timeout_id, increase, clear) {
      var tick_queryId, update_now;
      if (increase == null) {
        increase = false;
      }
      if (clear == null) {
        clear = false;
      }
      if (timeout_id === void 0) {
        timeout_id = this.cur_timeout;
      }
      update_now = false;
      if (timeout_id === -1) {
        timeout_id = 0;
        update_now = true;
        this.counters = {};
      }
      if (timeout_id !== this.cur_timeout) {
        this.counters = {};
      }
      if (clear || this.counters[timeout_id] === void 0) {
        this.counters[timeout_id] = 0;
      }
      if (increase) {
        this.counters[timeout_id]++;
      }
      if (this.counters[timeout_id] > 5 && timeout_id < 2) {
        this.counters = {};
        timeout_id++;
      }
      this.cur_timeout = timeout_id;
      this.queryId++;
      tick_queryId = this.queryId;
      if (update_now) {
        return this._update_ticker(tick_queryId);
      } else {
        return setTimeout((function(_this) {
          return function() {
            return _this._update_ticker(tick_queryId);
          };
        })(this), this.timeouts[timeout_id] || this.timeouts[this.timeouts.length - 1]);
      }
    };

    Chat.prototype._update_users = function(queryId) {
      if (queryId !== this.queryUsersId) {
        return;
      }
      return this.app.rest.read("chat/:id/who", {
        params: {
          id: this.id
        },
        data: {
          limit: "50"
        },
        always: (function(_this) {
          return function(success, data) {
            var id_list, item, obj, _i, _j, _len, _len1, _ref;
            if (queryId !== _this.queryUsersId) {
              return;
            }
            if (success) {
              data = data || [];
              id_list = [];
              for (_i = 0, _len = data.length; _i < _len; _i++) {
                item = data[_i];
                id_list.push(item.id);
              }
              $(".chat-user", _this.e.online_users).each(function() {
                var $this, i, id, _results;
                $this = $(this);
                id = $this.data("userId");
                if (__indexOf.call(id_list, id) >= 0) {
                  i = 0;
                  _results = [];
                  while (i < id_list.length) {
                    if (id_list[i] === id) {
                      _results.push(id_list.splice(i, 1));
                    } else {
                      _results.push(i++);
                    }
                  }
                  return _results;
                } else {
                  return $this.remove();
                }
              });
              for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
                item = data[_j];
                if (_ref = item.id, __indexOf.call(id_list, _ref) >= 0) {
                  obj = _this.e.tpl_user.clone().data("userId", item.id);
                  $(".name", obj).text(item.name).attr("href", "/users/" + item.id);
                  _this.e.online_users.prepend(obj.fadeIn("700"));
                }
              }
            }
            return _this.update_users(success);
          };
        })(this)
      });
    };

    Chat.prototype.update_users = function(success) {
      var multiply, tick_queryId, timeout;
      this.queryUsersId++;
      multiply = 3;
      tick_queryId = this.queryUsersId;
      if (success === -1) {
        return this._update_users(tick_queryId);
      } else {
        if (success) {
          timeout = this.timeouts[this.cur_timeout] * multiply;
        } else {
          timeout = this.timeouts[3] * multiply;
        }
        return setTimeout((function(_this) {
          return function() {
            return _this._update_users(tick_queryId);
          };
        })(this), timeout);
      }
    };

    return Chat;

  })();

  App = (function() {
    var active_page, conf, pages, query_params, templates, user;

    conf = window.mi_conf || {};

    user = {
      id: null,
      name: ""
    };

    templates = {};

    pages = {};

    active_page = void 0;

    query_params = void 0;

    function App(opts, name) {
      var current_url, self;
      if (opts == null) {
        opts = {};
      }
      if (window.mi_app) {
        error("App is already running", "crit");
      }
      window.mi_app = this;
      if (window.MiRest === void 0) {
        error("We need rest lib", "crit");
      }
      window.mi_rest = this.rest = new window.MiRest({
        url: conf.api_url
      });
      $.extend(conf, opts);
      if (name !== void 0) {
        this.page_show(name, conf.page_conf);
      }
      this.auth_modal = $("#auth_modal");
      self = this;
      $(".login-url").click((function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          return _this.show_auth_modal("login");
        };
      })(this));
      $(".register-url").click((function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          return _this.show_auth_modal("reg");
        };
      })(this));
      current_url = window.location.href.toString().split(window.location.host)[1];
      $("form", this.auth_modal).each(function() {
        var $this, action;
        $this = $(this);
        action = $this.attr("action");
        if (/\?/.test(action)) {
          action += "&";
        } else {
          action += "?";
        }
        return $this.attr("action", action + "back_url=" + encodeURIComponent(current_url));
      });
      $("a", $(".soc-hor", this.auth_modal)).each(function() {
        var $this, href;
        $this = $(this);
        href = $this.attr("href");
        if (/\?/.test(href)) {
          href += "&";
        } else {
          href += "?";
        }
        return $this.attr("href", href + "next=" + encodeURIComponent("/tokenize/?back_url=" + current_url));
      });
    }

    App.prototype.show_auth_modal = function(index) {
      if (index === void 0) {
        index = "reg";
      }
      if (index === "reg") {
        $('.nav-tabs >li, .popup-content > div').removeClass('active');
        $('.nav-tabs >li:eq(1), .popup-content > div:eq(1)', this.auth_modal).addClass('active');
      } else {
        $('.nav-tabs >li, .popup-content > div', this.auth_modal).removeClass('active');
        $('.nav-tabs >li:eq(0), .popup-content > div:eq(0)', this.auth_modal).addClass('active');
      }
      return this.auth_modal.modal("show");
    };

    App.prototype.config = function(name) {
      if (name === void 0) {
        return conf;
      } else {
        return conf[name];
      }
    };

    App.prototype.user_is_auth = function(ask_sign_in) {
      if (ask_sign_in == null) {
        ask_sign_in = true;
      }
      if (!this.rest.has_auth()) {
        if (ask_sign_in) {
          this.auth_modal.modal("show");
          return false;
        }
      } else {
        return true;
      }
    };

    App.prototype.query_params = function(name) {
      if (!query_params) {
        query_params = $.parseParams();
      }
      if (name) {
        return query_params[name];
      } else {
        return query_params;
      }
    };

    App.prototype.page_hide = function(name) {
      if (!_pages[name]) {
        if (active_page === name) {
          pages[name].hide();
          return active_page = void 0;
        } else {
          return error("Page " + name + " is not active");
        }
      } else {
        return error("No page " + name + " found");
      }
    };

    App.prototype.page_show = function(name, conf) {
      var p;
      p = this.page(name, conf);
      if (p) {
        active_page = name;
        return p.show();
      } else {
        return error("No page " + name + "found");
      }
    };

    App.prototype.page_active = function(name) {
      if (name === void 0) {
        return active_page;
      }
      if (active_page === name) {
        return pages[name];
      }
      return page_show(name);
    };

    App.prototype.page = function(name, conf) {
      var page_obj;
      if (name === void 0) {
        name = active_page;
      }
      if (pages[name]) {
        return pages[name];
      }
      page_obj = new (eval("Page_" + name))(conf);
      page_obj.app = this;
      return pages[name] = page_obj;
    };

    App.prototype.notify = function(text, type) {
      if (type == null) {
        type = "norm";
      }
      return $(".top-right").notify({
        message: {
          text: text,
          type: "warning"
        }
      }).show();
    };

    App.prototype.get_tpl = function(name, callback) {
      var ajax_opts;
      if (templates[name]) {
        if (callback) {
          return callback(templates[name]);
        }
      } else {
        ajax_opts = {
          url: this.config("tpl_url") + name,
          dataType: "html",
          error: function() {
            error("Unable to load template name \"" + name + "\"");
            if (callback) {
              return callback(void 0);
            }
          },
          success: (function(_this) {
            return function(data) {
              if (callback) {
                return callback(templates[name] = $(data));
              }
            };
          })(this)
        };
        return $.ajax(ajax_opts);
      }
    };

    App.prototype.register_tpl = function(name, jObj) {
      return templates[name] = jObj;
    };

    return App;

  })();

  Page_Simple = (function(_super) {
    __extends(Page_Simple, _super);

    function Page_Simple() {
      return Page_Simple.__super__.constructor.apply(this, arguments);
    }

    return Page_Simple;

  })(Page);

  Page_Main = (function(_super) {
    __extends(Page_Main, _super);

    function Page_Main() {
      Page_Main.__super__.constructor.apply(this, arguments);
      this.chat = new Chat("1", {
        output: this.e.chat_output,
        online_users: this.e.chat_online_users,
        form: this.e.chat_form
      });
      this.media = new MediaBlock(this.e.media_block, {});
    }

    return Page_Main;

  })(Page);

  Page_Show = (function(_super) {
    __extends(Page_Show, _super);

    function Page_Show(conf) {
      this.conf = conf;
      Page_Show.__super__.constructor.apply(this, arguments);
      this.media = new MediaBlock(this.e.media_block, {
        topic: this.conf.topic.name
      });
    }

    return Page_Show;

  })(Page);

  Page_Video = (function(_super) {
    __extends(Page_Video, _super);

    function Page_Video(conf) {
      var self;
      this.conf = conf;
      Page_Video.__super__.constructor.apply(this, arguments);
      self = this;
      videojs("video").ready(function() {
        return self.player = new Player(this);
      });
      this.update_media_list_size();
      $('a[data-toggle="tab"]', $(".units-media")).on('shown.bs.tab', (function(_this) {
        return function() {
          return _this.update_media_list_size();
        };
      })(this));
    }

    Page_Video.prototype.update_media_list_size = function() {
      var self;
      self = this;
      return $(".media-list", this.e.units_media).each(function() {
        var $this, width;
        width = 0;
        $this = $(this);
        $(".cast-thumb", $this).each(function() {
          return width += $(this).outerWidth() + 20;
        });
        return $this.width(width);
      });
    };

    return Page_Video;

  })(Page);

  Page_News = (function(_super) {
    __extends(Page_News, _super);

    function Page_News(conf) {
      this.conf = conf;
      Page_News.__super__.constructor.apply(this, arguments);
    }

    return Page_News;

  })(Page);

  Page_OneNews = (function(_super) {
    __extends(Page_OneNews, _super);

    function Page_OneNews(conf) {
      this.conf = conf;
      Page_OneNews.__super__.constructor.apply(this, arguments);
    }

    return Page_OneNews;

  })(Page);

  window.InitApp = function(opts, page_name) {
    if (opts == null) {
      opts = {};
    }
    new App(opts, page_name);
    return delete window.InitApp;
  };

}).call(this);
