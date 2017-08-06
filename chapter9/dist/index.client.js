'use strict';

var _lib = require('./lib');

var _lib2 = _interopRequireDefault(_lib);

var _helloController = require('./hello-controller');

var _helloController2 = _interopRequireDefault(_helloController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('hello browser');

var application = new _lib2.default({
  '/hello/{name}': _helloController2.default
}, {

  target: 'body'
});

application.start();