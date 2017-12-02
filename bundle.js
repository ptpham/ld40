
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
  Mesh: {
    cube: parseOBJ(require('./mesh/cube.obj')),
    face: parseOBJ(require('./mesh/face.obj')),
    ponytail: parseOBJ(require('./mesh/ponytail.obj'))
  },
  _: require('lodash'),
  Cards: require('./src/cards'),
});

require('./src/events');

var renderer = new Render.Default(canvas);
var listeners = Control.createTurntableListeners(renderer);
Control.addListeners(window, listeners);

renderer.geometry.push(Setup.createGeometryFromObj(renderer.gl, Mesh.face));
renderer.geometry.push(Setup.createGeometryFromObj(renderer.gl, Mesh.ponytail));
renderer.requestFrame();


Cards.render({
  key: 'card0',
  type: 'surgeon',
  money: -500,
  flavor: 'Need a nose? We got some. Come see Dr. Rhino.'
});

Cards.render({
  key: 'card1',
  type: 'surgeon',
  money: -1000,
  flavor: 'Need a nose? We got some. Check the back alley.'
});

Cards.render({
  key: 'card2',
  type: 'job',
  money: 500,
  flavor: 'We\'re looking for an individual with a youthful look and a round nose. Pays $500'
});

Cards.render({
  key: 'card3',
  type: 'event',
  money: 0,
  flavor: 'Take a break at the beach.'
});

