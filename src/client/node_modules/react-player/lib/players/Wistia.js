'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _loadScript = require('load-script');

var _loadScript2 = _interopRequireDefault(_loadScript);

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SDK_URL = '//fast.wistia.com/assets/external/E-v1.js';
var SDK_GLOBAL = 'Wistia';
var MATCH_URL = /^https?:\/\/(.+)?(wistia.com|wi.st)\/(medias|embed)\/(.*)$/;

var Wistia = function (_Base) {
  _inherits(Wistia, _Base);

  function Wistia() {
    _classCallCheck(this, Wistia);

    return _possibleConstructorReturn(this, (Wistia.__proto__ || Object.getPrototypeOf(Wistia)).apply(this, arguments));
  }

  _createClass(Wistia, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          onStart = _props.onStart,
          onPause = _props.onPause,
          onEnded = _props.onEnded,
          wistiaConfig = _props.wistiaConfig;

      this.loadingSDK = true;
      this.getSDK().then(function () {
        window._wq = window._wq || [];
        window._wq.push({
          id: _this2.getID(_this2.props.url),
          options: wistiaConfig.options,
          onReady: function onReady(player) {
            _this2.player = player;
            _this2.player.bind('start', onStart);
            _this2.player.bind('play', _this2.onPlay);
            _this2.player.bind('pause', onPause);
            _this2.player.bind('end', onEnded);
            _this2.onReady();
          }
        });
      });
    }
  }, {
    key: 'getSDK',
    value: function getSDK() {
      return new Promise(function (resolve, reject) {
        if (window[SDK_GLOBAL]) {
          resolve();
        } else {
          (0, _loadScript2['default'])(SDK_URL, function (err, script) {
            if (err) reject(err);
            resolve(script);
          });
        }
      });
    }
  }, {
    key: 'getID',
    value: function getID(url) {
      return url && url.match(MATCH_URL)[4];
    }
  }, {
    key: 'load',
    value: function load(url) {
      var id = this.getID(url);
      if (this.isReady) {
        this.player.replaceWith(id);
        this.props.onReady();
        this.onReady();
      }
    }
  }, {
    key: 'play',
    value: function play() {
      if (!this.isReady || !this.player) return;
      this.player.play();
    }
  }, {
    key: 'pause',
    value: function pause() {
      if (!this.isReady || !this.player) return;
      this.player && this.player.pause();
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (!this.isReady || !this.player) return;
      this.player.pause();
    }
  }, {
    key: 'seekTo',
    value: function seekTo(amount) {
      var seconds = _get(Wistia.prototype.__proto__ || Object.getPrototypeOf(Wistia.prototype), 'seekTo', this).call(this, amount);
      if (!this.isReady || !this.player) return;
      this.player.time(seconds);
    }
  }, {
    key: 'setVolume',
    value: function setVolume(fraction) {
      if (!this.isReady || !this.player || !this.player.volume) return;
      this.player.volume(fraction);
    }
  }, {
    key: 'setPlaybackRate',
    value: function setPlaybackRate(rate) {
      if (!this.isReady || !this.player || !this.player.playbackRate) return;
      this.player.playbackRate(rate);
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      if (!this.isReady || !this.player || !this.player.duration) return;
      return this.player.duration();
    }
  }, {
    key: 'getFractionPlayed',
    value: function getFractionPlayed() {
      if (!this.isReady || !this.player || !this.player.percentWatched) return null;
      return this.player.time() / this.player.duration();
    }
  }, {
    key: 'getFractionLoaded',
    value: function getFractionLoaded() {
      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      var id = this.getID(this.props.url);
      var className = 'wistia_embed wistia_async_' + id;
      var style = {
        width: '100%',
        height: '100%',
        display: this.props.url ? 'block' : 'none'
      };
      return _react2['default'].createElement('div', { className: className, style: style });
    }
  }], [{
    key: 'canPlay',
    value: function canPlay(url) {
      return MATCH_URL.test(url);
    }
  }]);

  return Wistia;
}(_Base3['default']);

Wistia.displayName = 'Wistia';
exports['default'] = Wistia;