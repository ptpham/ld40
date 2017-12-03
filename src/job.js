
let _ = require('lodash');
let Data = require('./data');

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

  return { pay, template: () => content };
}

function generateAdJob() {
  let gerund = _.sample([ 'cleaning', 'opening', 'vacuuming' ]);
  let noun = _.sample([ 'car', 'refrigerator', 'desk', 'chicken' ]);
  let weekday = _.sample(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

  let content = _.sample([
    `
      <p>We've got a new product for ${gerund} your ${noun}
        and we want you to be our TV spokesperson! Can you come down to the
        studio next ${weekday}?</p>
    `,
  ]);

  let pay = _.random(100, 600);
  return { pay, template: () => content };
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
  return { pay, template: () => content };
}

function generateVictoryJob() {
  let template = `
    <p>You've been nominated as Supreme Beauty's Woman of the Year!</p> 
  `;
  return { pay: 10000, template, isVictory: true };
}

let generatorList = _.concat(
  _.times(30, () => generateSketchyJob),
  _.times(30, () => generateAdJob),
  _.times(15, () => generateMagazineJob));

function perform(job) {
  Data.money += job.pay;
  return `You made ${job.pay} dollars!`;
}

function generate() {
  let job = _.sample(generatorList)();

  let pay = job.pay;
  if (pay > 1000) pay = roundBy(pay, 100);
  else if (pay > 100) pay = roundBy(pay, 10);
  job.pay = pay;

  return job;
}

module.exports = { generate, perform };

