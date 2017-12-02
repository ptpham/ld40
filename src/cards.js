
var cardContainer = document.getElementById('cards');
var cardTemplate = document.getElementById('card-template');

function render(card) {
  var cardEl = cardTemplate.content.cloneNode(true);
  var s = cardEl.querySelector.bind(cardEl);
  s('.name').innerText = card.name;
  s('.type').innerText = card.type;
  s('.flavor').innerText = card.flavor;
  cardContainer.appendChild(cardEl);
}

function toggle() {
  cardContainer.classList.toggle('closed');
}

document.body.addEventListener('click', function onClick(e) {
  if (!e.target.matches('.card')) return;

  for (var i=0; i < cardContainer.children.length; i++) {
    var child = cardContainer.children.item(i);
    if (child === e.target) continue;
    child.classList.remove('chosen');
  }
  e.target.classList.toggle('chosen');
});

module.exports = {
  render,
  toggle,
};

