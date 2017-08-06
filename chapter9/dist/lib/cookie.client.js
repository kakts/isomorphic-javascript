'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cookiesJs = require('cookies-js');

var _cookiesJs2 = _interopRequireDefault(_cookiesJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  get: function get(name) {
    return _cookiesJs2.default.get(name);
  },
  set: function set(name, value) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (options.expires) {
      options.expires /= 1000;
    }

    _cookiesJs2.default.set(name, value, options);
  }
};