
let _ = require('lodash');
let createGeometry = require('gl-geometry');
let parseOBJ = require('parse-wavefront-obj');

function derefCells(array, cells) {
  return _.flatMap(cells, cell => cell.map(i => array[i])); 
}

function createGeometryFromObj(gl, obj) {
  let positions = derefCells(obj.positions, obj.cells);
  let normals = derefCells(obj.vertexNormals, obj.faceNormals);
  return createGeometry(gl)
    .attr('position', positions)
    .attr('normal', normals);
}

module.exports = { derefCells, createGeometryFromObj };

