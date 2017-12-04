
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
  setTimeout(() => changeEl.classList.add('animate'), 1);
  setTimeout(() => changeEl.remove(), 800);
}

module.exports = {
  render,
  renderChange,
};

