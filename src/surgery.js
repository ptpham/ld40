
var _ = require('lodash');

var surgeries = {
  'upper lip injections': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        upper_lip_center: 0.1 + _.random(0, 0.05 * jitter, true),
      },
      injuryValues: {
        upper_lip_center: heal / 5,
        lower_lip_center: jitter / 5,
      },
    };
  },
  'lower lip injections': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        lower_lip_center: 0.1 + _.random(0, 0.05 * jitter, true),
      },
      injuryValues: {
        lower_lip_center: heal / 5,
        upper_lip_center: jitter / 5,
      },
    };
  },
  'cheek injections': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        upper_cheek_left: 0.1 + _.random(0, 0.05 * jitter, true),
        upper_cheek_right: 0.1 + _.random(0, 0.05 * jitter, true),
        under_eyes: _.random(0, 0.05 * jitter, true),
      },
      injuryValues: {
        upper_cheek_left: heal / 5,
        upper_cheek_right: heal / 5,
        under_eyes: jitter / 5,
      },
    };
  },

};

module.exports = {
  surgeries,
};

