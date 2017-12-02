
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
  _: require('lodash')
});

var renderer = new Render.Default(canvas);
var listeners = Control.createTurntableListeners(renderer);
Control.addListeners(window, listeners);

var cube = createGeometry(renderer.gl)
  .attr('position', Mesh.cube.positions)
  .faces(Mesh.cube.cells);
renderer.geometry.push(cube);
renderer.requestFrame();

