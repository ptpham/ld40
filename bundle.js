
Object.assign(window, require('gl-matrix'));
Object.assign(window, {
  createShader: require('gl-shader'),
  createGeometry: require('gl-geometry'),
  parseOBJ: require('parse-wavefront-obj')
});

Object.assign(window, {
  Render: require('./src/render'),
  Control: require('./src/control'),
  Mesh: {
    cube: parseOBJ(require('./mesh/cube.obj'))
  },
  _: require('lodash'),
  Cards: require('./src/cards'),
});

require('./src/events');

var renderer = new Render.Default(canvas);
var listeners = Control.createTurntableListeners(renderer);
Control.addListeners(window, listeners);

var cube = createGeometry(renderer.gl)
  .attr('position', Mesh.cube.positions)
  .faces(Mesh.cube.cells);
renderer.geometry.push(cube);
renderer.requestFrame();


Cards.render({
  key: 'card0',
  name: 'Dr. Rhino',
  type: 'Surgeon',
  flavor: 'Need a nose? We got some.'
});

Cards.render({
  key: 'card1',
  name: 'Dr. Rhino',
  type: 'Surgeon',
  flavor: 'Need a nose? We got some.'
});

Cards.render({
  key: 'card2',
  name: 'Looking for model for teen magazine.',
  type: 'Job',
  flavor: 'We\'re looking for an individual with a youthful look and a round nose. Pays $500'
});

Cards.render({
  key: 'card3',
  name: 'Day at the beach',
  type: 'Event',
  flavor: 'Take a break at the beach.'
});

