
var _ = require('lodash');

var surgeries = {
  'upper lip injections': (skill) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        upper_lip_center: 0.1 + _.random(0, 0.05 * jitter, true),
      }
    };
  },
  'lower lip injections': (skill) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        lower_lip_center: 0.1 + _.random(0, 0.05 * jitter, true),
      }
    };
  },
  'cheek injections': (skill) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        upper_cheek_left: 0.1 + _.random(0, 0.05 * jitter, true),
        upper_cheek_right: 0.1 + _.random(0, 0.05 * jitter, true),
        under_eyes: _.random(0, 0.05 * jitter, true),
      }
    };
  },

};

module.exports = {
  surgeries,
};

