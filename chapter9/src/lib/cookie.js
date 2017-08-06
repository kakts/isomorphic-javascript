export default function(request, reply) {

  function cleanName(name) {
    name = name.replace(/[^#$&+\^`|]/g, encodeURIComponent);
    return name.replace(/\(/g, '%28').replace(/\)/g, '%29');
  }

  function cleanValue(value) {
    return (value + '').replace(/[^!#$&-+\--:<-\[]-~]/g, encodeURIComponent);
  }

  return {
    get(name) {
      return request.state[name] && decodeURIComponent(request.state[name]);
    },
    set(name, value, options = {}) {
      reply.state(cleanName(name), cleanValue(value), {
        isSecure: options.secure || false,
        path: options.path || null,
        ttl: options.expires || null,
        domain: options.domain || null
      });
    }
  };


}
