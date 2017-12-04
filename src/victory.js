
let _ = require('lodash');
let Data = require('./data');
let Mesh = require('./mesh');
let Money = require('./money');

let SIZE_GAP = 0.4;

function generateIdealFace() {
  let faceParts = _.keys(Mesh.faceWeights);
  faceParts = _.filter(faceParts, (part) => part !== 'under_eyes');

  let partNames = _.shuffle(faceParts);
  let constrainedParts = partNames.slice(0, _.random(3, 5));

  let normalShifts = {};
  for (let partName of constrainedParts) {
    normalShifts[partName] = _.random(0, 1) ? SIZE_GAP : -SIZE_GAP;
  }

  if (normalShifts.under_eye) {
    normalShifts.under_eye = Math.max(normalShifts.under_eye, -0.1);
  }

  return { normalShifts };
}

let IDEAL_FACE = generateIdealFace();
let IDEAL_PART_NAMES = _.keys(IDEAL_FACE.normalShifts);

function checkFacePart(partName, ratio = 0.5) {
  let delta = IDEAL_FACE.normalShifts[partName]
    - _.get(Data, 'transform.normalShifts.' + partName, 0);
  if (delta < ratio*SIZE_GAP) return -1;
  if (delta > ratio*SIZE_GAP) return 1;
  return 0;
}

function generate() {
  let content = `
    <p>The <strong class="victory">Most Beautiful Woman of the Year</strong> competition
    is here! Do you have the face to beat out the competition? (Entry fee
    required)</p>
  `;
  return { cost: 500, template: () => content };
}

function perform(victory) {
  let success = true;
  let partNames = _.shuffle(IDEAL_PART_NAMES);
  var partName;

  for (var partName of partNames) {
    if (checkFacePart(partName) != 0) {
      success = false;
      break;
    }
  }

  if (success) {
    modalVictory.classList.add('show');
    document.body.dispatchEvent(new CustomEvent('endGame'));
    return '';   
  }

  let displayName = Mesh.partDisplayNameMap.get(partName);
  Data.money -= victory.cost;
  Money.renderChange(-victory.cost);
  return `
    <p>You lost the competition this year. They said something was off about
    your ${displayName}...</p>`;
}

module.exports = { generate, perform, checkFacePart, IDEAL_FACE, IDEAL_PART_NAMES };

