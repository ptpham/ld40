
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

  Cards.reset();
  Data.cards.forEach(Cards.render);
  setTimeout(() => Cards.toggle(true), 400);
}

Cards.toggle(true);
drawCards();


document.body.addEventListener('click', function onClick(e) {
  var cardActions = {
    surgeon: (card) => {
      renderer.applyFaceParameters(Surgeon.perform(card.attributes));
      renderer.requestFrame();
    },
  };

  if (e.target.matches('.card')) {
    var card = _.find(Data.cards, ({ key }) => key === e.target.dataset.key);
    if (Data.money + card.money > 0) {
      Data.money += card.money;
      document.getElementById('money').innerText = Data.money; 
      var selected = Cards.select(e.target);
      if (selected) cardActions[card.type](card);
      else setTimeout(drawCards, 400);
    }
  }

});


document.body.addEventListener('card:select', function onCardSelect(e) {
  console.log(e);
});



