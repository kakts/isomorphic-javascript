"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cookie = function () {
  _createClass(Cookie, [{
    key: "set",
    value: function set(name, value) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    }
  }, {
    key: "get",
    value: function get(name) {}
  }]);

  function Cookie(context) {
    _classCallCheck(this, Cookie);

    this.context = context;
  }

  return Cookie;
}();