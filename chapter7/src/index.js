import Hapi from 'hapi';
import Application from './lib';
import Controller from './lib/controller';

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

// 描画やレスポンスの実装に関する詳細がアプリから取り除かれたため、
// コードがはるかに読みやすくなった
const application = new Application({
  '/': Controller
}, {
  server: server
})


server.start();
