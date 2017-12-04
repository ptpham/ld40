
var _ = require('lodash');
var Money = require('./money');
var Data = require('./data');

var { HEAL_PER_TURN } = Data;

var surgeries = {
  'upper lip injection': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        upper_lip_center: 0.1 + _.random(0, 0.05 * jitter, true),
      },
      injuryValues: {
        upper_lip_center: heal * HEAL_PER_TURN, 
        lower_lip_center: jitter * HEAL_PER_TURN,
      },
    };
  },
  'upper lip reductions': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        upper_lip_center: -0.1 + _.random(0, 0.05 * jitter, true),
      },
      injuryValues: {
        upper_lip_center: heal * HEAL_PER_TURN, 
        lower_lip_center: jitter * HEAL_PER_TURN,
      },
    };
  },
  'lower lip injection': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        lower_lip_center: 0.1 + _.random(0, 0.05 * jitter, true),
      },
      injuryValues: {
        lower_lip_center: heal * HEAL_PER_TURN, 
        upper_lip_center: jitter * HEAL_PER_TURN,
      },
    };
  },
  'lower lip reduction': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        lower_lip_center: -0.1 + _.random(0, 0.05 * jitter, true),
      },
      injuryValues: {
        lower_lip_center: heal * HEAL_PER_TURN, 
        upper_lip_center: jitter * HEAL_PER_TURN,
      },
    };
  },
  'cheek lift': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        upper_cheek_left: 0.1 + _.random(0, 0.05 * jitter, true),
        upper_cheek_right: 0.1 + _.random(0, 0.05 * jitter, true),
        under_eyes: _.random(0, 0.05 * jitter, true),
      },
      injuryValues: {
        upper_cheek_left: heal * HEAL_PER_TURN,
        upper_cheek_right: heal * HEAL_PER_TURN,
        under_eyes: jitter * HEAL_PER_TURN,
      },
    };
  },
  'cheek injection': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        upper_cheek_left: 0.1 + _.random(0, 0.05 * jitter, true),
        upper_cheek_right: 0.1 + _.random(0, 0.05 * jitter, true),
        lower_cheek_left: 0.1 + _.random(0, 0.05 * jitter, true),
        lower_cheek_right: 0.1 + _.random(0, 0.05 * jitter, true),
        under_eyes: _.random(0, 0.05 * jitter, true),
      },
      injuryValues: {
        upper_cheek_left: heal * HEAL_PER_TURN,
        upper_cheek_right: heal * HEAL_PER_TURN,
        lower_cheek_left: heal * HEAL_PER_TURN,
        lower_cheek_right: heal * HEAL_PER_TURN,
        under_eyes: jitter * HEAL_PER_TURN,
      },
    };
  },
  'nose bridge injection': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        nose_bridge: 0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        nose_bridge: heal * HEAL_PER_TURN,
        nose_tip: jitter * HEAL_PER_TURN,
      },
    };
  },
  'nose bridge reduction': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        nose_bridge: -0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        nose_bridge: heal * HEAL_PER_TURN,
        nose_tip: jitter * HEAL_PER_TURN,
      },
    };
  },
  'nose tip injection': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        nose_tip: 0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        nose_tip: heal * HEAL_PER_TURN,
        nose_bridge: jitter * HEAL_PER_TURN,
        nose_nostrils: jitter * HEAL_PER_TURN,
      },
    };
  },
  'nose tip reduction': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        nose_tip: -0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        nose_tip: heal * HEAL_PER_TURN,
        nose_bridge: jitter * HEAL_PER_TURN,
        nose_nostrils: jitter * HEAL_PER_TURN,
      },
    };
  },
  'nostril enlargement': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        nose_nostrils: 0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        nose_nostrils: heal * HEAL_PER_TURN,
        nose_tip: jitter * HEAL_PER_TURN,
      },
    };
  },
  'nostril reduction': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        nose_nostrils: -0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        nose_nostrils: heal * HEAL_PER_TURN,
        nose_tip: jitter * HEAL_PER_TURN,
      },
    };
  },
  'brow injection': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        brow_left: 0.1 + _.random(0, 0.05 * jitter, true),
        brow_right: 0.1 + _.random(0, 0.05 * jitter, true),
      },
      injuryValues: {
        brow_left: heal * HEAL_PER_TURN,
        brow_right: heal * HEAL_PER_TURN,
      },
    };
  },
  'brow reduction': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    return {
      normalShifts: {
        brow_left: -0.1 + _.random(0, 0.05 * jitter, true),
        brow_right: -0.1 + _.random(0, 0.05 * jitter, true),
      },
      injuryValues: {
        brow_left: heal * HEAL_PER_TURN,
        brow_right: heal * HEAL_PER_TURN,
      },
    };
  },
  'eye enlargement': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        eye_lids: -0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        eye_lids: heal * HEAL_PER_TURN,
        under_eyes: jitter * HEAL_PER_TURN,
      },
    };
  },
  'eye reduction': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        eye_lids: 0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        eye_lids: heal * HEAL_PER_TURN,
        under_eyes: jitter * HEAL_PER_TURN,
      },
    };
  },
  'jaw enlargement': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        jaw_right: 0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
        jaw_left: 0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        jaw_right: heal * HEAL_PER_TURN,
        jaw_left: heal * HEAL_PER_TURN,
      },
    };
  },
  'jaw reduction': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        jaw_right: -0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
        jaw_left: -0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        jaw_right: heal * HEAL_PER_TURN,
        jaw_left: heal * HEAL_PER_TURN,
      },
    };
  },
  'chin injection': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        chin_center: 0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        chin_center: heal * HEAL_PER_TURN,
        jaw_left: jitter * HEAL_PER_TURN,
        jaw_right: jitter * HEAL_PER_TURN,
      },
    };
  },
  'chin reduction': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        chin_center: -0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        chin_center: heal * HEAL_PER_TURN,
        jaw_left: jitter * HEAL_PER_TURN,
        jaw_right: jitter * HEAL_PER_TURN,
      },
    };
  },
  'upper ear enlargement': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        upper_ear_left: 0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
        upper_ear_right: 0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        upper_ear_left: heal * HEAL_PER_TURN,
        upper_ear_right: heal * HEAL_PER_TURN,
        ear_lobe_left: jitter * HEAL_PER_TURN,
        ear_lobe_right: jitter * HEAL_PER_TURN,
      },
    };
  },
  'upper ear reduction': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        upper_ear_left: -0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
        upper_ear_right: -0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        upper_ear_left: heal * HEAL_PER_TURN,
        upper_ear_right: heal * HEAL_PER_TURN,
        ear_lobe_left: jitter * HEAL_PER_TURN,
        ear_lobe_right: jitter * HEAL_PER_TURN,
      },
    };
  },
  'ear lobe enlargement': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        ear_lobe_left: 0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
        ear_lobe_right: 0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        ear_lobe_left: heal * HEAL_PER_TURN,
        ear_lobe_right: heal * HEAL_PER_TURN,
        upper_ear_left: jitter * HEAL_PER_TURN,
        upper_ear_right: jitter * HEAL_PER_TURN,
      },
    };
  },
  'ear lobe reduction': (skill, heal) => {
    var jitter = _.random(0, 2 - skill);
    var jitterSign = jitter && (Math.random() > 0.5 ? 1 : -1);
    return {
      normalShifts: {
        ear_lobe_left: -0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
        ear_lobe_right: -0.1 + jitterSign * (_.random(0, 0.05 * jitter, true)),
      },
      injuryValues: {
        ear_lobe_left: heal * HEAL_PER_TURN,
        ear_lobe_right: heal * HEAL_PER_TURN,
        upper_ear_left: jitter * HEAL_PER_TURN,
        upper_eat_right: jitter * HEAL_PER_TURN,
      },
    };
  },
};

