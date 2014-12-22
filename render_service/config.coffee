path = require "path"
fs = require 'fs'
yaml = require 'js-yaml'
argparse = require 'argparse'

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
@content_url = "/content/"
@static_url = "http://cdn.serialov.tv/s/"
@cdn_url = "http://cdn.serialov.tv/"
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

@parser  = new argparse.ArgumentParser({addHelp: false})
@parser.addArgument(['-h','--host'], {dest: 'host'})
@parser.addArgument(['-p','--port'], {dest: 'port'})
@parser.addArgument(['-bh','--backend_host'], {dest: 'backend_host'})
@parser.addArgument(['-bp','--backend_port'], {dest: 'backend_port'})
@namespace = @parser.parseArgs()
@server = yaml.safeLoad(fs.readFileSync path.join(@path, '..', 'configs', 'node_service.yaml'), 'utf8')

@app_host = if @namespace['host'] then @namespace['host'] else @server['render_serv']['host']
@app_port = if @namespace['port'] then @namespace['port'] else @server['render_serv']['port']
@backend_host = if @namespace['backend_host'] then @namespace['backend_host'] else @server['render_serv']['backend']['host']
@backend_port = if @namespace['backend_port'] then @namespace['backend_port'] else @server['render_serv']['backend']['port']

@connection_string = 'tcp://' + @backend_host + ':' + @backend_port