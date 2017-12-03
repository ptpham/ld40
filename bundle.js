
Object.assign(window, require('gl-matrix'));
Object.assign(window, {
  createShader: require('gl-shader'),
  createGeometry: require('gl-geometry'),
  parseOBJ: require('parse-wavefront-obj')
});

Object.assign(window, {
  Setup: require('./src/setup'),
  Render: require('./src/render'),
  Control: require('./src/control'),
  Health: require('./src/health'),
  Mesh: {
    cube: parseOBJ(require('./mesh/cube.obj')),
    face: parseOBJ(require('./mesh/face.obj')),
    ponytail: parseOBJ(require('./mesh/ponytail.obj'))
  },
  _: require('lodash'),
  Data: require('./src/data'),
  Cards: require('./src/cards'),
  Surgeon: require('./src/surgeon'),
});

Object.assign(window, {
  FaceWeights: _.mapValues(require('./mesh/faceWeights.json'),
    x => Setup.derefCells(x, Mesh.face.cells))
});

var renderer = new Render.Face(canvas);

var facePartAverages = Setup.weightedPositionAverage(Mesh.face, FaceWeights);
var healthManager = new Health.Manager(renderer, facePartAverages);

var listeners = Control.createTurntableListeners(renderer);
Control.addListeners(window, listeners);

renderer.installFace(Mesh.face, FaceWeights);
renderer.geometry.push(Setup.createGeometryFromObj(renderer.gl, Mesh.ponytail));
renderer.requestFrame();


function drawCards() {
  Data.cards = [];
  Data.cards = [
    Cards.generate(),
    Cards.generate(),
    Cards.generate(),
    Cards.generate(),
  ];
  console.log('Drawing Cards');

  Cards.unflip();
  Cards.reset();
  Data.cards.forEach(Cards.render);
  setTimeout(() => Cards.toggle(true), 200);
}

Cards.toggle(true);
drawCards();


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
  var cardActions = {
    surgeon: (card) => { Surgeon.perform(card.attributes); },
  };

  // Do turn healing first
  if (Data.transform.injuryValues) {
    for (let key in Data.transform.injuryValues) {
      let current = Data.transform.injuryValues[key];
      Data.transform.injuryValues[key] = Math.max(current - Surgeon.HEAL_PER_TURN, 0);
    }
  }

  var card = e.detail;
  if (Data.money + card.money > 0) {
    Data.money += card.money;
    document.getElementById('money').innerText = Data.money;
    Cards.flip(card);
    cardActions[card.type](card);
  }

  renderer.applyFaceParameters(Data.transform);
  renderer.requestFrame();
});



