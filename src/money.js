
var Data = require('./data');

var moneyContainer = document.getElementById('money');
var amountEl = moneyContainer.querySelector('.amount');

function render() {
  amountEl.innerText = Data.money;
}

function renderChange(change) {
  if (!change) return;

  var changeEl = document.createElement('div');
  changeEl.innerText = change;
  changeEl.classList.add('change');
  changeEl.setAttribute('data-sign', Math.sign(change));
  moneyContainer.appendChild(changeEl);
  setTimeout(() => changeEl.remove(), 400);
}

module.exports = {
  render,
  renderChange,
};

