
var Data = require('./data');

var moneyContainer = document.getElementById('money');
var amountEl = moneyContainer.querySelector('.amount');
var changeQueue = [];

function render() {
  amountEl.innerText = Data.money;
}

function renderChange(change, reason) {
  if (!change) return;

  var changeEl = document.createElement('div');
  changeEl.innerText = `${reason || ''} ${change}`;
  changeEl.classList.add('change');
  changeEl.setAttribute('data-sign', Math.sign(change));
  changeQueue.push(changeEl);
}

function renderChangeFromQueue() {
  var changeEl = changeQueue.shift();
  if (!changeEl) return;
  moneyContainer.appendChild(changeEl);
  setTimeout(() => changeEl.classList.add('animate'), 10);
  setTimeout(() => changeEl.remove(), 800);
}

setInterval(renderChangeFromQueue, 500)

module.exports = {
  render,
  renderChange,
};

