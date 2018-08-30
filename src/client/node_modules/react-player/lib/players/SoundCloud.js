'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fetchJsonp = require('fetch-jsonp');

var _fetchJsonp2 = _interopRequireDefault(_fetchJsonp);

var _FilePlayer2 = require('./FilePlayer');

var _FilePlayer3 = _interopRequireDefault(_FilePlayer2);

var _props3 = require('../props');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RESOLVE_URL = '//api.soundcloud.com/resolve.json';
var MATCH_URL = /^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-_]+\/[a-z0-9-_]+)$/;

var songData = {}; // Cache song data requests

var SoundCloud = function (_FilePlayer) {
  _inherits(SoundCloud, _FilePlayer);

  function SoundCloud() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SoundCloud);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SoundCloud.__proto__ || Object.getPrototypeOf(SoundCloud)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      image: null
    }, _this.clientId = _this.props.soundcloudConfig.clientId || _props3.defaultProps.soundcloudConfig.clientId, _this.ref = function (player) {
      _this.player = player;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SoundCloud, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return _get(SoundCloud.prototype.__proto__ || Object.getPrototypeOf(SoundCloud.prototype), 'shouldComponentUpdate', this).call(this, nextProps, nextState) || this.state.image !== nextState.image;
    }
  }, {
    key: 'getSongData',
    value: function getSongData(url) {
      var _this2 = this;

      if (songData[url]) {
        return Promise.resolve(songData[url]);
      }
      return (0, _fetchJsonp2['default'])(RESOLVE_URL + '?url=' + url + '&client_id=' + this.clientId).then(function (response) {
        if (response.ok) {
          songData[url] = response.json();
          return songData[url];
        } else {
          _this2.props.onError(new Error('SoundCloud track could not be resolved'));
        }
      });
    }
  }, {
    key: 'load',
    value: function load(url) {
      var _this3 = this;

      var _props = this.props,
          soundcloudConfig = _props.soundcloudConfig,
          onError = _props.onError;

      this.stop();
      this.getSongData(url).then(function (data) {
        if (!_this3.mounted) return;
        if (!data.streamable) {
          onError(new Error('SoundCloud track is not streamable'));
          return;
        }
        var image = data.artwork_url || data.user.avatar_url;
        if (image && soundcloudConfig.showArtwork) {
          _this3.setState({ image: image.replace('-large', '-t500x500') });
        }
        _this3.player.src = data.stream_url + '?client_id=' + _this3.clientId;
      }, onError);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          url = _props2.url,
          loop = _props2.loop,
          controls = _props2.controls;

      var style = {
        display: url ? 'block' : 'none',
        height: '100%',
        backgroundImage: this.state.image ? 'url(' + this.state.image + ')' : null,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
      return _react2['default'].createElement(
        'div',
        { style: style },
        _react2['default'].createElement('audio', {
          ref: this.ref,
          type: 'audio/mpeg',
          preload: 'auto',
          style: {
            width: '100%',
            height: '100%'
          },
          controls: controls,
          loop: loop
        })
      );
    }
  }], [{
    key: 'canPlay',
    value: function canPlay(url) {
      return MATCH_URL.test(url);
    }
  }]);

  return SoundCloud;
}(_FilePlayer3['default']);

SoundCloud.displayName = 'SoundCloud';
exports['default'] = SoundCloud;