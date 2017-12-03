
let  parseOBJ = require('parse-wavefront-obj');
let Setup = require('./setup');
let Mesh = require('./mesh');
let _ = require('lodash');

let face = parseOBJ(require('../mesh/face.obj'));
let faceWeights = _.mapValues(require('../mesh/faceWeights.json'),
    x => Setup.derefCells(x, face.cells));

module.exports = {
  cube: parseOBJ(require('../mesh/cube.obj')),
  ponytail: parseOBJ(require('../mesh/ponytail.obj')),
  face, faceWeights
};

