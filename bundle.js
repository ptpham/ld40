
Object.assign(window, require('gl-matrix'));
Object.assign(window, {
  createShader: require('gl-shader'),
  createGeometry: require('gl-geometry'),
  parseOBJ: require('parse-wavefront-obj')
});

Object.assign(window, {
  Render: require('./src/render'),
  Mesh: {
    cube: parseOBJ(require('./mesh/cube.obj'))
  },
  _: require('lodash')
});

var renderer = new Render.Default(canvas);
var cube = createGeometry(renderer.gl)
  .attr('position', Mesh.cube.positions)
  .faces(Mesh.cube.cells);
renderer.draw(cube);

