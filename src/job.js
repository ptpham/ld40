
let _ = require('lodash');
let Data = require('./data');
let Mesh = require('./mesh');

function generateIdealFace() {
  let partNames = _.shuffle(_.keys(Mesh.faceWeights));
  let constrainedParts = partNames.slice(0, _.random(3, 5));

  let normalShifts = {};
  for (let partName of constrainedParts) {
    normalShifts[partName] = Math.random() - 0.5;
  }

  return { normalShifts };
}

let IDEAL_FACE = generateIdealFace();

function renderFaceConstraintText(constraint) {
  let { maxDaysToHeal } = constraint;
  let faceMessage;

  if (maxDaysToHeal == 0) {
    faceMessage = `We need a ${_.sample(['fresh', 'lovely', 'radiant'])} face.`;
  } else if (maxDaysToHeal < 3) {
    let adjective = _.sample(['reasonable', 'average', 'modest']);
    faceMessage = `We're just looking for a ${adjective}-looking person.`;
  } else if (maxDaysToHeal < 5) {
    let adjective = _.sample(['road-kill', 'silly putty', 'tree bark']);
    faceMessage = `We're open to a ${adjective} look`;
  } else {
    faceMessage = `You probably have a face.`;
  }

  return `
    <p>${faceMessage}</p>
  `;
}

function checkFaceConstraint(constraint) {
  let success = true;
  let message = 'Congratulations!';

  if (Data.getTurnsTillFullyHealed() > constraint.maxDaysToHeal) {
    message = _.sample([
      `On second thought, we're getting someone else.`,
      `We've changed out minds. Please leave.`
    ]);
    success = false;
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
    pay = _.random(50, 500);
  } else if (magazineType == 'Gossip') {
    pay = _.random(10, 150);
  } else if (magazineType == 'Fashion') {
    pay = _.random(400, 1500);
  } else if (magazineType == 'Home') {
    pay = _.random(200, 600);
  }

  let content = _.sample([
     `
      <p>We've got a job for an ad in ${magazineType} Magazine for you!</p>
     `
  ]);

  let constraint = { maxDaysToHeal: _.random(0, 1) };
  return { pay, content, constraint };
}

function generateAdJob() {
  let gerund = _.sample([ 'cleaning', 'opening', 'vacuuming' ]);
  let noun = _.sample([ 'car', 'refrigerator', 'desk', 'chicken' ]);

  let content = _.sample([
    `
      <p>We have a new product for ${gerund} your ${noun}
        and we want you to be our TV spokesperson!</p>
    `,
  ]);

  let pay = _.random(100, 600);
  let constraint = { maxDaysToHeal: _.random(0, 4) };
  return { pay, content, constraint };
}

function generateSketchyJob() {
  let pay = _.random(5, 300);

  let diminuative = _.sample(['Honey', 'Babe']);
  let convention = _.sample(['Awesome Socks', 'Electronic Darts', 'Gilford Gaming']);

  let content = _.sample([
    `
      <p>Looking for an easy gig? I got ${pay} dollars with your name on it.</p>
    `,
    `
      <p>${diminuative}, with a face like that you'd make a killing at Woofers.</p>
    `,
    `
      <p>${diminuative}, I got a booth at the ${convention} Convention that you'd look great next to.</p>
    `
  ]);

  let constraint = { maxDaysToHeal: _.random(0, 10) };
  return { pay, content, constraint };
}

function generateVictoryJob() {
  let content = `
    <p>You've been nominated as Supreme Beauty's Woman of the Year!</p> 
  `;
  return { pay: 10000, content, isVictory: true };
}

let generatorList = _.concat(
  _.times(30, () => generateSketchyJob),
  _.times(30, () => generateAdJob),
  _.times(15, () => generateMagazineJob));

function perform(job) {
  let check = checkFaceConstraint(job.constraint);
  if (check.success) {
    Data.money += job.pay;
    return `You made ${job.pay} dollars!`;
  } else {
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

