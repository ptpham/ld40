
function createTurntableListeners(renderer) {
  let { camera } = renderer;
  let result = {};
  
  let isDown = false;
  result.mousedown = e => isDown = true;
  result.mouseup = e => isDown = false;
  result.mousemove = e => {
    if (!isDown) return;
    camera.rotation += e.movementX/100;
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

