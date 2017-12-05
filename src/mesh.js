
let parseOBJ = require('parse-wavefront-obj');
let Multimap = require('multimap');
let Setup = require('./setup');
let _ = require('lodash');

let face = parseOBJ(require('../mesh/face.obj'));
let faceWeights = _.mapValues(require('../mesh/faceWeights.json'),
    x => Setup.derefCells(x, face.cells));

let displayNamePairs = [
  ['nose_bridge', 'nose bridge'],
  ['nose_nostrils', 'nostrils'],
  ['nose_tip', 'nose tip'],
  ['upper_lip_center', 'upper lip'],
  ['lower_lip_center', 'lower lip'],
  ['upper_ear_left', 'upper left ear'],
  ['ear_lobe_left', 'left ear lobe'],
  ['upper_ear_right', 'upper right ear'],
  ['ear_lobe_right', 'right ear lobe'],
  ['under_eyes', 'area under your eyes'],
  ['eye_lids', 'eye lids'],
  ['upper_cheek_left', 'upper left cheek'],
  ['lower_cheek_left', 'lower left cheek'],
  ['upper_cheek_right', 'upper right cheek'],
  ['lower_cheek_right', 'lower right cheek'],
  ['brow_left', 'left brow'],
  ['brow_right', 'right brow'],
  ['chin_center', 'chin'],
  ['jaw_left', 'left jaw'],
  ['jaw_right', 'right jaw']
];

let partDisplayNameMap = new Map(displayNamePairs);
let ALL_FACE_PARTS = Array.from(partDisplayNameMap.keys());

module.exports = {
  cube: parseOBJ(require('../mesh/cube.obj')),
  ponytail: parseOBJ(require('../mesh/ponytail.obj')),
  face, faceWeights, partDisplayNameMap, ALL_FACE_PARTS
};

