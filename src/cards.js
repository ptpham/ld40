
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

render({
  name: 'Dr. Rhino',
  type: 'Surgeon',
  flavor: 'Need a nose? We got some.'
});

render({
  name: 'Dr. Rhino',
  type: 'Surgeon',
  flavor: 'Need a nose? We got some.'
});

render({
  name: 'Looking for model for teen magazine.',
  type: 'Job',
  flavor: 'We\'re looking for an individual with a youthful look and a round nose. Pays $500'
});

render({
  name: 'Day at the beach',
  type: 'Event',
  flavor: 'Take a break at the beach.'
});

