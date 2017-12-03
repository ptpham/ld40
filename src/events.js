
var Cards = require('./cards');
var context = {};

document.body.addEventListener('click', function onClick(e) {
  if (e.target.matches('.card')) Cards.select(e.target);
});


document.body.addEventListener('card:select', function onCardSelect(e) {
  console.log(e);
});

document.body.addEventListener('render', e => {
  let { healthManager } = context;
  if (healthManager == null) return;
  healthManager.layout();
});

function register(name, object) {
  context[name] = object;
}

module.exports = { register };

