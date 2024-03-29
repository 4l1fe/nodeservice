var http = require("http"),
    url = require("url"),
    querystring = require("querystring"),
    zerorpc = require("zerorpc"),
    formidable = require("formidable"),
    config = require("./config"),
    ws = require('ws'),
    ua_parser = require('ua-parser'),
    fs = require('fs'),
    path = require('path');


function make_ipc_pack(request) {
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


function move_to_extras_dir(upload_dir, extras_id, file_path) {
    var extras_dir, source, dest;

    extras_dir = path.join(upload_dir, extras_id);
    fs.mkdir(extras_dir, function(error) {});
    source = fs.createReadStream(file_path);
    dest = fs.createWriteStream(path.join(extras_dir, path.basename(file_path)));
    source.pipe(dest);
    source.on('end', function() {});
    source.on('error', function(error) {console.log(error)});
    dest.on('error', function(error) {console.log(error)});
}


function run_server(host, port, bck_host, bck_port, upload_dir, heartbeat) {  // якобы общепринятое правило прятать всё в функцию
    var backend_client = new zerorpc.Client(heartbeat == undefined? {}: {heartbeatInterval: heartbeat}),
        IPC_pack, file_path;

    fs.mkdir(upload_dir, function(error) {});
    backend_client.connect("tcp://"+bck_host+":"+bck_port);
    var http_server = http.createServer();

    http_server.on('connection', function(socket) {
        socket.setNoDelay();  // облегчение протокола tcp
    });
    http_server.on('request', function(request, response) {
        var method_type = request.method.toLowerCase();

        function route_cbk(error, res, more) { // объекты request/response должны быть в области видимости
            if (error) {
                console.log(error);
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.end('Not Found');
            }
            else if (!res) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.end('Not Found');
            }
            else if (res['exception']) {
                var code = parseInt(res['exception']['code']);
                response.writeHead(code, {"Content-Type": "text/plain"});
                response.end(res['exception']['message']);
            }
            else if (res['social']) {
                response.writeHead(302, {"Location": res['redirect_url']});
                response.end();
            }
            else if (res['social_token']) {
                response.writeHead(302, {"Location": "/", "Set-Cookie": "token=" + res['token'] + "; path=/"});
                response.end();
            }
            else if (res['isavatar']) {
                move_to_extras_dir(upload_dir, res['id'].toString(), file_path);
                response.writeHead(200, {"Content-Type": "application/json"});
                response.end(JSON.stringify(res['id']));
            }
            else {
                response.writeHead(200, {"Content-Type": "application/json"});
                response.end(JSON.stringify(res));
            }
        }

        if (["post", "put"].indexOf(method_type)>-1) {
            var form = new formidable.IncomingForm();
            IPC_pack = make_ipc_pack(request);

            form.on('field', function(name, value) {
                if (!IPC_pack["query_params"][name]) {
                    IPC_pack["query_params"][name] = value;
                }
            });
            form.on('fileBegin', function(name, file) { // для сохранения имени файла, вместо случайного хэша
                /*Сначала файл кидается на диск в папку по токену,
                потом переносим файл из папки токена в папку по идентификатору extras(в момент ответа клиенту).
                Но тут содержится много проблем:
                -сохранение файла при каждом запросе без ограничений
                -задержка сохранение на диск файла(накопление в буфер)
                -предотвращение сохранения больших файлов
                -обрывание получение файла, если он большой
                */

                if (IPC_pack['token']) {
                    var tokenized_dir = path.join(upload_dir, IPC_pack['token']);
                    fs.mkdir(tokenized_dir, function(error) {});         // TODO: иногда валилось непонятно почему,
                    file['path'] = file_path = path.join(tokenized_dir, file['name']);  // не успевало создать папку перед сохранением файла?
                    IPC_pack['query_params']['filename'] = file['name']; // атрибут нужен в api методе сохранения аватарки
                }
            });
            form.on('end', function() {
                backend_client.invoke("route", IPC_pack, route_cbk);
            });
            form.on('error', function(error) {
                console.log(error);           // надо рушить соединение
                response.end(error.message); // TODO:you will have to manually call request.resume()
            });                             // if you want the request to continue firing 'data' events.
            form.parse(request);
        }

        else {
            IPC_pack = make_ipc_pack(request);
            backend_client.invoke("route", IPC_pack, route_cbk)
        }
    });
    http_server.listen(port, host, function() {
       console.log("rest server runnig on "+host+":"+port+" with backend on "+bck_host+":"+bck_port);
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