import cookie from 'cookies-js';

export default {
  get(name) {
    return cookie.get(name)
  },
  set(name, value, options = {}) {
    if (options.expires) {
      options.expires /= 1000;
    }

    cookie.set(name, value, options);
  }
}
