'use strict';

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = new _hapi2.default.Server();
server.connection({
  host: 'localhost',
  port: 8000
});
///.
// Add routing
server.route({
  method: 'GET',
  path: '/hello',
  handler: function handler(request, reply) {
    console.log('[/hello] requested');
    reply('hello worldddd');
  }
});

server.start();