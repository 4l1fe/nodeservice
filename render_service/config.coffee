path = require "path"
fs = require 'fs'
yaml = require 'js-yaml'

# get real path of the app
@path = path.dirname(process.mainModule.filename)

# set pathes
@themes_path = @path + "/themes/"
@engine_path = @path + "/engine/"
@lib_path = @engine_path + "lib/"
@jade_path = @engine_path + "jade/"
@helpers_path = @engine_path + "helpers/"

# set prefixes and suffixes
@tpl_page_prefix = "page_"
@jade_ext = ".jade"
@tpl_config_ext = ".config"

# set theme params
@theme_name = "show_online_full"
@theme_path = @themes_path + @theme_name + "/"
@theme_global_config = @theme_path + ".config"

# dictionaries
@dict_os =
  mobile: ["ios", "android", "windows phone"]
@dict_devices =
  tablets: ["ipad", "nexus 10", "nexus 7", "kindle fire", "blackberry playbook"]
  smartphones: ["iphone"]
  smarttv: []

# set urls
@content_url = "http://localhost:63342/vmcs_from_live/tmp/content/"
@static_url = "http://localhost:63342/vmcs_from_live/tmp/static/"
@cdn_url = "http://localhost:63342/vmcs_from_live/tmp/cdn/"
@themes_url = @static_url + "themes/"
@theme_url = @themes_url + @theme_name + "/"

# create resource object (urls list for templates)
@resources =
  theme: @theme_url
  img: @theme_url + "img/"
  js: @theme_url + "js/"
  css: @theme_url + "css/"
  global:
    content: @content_url
    content_media: @content_url + "media/"
    content_users: @content_url + "users/"
    cdn: @cdn_url
    static: @static_url
    img: @static_url + "img/"
    js: @static_url + "js/"
    css: @static_url + "css/"

###
@server = yaml.safeLoad(fs.readFileSync path.join(@path, '..', 'configs', 'node_service.yaml'), 'utf8')

# set app port and host
@app_port = @server['render_serv']['port']
@app_host = @server['render_serv']['host']

# set backend(zeroprpc) port and host
@backend_host = @server['render_serv']['backend']['host']
@backend_port = @server['render_serv']['backend']['port']
###
@connection_string = 'tcp://' + @backend_host + ':' + @backend_port


@backend_host = "127.0.0.1"
@backend_port = 6600

@app_host = "127.0.0.1"
@app_port = 9901
