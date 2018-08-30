'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultProps = exports.propTypes = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var string = _propTypes2['default'].string,
    bool = _propTypes2['default'].bool,
    number = _propTypes2['default'].number,
    array = _propTypes2['default'].array,
    oneOfType = _propTypes2['default'].oneOfType,
    shape = _propTypes2['default'].shape,
    object = _propTypes2['default'].object,
    func = _propTypes2['default'].func;
var propTypes = exports.propTypes = {
  url: oneOfType([string, array]),
  playing: bool,
  loop: bool,
  controls: bool,
  volume: number,
  playbackRate: number,
  width: oneOfType([string, number]),
  height: oneOfType([string, number]),
  style: object,
  progressFrequency: number,
  playsinline: bool,
  soundcloudConfig: shape({
    clientId: string,
    showArtwork: bool
  }),
  youtubeConfig: shape({
    playerVars: object,
    preload: bool
  }),
  facebookConfig: shape({
    appId: string
  }),
  dailymotionConfig: shape({
    params: object,
    preload: bool
  }),
  vimeoConfig: shape({
    iframeParams: object,
    preload: bool
  }),
  vidmeConfig: shape({
    format: string
  }),
  fileConfig: shape({
    attributes: object,
    tracks: array,
    forceAudio: bool,
    forceHLS: bool,
    forceDASH: bool
  }),
  wistiaConfig: shape({
    options: object
  }),
  onReady: func,
  onStart: func,
  onPlay: func,
  onPause: func,
  onBuffer: func,
  onEnded: func,
  onError: func,
  onDuration: func,
  onProgress: func
};

var defaultProps = exports.defaultProps = {
  playing: false,
  loop: false,
  controls: false,
  volume: 0.8,
  playbackRate: 1,
  width: 640,
  height: 360,
  hidden: false,
  progressFrequency: 1000,
  playsinline: false,
  soundcloudConfig: {
    clientId: 'e8b6f84fbcad14c301ca1355cae1dea2',
    showArtwork: true
  },
  youtubeConfig: {
    playerVars: {},
    preload: false
  },
  facebookConfig: {
    appId: '1309697205772819'
  },
  dailymotionConfig: {
    params: {},
    preload: false
  },
  vimeoConfig: {
    iframeParams: {},
    preload: false
  },
  vidmeConfig: {
    format: null
  },
  fileConfig: {
    attributes: {},
    tracks: [],
    forceAudio: false,
    forceHLS: false,
    forceDASH: false
  },
  wistiaConfig: {
    options: {}
  },
  onReady: function onReady() {},
  onStart: function onStart() {},
  onPlay: function onPlay() {},
  onPause: function onPause() {},
  onBuffer: function onBuffer() {},
  onEnded: function onEnded() {},
  onError: function onError() {},
  onDuration: function onDuration() {},
  onProgress: function onProgress() {}
};