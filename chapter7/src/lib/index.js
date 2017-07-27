// webサーバで使う基本的なファサードを定義する
export default class Application {
  constructor(routes, options) {
    // serverインスタンスを設定する
    // 呼び出し側で自由にモジュールを切り替える
    this.server = options.server;
    this.registerRoutes(routes);
  }

  registerRoutes(routes) {
    for (let path in routes) {
      this.addRoute(path, routes[path]);
    }
  }

  addRoute(path, Controller) {
    this.server.route({
      path: path,
      method: 'GET',
      handler: (request, reply) => {
        const controller = new Controller({
          query: request.query,
          params: request.params
        });

        controller.index(this, request, reply, (err) => {
          if (err) {
            return reply(err);
          }

          controller.toString((err, html) => {
            if (err) {
              return reply(err);
            }

            reply(html);
          });
        });
      }
    });
  }

  start() {
    this.server.start();
  }
}