var lists = {
  skillRange: [-2, 2],

  prefix: {
    '-1': ['Dr. MC', '', 'Doc', 'M.C.', 'Healer'],
    '0': ['Dr.', 'Dr. Mr.', 'Dr. Mrs.', 'Doctor'],
    '1': ['Sir Dr.', 'Dame Dr.', 'Dr. Prof.', 'Dr.']
  },
  firstName: [
    'Barry', 'Kirk', 'Melinda', 'Harry', 'Howard', 'Gordon', 'Linda',
    'Jane', 'George', 'Kim', 'Jim', 'Michael', 'Jess', 'Alex', 'Sharon',
  ],
  lastName: [
    'Guvorkian', 'Hindsight', 'Snatch', 'Chang', 'Song', 'Danger',
  ],

  postfix: {
    '-1': ['', '', 'the Hammer'],
    '0': ['Sr', 'Jr', 'III', 'PhD', 'Ph.D.', '', 'MD'],
    '1': ['MD', 'M.D.'],
  },

  school: {
    '-1': ['School of Rock Bottom', 'Looking At Your Face', 'Wiki Night School'],
    '0': ['Bridgetower Community Academy', 'University of Stuff', 'Hayman College'],
    '1': ['Ivyford University', 'Academy of Surgeons', 'Superior University'],
  },

  office: {
    '-1': ['Alley Way', 'Shady Cir.', 'Under Hollow Dr.'],
    '0': ['Neutral Str.', 'Face Way', 'Simple Cir.', 'Autumn Dr.'],
    '1': ['Care Dr.', 'Franklin Way', 'Sorota Row'],
  },

  templates: {
    '-1': [
      (s) => `
        <p>
          Yo, you need <b>${s.surgery}</b>?!
        </p>
        <p>
          We got some just for you!
        </p>
        <p>
          Come visit <b>${s.name}</b> at ${s.office}!
        </p>
      `,
    ],
    '0': [
      (s) => `
        <b>${s.name}</b>
        <p>
          <i>${s.office}</i>
        </p>
        <p>
          Need <b>${s.surgery}</b>?
          <br />
          We're offerring specials for ${s.cost}.
        </p>
      `,
    ],
    '1': [
      (s) => `
        <b>${s.name}</b>
        <p>
          <i>${s.office}</i>
          <i>${s.school}</i>
        </p>
        <p>
         We believe in bringing out the best in you!
        </p>
        <p>
         Today only, we're offering <b>${s.surgery}</b> for ${s.cost}.
        </p>
      `
    ],
  },

  surgery: Object.keys(surgeries),
  healRange: [0, 3],
  costRange: [100, 1000],
};

