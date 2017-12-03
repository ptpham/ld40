
var _ = require('lodash');
var cardContainer = document.getElementById('cards');
var cardTemplate = document.getElementById('card-template');

var cardTypes = {
  surgeon: require('./surgeon'),
};

function Card(type, money, template, attributes) {
  this.key = _.uniqueId('card');
  this.type = type;
  this.money = money;
  this.template = template;
  this.flavor = template(attributes);
  this.attributes = attributes;
}

function render(card) {
  var cardNode = cardTemplate.content.cloneNode(true);
  var s = cardNode.querySelector.bind(cardNode);
  s('.card').setAttribute('data-key', card.key);
  s('.card').setAttribute('data-sign', Math.sign(card.money));
  s('.card').classList.add(card.type);

  s('.type').innerText = card.type;
  s('.flavor').innerHTML = card.flavor;
  s('.money').innerText = card.money;

  cardContainer.appendChild(cardNode);
}

function toggle() {
  cardContainer.classList.toggle('closed');
}

function reset() {
  cardContainer.innerHTML = '';
}

function select(cardEl) {
  for (var i=0; i < cardContainer.children.length; i++) {
    var child = cardContainer.children.item(i);
    if (child === cardEl) continue;
    child.classList.remove('chosen');
  }

  var isChosen = cardEl.classList.toggle('chosen');
  if (isChosen) {
    var ev = new CustomEvent('card:select', { detail: cardEl.dataset.key });
    document.body.dispatchEvent(ev);
  } else {
    toggle();
  }

  cardContainer.classList.toggle('hide-not-chosen', isChosen);
  return isChosen;
}

function generate() {
  var type = _.sample(Object.keys(cardTypes));
  var attr = cardTypes[type].generate();
  return new Card(type, attr.money, attr.template, attr);
}

module.exports = {
  Card,
  render,
  toggle,
  reset,
  select: _.throttle(select, 888),
  generate,
};

