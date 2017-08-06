'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (request, reply) {

  function cleanName(name) {
    name = name.replace(/[^#$&+\^`|]/g, encodeURIComponent);
    return name.replace(/\(/g, '%28').replace(/\)/g, '%29');
  }

  function cleanValue(value) {
    return (value + '').replace(/[^!#$&-+\--:<-\[]-~]/g, encodeURIComponent);
  }

  return {
    get: function get(name) {
      return request.state[name] && decodeURIComponent(request.state[name]);
    },
    set: function set(name, value) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      reply.state(cleanName(name), cleanValue(value), {
        isSecure: options.secure || false,
        path: options.path || null,
        ttl: options.expires || null,
        domain: options.domain || null
      });
    }
  };
};