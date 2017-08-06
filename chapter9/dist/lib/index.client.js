'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Application = function () {
  function Application() {
    _classCallCheck(this, Application);
  }

  _createClass(Application, [{
    key: 'navigate',
    value: function navigate(url) {
      var push = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      console.log(url);

      // history apiに対応していないブラウザではlocationにurlをセットして終了
      if (!history.pushState) {
        window.location = url;
        return;
      }

      console.log(url);

      // push引数がtrueの場合のみ 履歴のスタックにプッシュ
      if (push) {
        history.pushStae({}, null, url);
      }
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      this.popStateListener = window.addEventListener('popstate', function (e) {
        var _window$location = window.location,
            pathname = _window$location.pathname,
            search = _window$location.search;

        var url = '' + pathname + search;
        _this.navigate(url, false);
      });

      // クリックのイベントハンドラ作成
      this.clickListener = document.addeventListener('click', function (e) {
        var target = e.target;

        var identifier = target.dataset.navigate;
        var href = target.getAttribute('href');

        if (identifier !== undefined) {
          if (href) {
            e.preventDefault();
          }

          _this.navigate(identifier || href);
        }
      });
    }
  }]);

  return Application;
}();

exports.default = Application;