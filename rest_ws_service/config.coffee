path = require('path')
fs = require("fs")
yaml = require("js-yaml")

# get real path of the app
@path = __dirname
@upload_dir = path.join(@path, 'upload')
@debug = true
@heartbeat = 100000
@server = yaml.safeLoad(fs.readFileSync path.join(@path, '..', 'configs', 'node_service.yaml'), 'utf8')

# set app port and host
@app_port = @server['rest_ws_serv']['port']
@app_host = @server['rest_ws_serv']['host']

# set backend(zeroprpc) port and host
@backend_host = @server['rest_ws_serv']['backend']['host']
@backend_port = @server['rest_ws_serv']['backend']['port']
