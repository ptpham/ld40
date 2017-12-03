
var _ = require('lodash');
var Data = require('./data');

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
          Yo, you need ${s.surgery}?! <br />
          We got some just for you! <br />
          Come visit ${s.name} at ${s.office}!
        </p>
      `,
    ],
    '0': [
      (s) => `
        <name>${s.name}</name>
        <address>${s.office}</address>
        <p>
          Need a ${s.surgery}?
          <br />
          We're offerring specials for ${s.cost}.
        </p>
      `,
    ],
    '1': [
      (s) => `
        <name>${s.name}</name>
        <address>${s.office}</address>
        <school>${s.school}</school>
        <p>
         We believe in bringing out the best in you!
         Today only, we're offering ${s.surgery} for ${s.cost}.
        </p>
      `
    ],
  },

  surgery: Object.keys(surgeries),
  healRange: [0, 3],
  costRange: [500, 5000],
};

var getListBySkill = (skill, listsBySkill) => {
  var jitter = _.random(0, 1);
  return listsBySkill[Math.sign(skill + jitter)];
};

function generate() {
  var surgeon = {};
  var skill = surgeon.skill = _.random.apply(_, lists.skillRange);
  surgeon.cost = _.random.apply(_, lists.costRange) + (skill * 100);
  surgeon.cost = Math.round(surgeon.cost / 100) * 100;
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
  return mergeTransform(
    surgeries[surgeon.surgery](surgeon.skill, surgeon.heal)
  );
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

module.exports = { generate, perform, surgeries };

