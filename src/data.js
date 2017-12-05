
var _ = require('lodash');
var HEAL_PER_TURN = 0.2;

var data = {
  money: 5000,
  cards: [],
  transform: {},
};

function getMaxInjuryValue() {
  return _.max(_.values(data.transform.injuryValues)) || 0;
}

function getTurnsTillFullyHealed() {
  return Math.ceil(getMaxInjuryValue() / HEAL_PER_TURN);
}

Object.assign(data, {
  getMaxInjuryValue,
  getTurnsTillFullyHealed,
  HEAL_PER_TURN,
});

module.exports = data;

