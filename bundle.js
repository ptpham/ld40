
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

var Events = require('./src/events');

var renderer = new Render.Face(canvas);
var facePartAverages = Setup.weightedPositionAverage(Mesh.face, FaceWeights);
var healthManager = new Health.Manager(renderer, facePartAverages);
Events.register('healthManager', healthManager);

var listeners = Control.createTurntableListeners(renderer);
Control.addListeners(window, listeners);

renderer.installFace(Mesh.face, FaceWeights);
renderer.geometry.push(Setup.createGeometryFromObj(renderer.gl, Mesh.ponytail));
renderer.requestFrame();

var surgeon = Surgeon.generate();
renderer.applyFaceParameters(Surgeon.perform(surgeon));

Cards.render(Cards.generate());
Cards.render(Cards.generate());
Cards.render(Cards.generate());
Cards.render(Cards.generate());

