path = require('path')
fs = require("fs")
yaml = require("js-yaml")
argparse = require("argparse")


@path = __dirname
@upload_dir = path.join(@path, 'upload')
@debug = true
@heartbeat = 100000

@parser  = new argparse.ArgumentParser({addHelp: false})
@parser.addArgument(['-h','--host'], {dest: 'host'})
@parser.addArgument(['-p','--port'], {dest: 'port'})
@parser.addArgument(['-bh','--backend_host'], {dest: 'backend_host'})
@parser.addArgument(['-bp','--backend_port'], {dest: 'backend_port'})
@namespace = @parser.parseArgs()
@server = yaml.safeLoad(fs.readFileSync path.join(@path, '..', 'configs', 'node_service.yaml'), 'utf8')

@app_host = if @namespace['host'] then @namespace['host'] else @server['rest_ws_serv']['host']
@app_port = if @namespace['port'] then @namespace['port'] else @server['rest_ws_serv']['port']
@backend_host = if @namespace['backend_host'] then @namespace['backend_host'] else @server['rest_ws_serv']['backend']['host']
@backend_port = if @namespace['backend_port'] then @namespace['backend_port'] else @server['rest_ws_serv']['backend']['port']