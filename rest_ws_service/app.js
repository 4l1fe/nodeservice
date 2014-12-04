var http = require("http"),
    url = require("url"),
    querystring = require("querystring"),
    zerorpc = require("zerorpc"),
    formidable = require("formidable"),
    multiparty = require("multiparty"),
    config = require("./config"),
    ws = require('ws'),
    ua_parser = require('ua-parser'),
    fs = require('fs'),
    path = require('path');


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


function run_server(host, port, bck_host, bck_port, upload_dir, heartbeat) {  // якобы общепринятое правило прятать всё в функцию
    var backend_client = new zerorpc.Client(heartbeat == undefined? {}: {heartbeatInterval: heartbeat}),
        IPC_pack;

    fs.mkdir(upload_dir, function(error) {});
    backend_client.connect("tcp://"+bck_host+":"+bck_port);
    var http_server = http.createServer(function(request, response) {

        function route_cbk(error, res, more) { // объекты request/response должны быть в области видимости
            if (error) {
                console.log(error);
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.end('Not Found');
            }
            if (!res) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.end('Not Found');
            }
            else if (res.hasOwnProperty('exception')) {
                var code = parseInt(res.exception.code);
                response.writeHead(code, {"Content-Type": "text/plain"});
                response.end(res.exception.message);
            }
            else if (res.hasOwnProperty('social')) {
                response.writeHead(302, {"Location": res['redirect_url']});
                response.end();
            }
            else if (res.hasOwnProperty('social_token')) {
                response.writeHead(302, {"Location": "/", "Set-Cookie": "token="+res['token']+"; path=/"});
                response.end();
            }
            else {
                response.writeHead(200, {"Content-Type": "application/json"});
                response.end(JSON.stringify(res));
            }
        }

        if (["post", "put"].indexOf(request.method.toLowerCase())>-1) {
            var form = new formidable.IncomingForm();
                max_file_size = 100 * 1024 * 1024;
            form.uploadDir = upload_dir;
            IPC_pack = makeIpcPack(request);

            form.on('field', function(name, value) {
                if (!IPC_pack["query_params"].hasOwnProperty(name)) {
                            IPC_pack["query_params"][name] = value;
                };
            });
            form.on('fileBegin', function(name, file) { //для сохранения имени файла, вместо случайного хэша
                console.log(IPC_pack);
                if (IPC_pack.token) {
                    var tokenized_dir = path.join(upload_dir, IPC_pack.token);
                    fs.mkdir(tokenized_dir, function(error) {})                 //TODO: иногда валилось непонятно почему,
                    IPC_pack.query_params.filename = IPC_pack.token+'/'+file.name;  //не успевало создать папку перед сохранением файла?
                    file.path = path.join(tokenized_dir, file.name);
                }
            });
            form.on('end', function() {
                backend_client.invoke("route", IPC_pack, route_cbk);
            });
            form.on('error', function(error) {
                console.log(error);           // надо рушить соединение
                response.end(error.message); //TODO:you will have to manually call request.resume()
            });                             // if you want the request to continue firing 'data' events.
            form.parse(request);
        }

        else {
            IPC_pack = makeIpcPack(request);
            backend_client.invoke("route", IPC_pack, route_cbk)
        }
    });
    http_server.listen(port, host, function() {
       console.log("rest server runnig on "+host+":"+port);
    });

    var ws_server = new ws.Server({server: http_server});
    ws_server.on('connection', function(socket){
        socket.on("message", function(message){
            IPC_pack = JSON.parse(message);
            backend_client.invoke("route", IPC_pack, function(error, res, more) {
                if (error) {
                    console.log(error);
                    socket.send(error.message);
                }
                else if (!res) {
                    socket.send('Undefined response');
                }
                else if (res.hasOwnProperty('exception')) {
                    socket.send(JSON.stringify({'code': res.exception.code,
                                                'message': res.exception.message}));
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
    upload_dir = config.upload_dir;

if (config.debug) {
    run_server(host, port, bck_host, bck_port, upload_dir, heartbeat);
}
else {
    run_server(host, port, bck_host, bck_port, upload_dir);
}