var getListBySkill = (skill, listsBySkill) => {
  var jitter = _.random(0, 1);
  return listsBySkill[Math.sign(skill + jitter)];
};

function generate() {
  var surgeon = {};
  var skill = surgeon.skill = _.random.apply(_, lists.skillRange);
  surgeon.cost = _.random.apply(_, lists.costRange) + (skill * 100);
  surgeon.cost = Math.round(surgeon.cost / 10) * 10;
  surgeon.money = surgeon.cost;
  surgeon.heal = Math.max(_.random.apply(_, lists.healRange) - skill, 0);
  surgeon.surgery = _.sample(lists.surgery);
  surgeon.office = [
    _.random(100, 8888),
    _.sample(getListBySkill(skill, lists.office)),
    _.sample(['Suite', 'Office', '#']),
    _.random(1, 10),
  ].join(' ');
  surgeon.school = _.sample(getListBySkill(skill, lists.school));
  surgeon.name = _.compact([
    _.sample(getListBySkill(skill, lists.prefix)),
    _.sample(lists.firstName),
    _.sample(lists.lastName),
    _.sample(getListBySkill(skill, lists.postfix)),
  ]).join(' ');
  surgeon.template = _.sample(getListBySkill(skill, lists.templates));
  return surgeon;
}

function perform(surgeon) {
  // Shouldn't encounter this state, but just in case.
  if (Data.money < surgeon.cost) return 'You could not afford the procedure.';

  let ouchAudio = window[`ouch${_.random(0, 3)}Audio`];
  if (surgeon.heal > 3) ouchAudio = ouch4Audio;
  ouchAudio.play();

  mergeTransform(surgeries[surgeon.surgery](surgeon.skill, surgeon.heal));
  Data.money -= surgeon.cost;
  Money.renderChange(-surgeon.cost);
  return `${surgeon.name} performed the <b>${surgeon.surgery}</b>. <br /><br />
     ${surgeon.heal > 1 ? 'You may need a few days to heal...' : 'You feel pretty good!'}`;
}

function mergeTransform(params) {
  for (let param in params) {
    Data.transform[param] = Data.transform[param] || {};
    for (let key in params[param]) {
      Data.transform[param][key] = Data.transform[param][key] || 0;
      Data.transform[param][key] += params[param][key];
    }
  }
  return Data.transform;
}

module.exports = {
  generate,
  perform,
  surgeries,
  mergeTransform,
  HEAL_PER_TURN };


