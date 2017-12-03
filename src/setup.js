
let _ = require('lodash');
let createGeometry = require('gl-geometry');
let parseOBJ = require('parse-wavefront-obj');
let { vec3 } = require('gl-matrix');

function derefCells(array, cells) {
  return _.flatMap(cells, cell => cell.map(i => array[i])); 
}

function createGeometryFromObj(gl, obj) {
  let positions = derefCells(obj.positions, obj.cells);
  let normals = derefCells(obj.vertexNormals, obj.faceNormals);
  let shifts = _.times(positions.length, i => vec3.create());
  return createGeometry(gl)
    .attr('position', positions)
    .attr('normal', normals)
    .attr('shift', shifts);
}

function weightedPositionAverage(mesh, weightsSet) {
  let diff = vec3.create();
  return _.mapValues(weightsSet, weights => {
    let result = vec3.create();
    let weightSum = 0;
    
    for (let i = 0; i < weights.length; i++) {
      let weight = weights[i]
      if (weight == 0) continue;

      weightSum += weight;
      let position = mesh.positions[mesh.cells[Math.floor(i/3)][i%3]];
      vec3.sub(diff, position, result);
      vec3.scaleAndAdd(result, result, diff, weight/weightSum);
    }

    return result;
  });
}

module.exports = { derefCells, createGeometryFromObj, weightedPositionAverage };

