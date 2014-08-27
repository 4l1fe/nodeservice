var http = require("http"),
    url = require("url"),
    querystring = require("querystring"),
    zerorpc = require("zerorpc"),
    formidable = require("formidable"),
    config = require("./config"),
    ws = require('ws'),
    ua_parser = require('ua-parser');


function makeIpcPack(request) {
    var parsed_url = url.parse(request.url),
        user_agent = request.headers['user-agent'];
    return {
        api_method: parsed_url.pathname,
        api_type: request.method.toLowerCase(),
        token: request.headers['token'],
        x_token: request.headers['x-token'],
        query_params: querystring.parse(parsed_url.query),
        meta: {
            ip_address: request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress,
            vendor: ua_parser.parseDevice(user_agent).family,
            os: ua_parser.parseOS(user_agent).family.toLowerCase(),
            browser: ua_parser.parseUA(user_agent).toString()
        }
    };
}

function run_server(host, port, bck_host, bck_port, heartbeat) {  // якобы общепринятое правило прятать всё в функцию
    var backend_client = new zerorpc.Client(heartbeat == undefined? {}: {heartbeatInterval: heartbeat}),
        IPC_pack;

    backend_client.connect("tcp://"+bck_host+":"+bck_port);
    var server = http.createServer(function(request, response) {

        if (["post", "put"].indexOf(request.method.toLowerCase())>-1) {
            var form = new formidable.IncomingForm();
            IPC_pack = makeIpcPack(request);
            form.maxFieldsSize = 1024;  // TODO: не заваливается, если любое поле содержит больше данных
            form.maxFields = 6;
            form.parse(request, function(error, fields, files) {
                for (var field in fields) {  // заполняем IPC_pack параметрами из методов POST/PUT
                        if (!IPC_pack["query_params"].hasOwnProperty(field)) {
                            IPC_pack["query_params"][field] = fields[field];
                        }
                }
                backend_client.invoke("route", IPC_pack, function(error, res, more) {
                    if (error) {
                        console.log(error);
                        response.writeHead(404, {"Content-Type": "text/plain"});
                        response.end('Not found');
                    }
                    if (!res && res != []) {
                        response.writeHead(404, {"Content-Type": "text/plain"});
                        response.end('Not found');
                    }
                    else if (res.hasOwnProperty('exception')) {
                        var code = parseInt(res.exception.code);
                        response.writeHead(code, {"Content-Type": "text/plain"});
                        response.end(res.exception.message);
                    }
                    else {
                        response.writeHead(200, {"Content-Type": "application/json"});
                        response.end(JSON.stringify(res));
                    }
                });
            });
            form.on('error', function(error) {
                response.end(error.message);
            });
        }

        else {
            IPC_pack = makeIpcPack(request);
            backend_client.invoke("route", IPC_pack, function(error, res, more) {
                if (error) {
                    console.log(error);
                    response.writeHead(404, {"Content-Type": "text/plain"});
                    response.end('Not found');
                }
                if (!res && res != []) {
                    response.writeHead(404, {"Content-Type": "text/plain"});
                    response.end('Not found');
                }
                else if (res.hasOwnProperty('exception')) {
                    var code = parseInt(res.exception.code);
                    response.writeHead(code, {"Content-Type": "text/plain"});
                    response.end(res.exception.message);
                }
                else {
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.end(JSON.stringify(res));
                }
            });
        }
    });
    server.listen(port, host, function() {
       console.log("rest server runnig on "+host+":"+port);
    });

    var ws_server = new ws.Server({server: server});
    ws_server.on('connection', function(socket){
        socket.on("message", function(message){
            IPC_pack = JSON.parse(message);
            backend_client.invoke("route", IPC_pack, function(error, res, more) {
                if (!res) {
                    socket.send('Undefined response');
                }
                else if (res.hasOwnProperty('error')) {
                    socket.send(JSON.stringify({'error': res.error.code}));
                }
                else {
                    socket.send(JSON.stringify(res));
                }
            });
        });
    });
    ws_server.on('error', function(error) {
       console.error(error)
    });
}

var host = config.app_host,
    port = config.app_port,
    bck_host = config.backend_host,
    bck_port = config.backend_port,
    heartbeat = config.heartbeat;

if (config.debug) {
    run_server(host, port, bck_host, bck_port, heartbeat);
}
else {
    run_server(host, port, bck_host, bck_port);
}