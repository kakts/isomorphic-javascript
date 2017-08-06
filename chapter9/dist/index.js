'use strict';

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _lib = require('./lib');

var _lib2 = _interopRequireDefault(_lib);

var _controller = require('./lib/controller');

var _controller2 = _interopRequireDefault(_controller);

var _helloController = require('./hello-controller');

var _helloController2 = _interopRequireDefault(_helloController);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var APP_FILE_PATH = '/application.js';
var server = new _hapi2.default.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

// 描画やレスポンスの実装に関する詳細がアプリから取り除かれたため、
// コードがはるかに読みやすくなった
var application = new _lib2.default({
  '/': _controller2.default,
  '/hello/{name*}': _helloController2.default
}, {
  server: server,
  document: function document(application, controller, request, reply, body, callback) {
    _nunjucks2.default.render('./index.html', {
      body: body,
      application: APP_FILE_PATH

    }, function (err, html) {
      if (err) {
        return callback(err, null);
      }
      callback(null, html);
    });

    server.route({
      method: 'GET',
      path: APP_FILE_PATH,
      handler: function handler(request, reply) {
        console.error('reply', reply);
        //reply.file('dist/build/application.js');
      }
    });
  }
});

application.start();