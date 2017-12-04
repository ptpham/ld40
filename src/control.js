
let _ = require('lodash');

function createTurntableListeners(renderer) {
  let { camera } = renderer;
  let result = {};
  
  let isDown = false;
  result.mousedown = e => isDown = true;
  result.mouseup = e => isDown = false;
  result.mousemove = e => {
    if (!isDown) return;
    camera.downwards = _.clamp(camera.downwards + e.movementY/200, -Math.PI/8, 0);
    camera.rotation = _.clamp(camera.rotation + e.movementX/100, -Math.PI/4, Math.PI/4);
    renderer.requestFrame();
  }

  result.resize = e => renderer.requestFrame();
  return result;
}

function addListeners(target, listeners) {
  for (let eventName in listeners) {
    target.addEventListener(eventName, listeners[eventName]);
  }
}

function removeListeners(target, listeners) {
  for (let eventName in listeners) {
    target.removeEventListener(eventName, listeners[eventName]);
  }
}

module.exports = { createTurntableListeners, addListeners, removeListeners };

