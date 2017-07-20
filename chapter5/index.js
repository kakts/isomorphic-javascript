const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

// Add routing
server.route({
  method: 'GET',
  path: '/hello',
  handler: function(request, reply) {
    console.log('[/hello] requested');
    reply('hello world');
  }
});

server.start();
