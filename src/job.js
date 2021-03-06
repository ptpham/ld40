
let _ = require('lodash');
let Data = require('./data');
let Money = require('./money');
let Mesh = require('./mesh');
let Victory = require('./victory');

let { IDEAL_FACE } = Victory;
let IDEAL_PART_NAMES = _.keys(IDEAL_FACE.normalShifts);

function renderFaceConstraintText(constraint) {
  let { partName, maxDaysToHeal } = constraint;
  let faceMessage, partMessage = '';

  if (maxDaysToHeal == 0) {
    faceMessage = `We need a ${_.sample(['fresh', 'lovely', 'radiant'])} face.`;
  } else if (maxDaysToHeal < 3) {
    let adjective = _.sample(['reasonable', 'average', 'modest']);
    faceMessage = `We're just looking for a ${adjective}-looking person.`;
  } else if (maxDaysToHeal < 5) {
    let adjective = _.sample(['roadkill', 'silly putty', 'tree bark']);
    faceMessage = `We're open to a ${adjective} look.`;
  } else {
    faceMessage = `We want you if you have a face.`;
  }

  if (partName) {
    let displayName = Mesh.partDisplayNameMap.get(partName);
    let sizeAdjective;
    if (IDEAL_FACE.normalShifts[partName] > 0) {
      sizeAdjective = _.sample(['huge', 'hefty', 'big', 'sizeable']);
    } else {
      sizeAdjective = _.sample(['small', 'discreet', 'compact', 'tiny']);
    }

    partMessage = `We're really looking for someone with a <b>${sizeAdjective} ${displayName}</b>.`;
  }

  return `
    <p>${faceMessage}</p>
    <p>${partMessage}</p>
  `;
}

function checkFaceConstraint(constraint) {
  let success = true;
  let message = 'Congratulations!';
  let turn = _.sample(['On second thought... ', `We've changed our minds.`, `Actually...`]);

  if (Data.getTurnsTillFullyHealed() > constraint.maxDaysToHeal) {
    let rejection = _.sample([`We're getting someone else.`, `Please leave.`]);
    message = turn + ' ' + rejection;
    success = false;
  }

  let { partName } = constraint;
  if (success && partName) {
    let displayName = Mesh.partDisplayNameMap.get(partName);
    let check = Victory.checkFacePart(partName, constraint.checkRatio || 0.5);
    if (check == -1) {
      message = `${turn} <b>Your ${displayName} is too big for us.</b>`;
      success = false; 
    } else if (check == 1) {
      message = `${turn} <b>Your ${displayName} is too small for us.</b>`;
      success = false;
    }
  }

  return { success, message };
}

function roundBy(value, rounder) {
  return rounder*Math.floor(value / rounder);
}

function generateMagazineJob() {
  let magazineType = _.sample(['Teen', 'Gossip', 'Fashion', 'Home']);
  let pay = 0;

  if (magazineType == 'Teen') {
    pay = _.random(500, 1500);
  } else if (magazineType == 'Gossip') {
    pay = _.random(100, 1000);
  } else if (magazineType == 'Fashion') {
    pay = _.random(2000, 3500);
  } else if (magazineType == 'Home') {
    pay = _.random(1000, 2200);
  }

  let content = _.sample([
     `
      <p>We've got a job for an ad in <b>${magazineType} Magazine</b> for you!</p>
     `
  ]);

  let constraint = { maxDaysToHeal: _.random(0, 1), partName: _.sample(IDEAL_PART_NAMES) };
  return { pay, content, constraint };
}

function generateAdJob() {
  let gerund = _.sample([ 'cleaning', 'opening', 'vacuuming' ]);
  let noun = _.sample([ 'car', 'refrigerator', 'desk', 'chicken' ]);

  let content = _.sample([
    `
      <p>We have a new product for ${gerund} your ${noun}
        and we want you to be our <b>TV spokesperson</b>!</p>
    `,
  ]);

  let pay = _.random(100, 600);
  let constraint = {
    maxDaysToHeal: _.random(0, 4),
    partName: _.sample(IDEAL_PART_NAMES), 
    checkRatio: 0.75
  };
  return { pay, content, constraint };
}

function generateSketchyJob() {
  let pay = _.random(5, 100);

  let diminuative = _.sample(['Honey', 'Babe']);
  let convention = _.sample(['Awesome Socks', 'Electronic Darts', 'Gilford Gaming']);

  let content = _.sample([
    `
      <p>Looking for an <b>easy gig</b>? I got <b>${pay} dollars</b> with your name on it.</p>
    `,
    `
      <p>${diminuative}, with a face like that you'd make a killing at <b>Woofers</b>.</p>
    `,
    `
      <p>${diminuative}, I got a <b>booth at the ${convention} Convention</b> that you'd look great next to.</p>
    `
  ]);

  let constraint = { maxDaysToHeal: _.random(0, 10) };
  return { pay, content, constraint };
}

let generatorList = _.concat(
  _.times(30, () => generateSketchyJob),
  _.times(30, () => generateAdJob),
  _.times(15, () => generateMagazineJob));

function perform(job) {
  let check = checkFaceConstraint(job.constraint);
  if (check.success) {
    Data.money += job.pay;
    Money.renderChange(job.pay);
    moneyAudio.play();
    return `You made <strong>${job.pay} dollars</strong>!`;
  } else {
    window[`ugh${_.random(0,2)}Audio`].play();
    return check.message;
  }
}

function generate() {
  let job = _.sample(generatorList)();

  let pay = job.pay;
  if (pay > 1000) pay = roundBy(pay, 100);
  else if (pay > 100) pay = roundBy(pay, 10);
  job.pay = pay;

  job.template = (job) => {
    let constraintText = renderFaceConstraintText(job.constraint);
    return job.content + constraintText;
  };
  return job;
}

module.exports = { generate, perform };

