import cookie from './cookie.client';
import Controller from './controller';
import replyFactory from './reply.client';

export default class Application {
  navigate(url, push = true) {
    const controller = new Controller({
      query: query.parse(search),
      params: params,
      cookie: cookie
    });

    const request = () => {};
    const reply = replyFactory(this);
  }
}
