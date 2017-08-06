import cookie from './cookie.client';
import Controller from './controller';

export default class Application {
  navigate(url, push = true) {
    const controller = new Controller({
      query: query.parse(search),
      params: params,
      cookie: cookie
    })
  }
}
