
let parseOBJ = require('parse-wavefront-obj');
let Multimap = require('multimap');
let Setup = require('./setup');
let Mesh = require('./mesh');
let _ = require('lodash');

let face = parseOBJ(require('../mesh/face.obj'));
let faceWeights = _.mapValues(require('../mesh/faceWeights.json'),
    x => Setup.derefCells(x, face.cells));

let displayNamePairs = [
  ['nose_bridge', 'nose bridge'],
  ['upper_lip_center', ,'upper lip'],
  ['lower_lip_center', 'lower lip'],
  ['upper_ear_left', 'upper left ear'],
  ['upper_ear_right', 'upper right ear'],
  ['under_eyes', 'area under your eyes'],
  ['upper_cheek_left', 'upper left cheek'],
  ['upper_cheek_right', 'upper right cheek'],
  ['brow_left', 'left brow'],
  ['brow_right', 'right brow']
];

let partDisplayNameMap = new Map(displayNamePairs);

module.exports = {
  cube: parseOBJ(require('../mesh/cube.obj')),
  ponytail: parseOBJ(require('../mesh/ponytail.obj')),
  face, faceWeights, partDisplayNameMap
};

