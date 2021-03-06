
var _ = require('lodash');
var Surgeon = require('./surgeon');
var Mesh = require('./mesh');
var Audio = require('./audio');

var HEAL_PER_TURN = Surgeon.HEAL_PER_TURN;

var injuryAreas = Array.from(Mesh.partDisplayNameMap.keys());

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
    var injury = _.sample([
      'upper_cheek_left', 'upper_cheek_right',
      'lower_cheek_left', 'lower_cheek_right',
      'jaw_left', 'jaw_right', 'nose_bridge',
    ]);
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
    <p>
      <strong>${_.sample(friends)}:</strong><br />
      Do you want to <b>${event.text}</b>?
      I'm planning to do that today and was wondering if you wanted to join.
    </p>`,
  (event) => `
    <p>
      You feel like you want to <b>${event.text}</b>.
    </p>`,
  (event) => `
    <p>
      ${_.sample(friends)} invited you to <b>${event.text}</b>.
    </p>`,

];

function generate() {
  var event = Object.assign({}, _.sample(events));
  event.template = _.sample(templates);
  return event;
}

function perform(event) {
  cardAudio.play();
  var response = `You ${event.text}.`;
  var accident = event.risk && Math.random() < event.chance;
  if (accident) {
    Audio.playOuchAudio();
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

