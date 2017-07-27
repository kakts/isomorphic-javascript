'use strict';

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _lib = require('./lib');

var _lib2 = _interopRequireDefault(_lib);

var _controller = require('./lib/controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = new _hapi2.default.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

// 描画やレスポンスの実装に関する詳細がアプリから取り除かれたため、
// コードがはるかに読みやすくなった
var application = new _lib2.default({
  '/': _controller2.default
}, {
  server: server
});

server.start();