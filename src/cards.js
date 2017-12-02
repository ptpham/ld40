
var _ = require('lodash');
var cardContainer = document.getElementById('cards');
var cardTemplate = document.getElementById('card-template');

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
}

module.exports = {
  render,
  toggle,
  reset,
  select: _.throttle(select, 888),
};

