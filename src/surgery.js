
var _ = require('lodash');
var Renderer = require('./render');

var NSHIFT = Renderer.NSHIFT;

var surgeries = {
  'upper lip injections': (skill) => {
    var jitter = _.random(0, 2 - skill);
    return [
      {
        type: NSHIFT, key: 'upper_lip_center',
        value: 0.1 + _.random(0, 0.05 * jitter, true)
      }
    ];
  },
  'lower lip injections': (skill) => {
    var jitter = _.random(0, 2 - skill);
    return [
      {
        type: NSHIFT, key: 'lower_lip_center',
        value: 0.1 + _.random(0, 0.05 * jitter, true)
      }
    ];
  },
  'cheek injections': (skill) => {
    var jitter = _.random(0, 2 - skill);
    return [
      {
        type: NSHIFT, key: 'upper_cheek_left',
        value: 0.1 + _.random(0, 0.05 * jitter, true)
      },
      {
        type: NSHIFT, key: 'upper_cheek_right',
        value: 0.1 + _.random(0, 0.05 * jitter, true)
      },
      {
        type: NSHIFT, key: 'under_eyes',
        value: _.random(0, 0.05 * jitter, true)
      }
    ];
  },
};

module.exports = {
  surgeries,
};

