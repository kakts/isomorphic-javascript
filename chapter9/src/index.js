import Hapi from 'hapi';
import Application from './lib';
import Controller from './lib/controller';
import HelloController from './hello-controller';
import nunjucks from 'nunjucks';

const APP_FILE_PATH = '/application.js';
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});



// 描画やレスポンスの実装に関する詳細がアプリから取り除かれたため、
// コードがはるかに読みやすくなった
const application = new Application({
  '/': Controller,
  '/hello/{name*}': HelloController
}, {
  server: server,
  document: function(application, controller, request, reply, body, callback) {
    nunjucks.render('./index.html', {
      body: body,
      application: APP_FILE_PATH

    }, (err, html) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, html);
    });

    server.route({
      method: 'GET',
      path: APP_FILE_PATH,
      handler: (request, reply) => {
        console.error('reply', reply)
        //reply.file('dist/build/application.js');
      }
    })
  }
});


application.start();
