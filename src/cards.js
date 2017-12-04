
var _ = require('lodash');
var Data = require('./data');

var cardContainer = document.getElementById('cards');
var cardTemplate = document.getElementById('card-template');

var cardTypes = {
  surgeon: require('./surgeon'),
  event: require('./events'),
  job: require('./job')
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
  if (Data.money + card.money < 0 || Data.money <= 0) {
    s('.card').classList.add('disabled');
  }
  s('.card').classList.add(card.type);

  s('.front .type').innerText = card.type;
  s('.back .type').innerText = card.type;
  s('.flavor').innerHTML = card.flavor;
  s('.amount').innerText = card.money;

  cardContainer.appendChild(cardNode);
}

function renderBack(card, message) {
  var cardEl = cardContainer.querySelector(`[data-key="${card.key}"]`);
  var s = cardEl.querySelector.bind(cardEl);
  s('.back p').innerHTML = message;
}

function toggle(toggle) {
  if (toggle !== undefined) toggle = !toggle;
  cardContainer.classList.toggle('closed', toggle);
}

function reset() {
  cardContainer.innerHTML = '';
}

function select(card) {
  var ev = new CustomEvent('card:select', { detail: card });
  document.body.dispatchEvent(ev);
}

function flip(card) {
  unflip();
  var cardEl = cardContainer.querySelector(`[data-key="${card.key}"]`);
  cardEl.classList.toggle('chosen', true);
  cardContainer.classList.toggle('hide-not-chosen', true);
}

function unflip() {
  for (var i=0; i < cardContainer.children.length; i++) {
    var child = cardContainer.children.item(i);
    child.classList.remove('chosen');
  }
  cardContainer.classList.toggle('hide-not-chosen', false);
}

function generate(_type) {
  var type = _type || _.sample(Object.keys(cardTypes));
  var attr = cardTypes[type].generate();
  var money = (type === 'job' ? attr.pay : -attr.cost) || 0;
  return new Card(type, money, attr.template, attr);
}

module.exports = {
  Card,
  cardTypes,
  render,
  renderBack,
  flip,
  unflip,
  toggle,
  reset,
  select: _.throttle(select, 888),
  generate,
};

