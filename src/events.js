
var Cards = require('./cards');

document.body.addEventListener('click', function onClick(e) {
  if (e.target.matches('.card')) Cards.select(e.target);
});


document.body.addEventListener('card:select', function onCardSelect(e) {
  console.log(e);
});

