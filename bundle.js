
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
  Mesh: require('./src/mesh'),
  _: require('lodash'),
  Data: require('./src/data'),
  Cards: require('./src/cards'),
  Surgeon: require('./src/surgeon'),
});

var renderer = new Render.Face(canvas);

var facePartAverages = Setup.weightedPositionAverage(Mesh.face, Mesh.faceWeights);
var healthManager = new Health.Manager(renderer, facePartAverages);

var listeners = Control.createTurntableListeners(renderer);
Control.addListeners(window, listeners);

renderer.installFace(Mesh.face, Mesh.faceWeights);
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
  setTimeout(() => Cards.toggle(true), 200);
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
    if (e.target.classList.contains('chosen')) {
      setTimeout(drawCards, 400);
    } else if (Data.money + card.money > 0) {
      Data.money += card.money;
      document.getElementById('money').innerText = Data.money;
      cardActions[card.type](card);
    }
    Cards.select(e.target);
  }

});


document.body.addEventListener('card:select', function onCardSelect(e) {
  console.log(e);
});



