
var _ = require('lodash');
var Surgeon = require('./surgeon');

var HEAL_PER_TURN = Surgeon.HEAL_PER_TURN;

var injuryAreas = [
  'nose_bridge',
  'upper_lip_center', 'lower_lip_center',
  'upper_ear_left', 'upper_ear_right',
  'under_eyes',
  'upper_cheek_left', 'upper_cheek_right',
  'brow_left', 'brow_right']

var events = [
  {
    text: 'go to the beach',
    risk: 'Shark Attack!',
    chance: 0.1,
  },
  {
    text: 'have a picnic in the park',
  },
  {
    text: 'go to the party',
    risk: 'Someone punched you!',
    chance: 0.2,
  },
  {
    text: 'have dinner',
  },
  {
    text: 'do some errands',
  },
  {
    text: 'relax at home',
    risk: 'Stayed up all night!',
    chance: 0.3,
  },
  {
    text: 'visit an old friend',
    risk: 'Stayed up all night!',
    chance: 0.3,
  },
  {
    text: 'get some drinks',
    risk: 'Stayed up all night!',
    chance: 0.6,
  }
];

var accidents = {
  'Shark Attack!': () => {
    var injuries = _.sampleSize(injuryAreas, 3);
    var transform = { injuryValues: {} };
    injuries.forEach((area) => {
      transform.injuryValues[area] = HEAL_PER_TURN * _.random(0, 2);
    });
    return transform;
  },
  'Someone punched you!': () => {
    var injury = _.sample(['upper_cheek_left', 'upper_cheek_right']);
    return {
      injuryValues: {
        [injury]: HEAL_PER_TURN,
      },
    };
  },
  'Stayed up all night!': () => {
    return {
      injuryValues: { under_eyes: HEAL_PER_TURN }
    };
  },
};

var friends = [
  'Anna',
  'Joan',
  'George',
  'Heather',
  'Carl',
];

var templates = [
  (event) => `
    <p>You got a text from a friend:</p>
    <strong>${_.sample(friends)}:</strong> 
    <message>Do you want to ${event.text}?
    I'm planning to go today and was wondering if you wanted to come with.
    </message>`,
  (event) => `
    <p>
      You feel like you want to ${event.text}.
    </p>`,
  (event) => `
    <p>
      ${_.sample(friends)} invited you to ${event.text}.
    </p>`,

];

function generate() {
  var event = Object.assign({}, _.sample(events));
  event.template = _.sample(templates);
  return event;
}

function perform(event) {
  var response = `You ${event.text}.`;
  var accident = event.risk && Math.random() < event.chance;
  if (accident) {
    var transform = accidents[event.risk]();
    Surgeon.mergeTransform(transform);
    return `${response} <p><strong>${event.risk}</strong> Better rest for a bit.</p>`;
  }
  return `${response} <p>It was uneventful.</p>`;
}

module.exports = {
  generate,
  perform,
};

