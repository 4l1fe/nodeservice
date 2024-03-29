// Generated by CoffeeScript 1.8.0
(function() {
  var argparse, fs, path, yaml;

  path = require('path');

  fs = require("fs");

  yaml = require("js-yaml");

  argparse = require("argparse");

  this.path = __dirname;

  this.upload_dir = path.join(this.path, 'upload');

  this.debug = true;

  this.heartbeat = 100000;

  this.parser = new argparse.ArgumentParser({
    addHelp: false
  });

  this.parser.addArgument(['-h', '--host'], {
    dest: 'host'
  });

  this.parser.addArgument(['-p', '--port'], {
    dest: 'port'
  });

  this.parser.addArgument(['-bh', '--backend_host'], {
    dest: 'backend_host'
  });

  this.parser.addArgument(['-bp', '--backend_port'], {
    dest: 'backend_port'
  });

  this.namespace = this.parser.parseArgs();

  this.server = yaml.safeLoad(fs.readFileSync(path.join(this.path, '..', 'configs', 'node_service.yaml'), 'utf8'));

  this.app_host = this.namespace['host'] ? this.namespace['host'] : this.server['rest_ws_serv']['host'];

  this.app_port = this.namespace['port'] ? this.namespace['port'] : this.server['rest_ws_serv']['port'];

  this.backend_host = this.namespace['backend_host'] ? this.namespace['backend_host'] : this.server['rest_ws_serv']['backend']['host'];

  this.backend_port = this.namespace['backend_port'] ? this.namespace['backend_port'] : this.server['rest_ws_serv']['backend']['port'];

}).call(this);

//# sourceMappingURL=config.js.map
