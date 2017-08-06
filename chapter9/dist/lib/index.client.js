'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cookie = require('./cookie.client');

var _cookie2 = _interopRequireDefault(_cookie);

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _reply = require('./reply.client');

var _reply2 = _interopRequireDefault(_reply);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Application = function () {
  function Application() {
    _classCallCheck(this, Application);
  }

  _createClass(Application, [{
    key: 'navigate',
    value: function navigate(url) {
      var push = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var controller = new _controller2.default({
        query: query.parse(search),
        params: params,
        cookie: _cookie2.default
      });

      var request = function request() {};
      var reply = (0, _reply2.default)(this);
    }
  }]);

  return Application;
}();

exports.default = Application;