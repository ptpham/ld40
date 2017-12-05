
Object.assign(window, require('gl-matrix'));
Object.assign(window, {
  createShader: require('gl-shader'),
  createGeometry: require('gl-geometry'),
});

Object.assign(window, {
  Setup: require('./src/setup'),
  Render: require('./src/render'),
  Control: require('./src/control'),
  Health: require('./src/health'),
  Money: require('./src/money'),
  Mesh: require('./src/mesh'),
  _: require('lodash'),
  Data: require('./src/data'),
  Cards: require('./src/cards'),
  Surgeon: require('./src/surgeon'),
  Events: require('./src/events'),
});

var renderer = new Render.Face(canvas);

var facePartAverages = Setup.weightedPositionAverage(Mesh.face, Mesh.faceWeights);
var healthManager = new Health.Manager(renderer, facePartAverages);

var listeners = Control.createTurntableListeners(renderer);
Control.addListeners(window, listeners);

renderer.installFace(Mesh.face, Mesh.faceWeights);

var ponytailGeometry = Setup.createGeometryFromObj(renderer.gl, Mesh.ponytail);
ponytailGeometry.attr('texcoord', _.times(3*Mesh.ponytail.cells.length, x => vec3.create()));
renderer.geometry.push(ponytailGeometry);
renderer.requestFrame();

let turnIndex = 0;
function drawCards() {
  turnIndex++;

  var cardTypes = ['surgeon', 'job', 'event'];
  var pickedTypes = ['surgeon', 'event'];
  pickedTypes.push(_.sample(cardTypes));

  if (turnIndex % 10 == 0) pickedTypes.push('victory');
  else pickedTypes.push(_.sample(cardTypes));

  pickedTypes = _.shuffle(pickedTypes);
  var cards = pickedTypes.map(type => Cards.generate(type));
  Data.cards = cards;

  Cards.unflip();
  Cards.reset();
  Data.cards.forEach(Cards.render);
  setTimeout(() => Cards.toggle(true), 200);
}

Cards.toggle(true);
drawCards();
Money.render();
renderer.applyFaceParameters(Data.transform);

document.body.addEventListener('click', function onClick(e) {
  if (e.target.matches('.card')) {
    var card = _.find(Data.cards, ({ key }) => key === e.target.dataset.key);
    if (e.target.classList.contains('chosen')) {
      Cards.toggle(false);
      setTimeout(drawCards, 400);
    } else {
      Cards.select(card);
    }
  }
});


document.body.addEventListener('card:select', function onCardSelect(e) {
  let card = e.detail;

  // Do turn healing first
  if (card.type == 'event' && Data.transform.injuryValues) {
    for (let key in Data.transform.injuryValues) {
      let current = Data.transform.injuryValues[key];
      Data.transform.injuryValues[key] = Math.max(current - Surgeon.HEAL_PER_TURN, 0);
    }
  }

  let cardBack = Cards.cardTypes[card.type].perform(card.attributes);
  Cards.renderBack(card, cardBack);
  Cards.flip(card);

  renderer.applyFaceParameters(Data.transform);
  renderer.requestFrame();

  // Pay Rent
  Data.money -= 100;
  Money.renderChange(-100, 'rent');
 
  if (Data.money <= 0) {
    modalDefeat.classList.add('show');
  }  
  Money.render();
});

document.body.addEventListener('endGame', () => {
  setTimeout(() => Cards.reset(), 500);
});

