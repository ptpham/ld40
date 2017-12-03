
let { vec3, mat4 } = require('gl-matrix');
let Multimap = require('multimap');

let EPSILON = 0.000001;

let healthContainer = document.querySelector('#health');
let healthTemplate = document.querySelector('#health-template');

let aggregations = new Multimap([
  ['Nose', 'nose_bridge'],
  ['Upper Lip', 'upper_lip_center'],
  ['Lower Lip', 'lower_lip_center'],
  ['Left Ear', 'upper_ear_left'],
  ['Right Ear', 'upper_ear_right'],
  ['Under Eyes', 'under_eyes'],
  ['Left Cheek', 'upper_cheek_left'],
  ['Right Cheek', 'upper_cheek_right'],
  ['Left Brow', 'brow_left'],
  ['Right Brow', 'brow_right']
]);

function makeHealthNode(name) {
  var healthNode = healthTemplate.content.cloneNode(true).firstElementChild;
  healthContainer.appendChild(healthNode);
  healthNode.dataset.part = name;
  return healthNode;
}

function applyHealthData(healthNode, health) {
  healthNode.querySelector('.name').innerText = health.name;
  healthNode.querySelector('.turns').innerText = health.turns;
  healthNode.style.left = (health.x - 75) + 'px';
  healthNode.style.top = (health.y - 25) + 'px';
  healthNode.style.opacity = health.opacity;
  healthNode.style.zIndex = health.zIndex;
}

class Manager {
  constructor(renderer, facePartAverages) {
    let aggregationAverages = {};
    for (let aggregation of aggregations.keys()) {
      let average = vec3.create();
      for (let facePart of aggregations.get(aggregation)) {
        vec3.add(average, average, facePartAverages[facePart]);
      }
      vec3.scale(average, average, 1/aggregations.get(aggregation).length);
      aggregationAverages[aggregation] = average;
    }

    this.aggregationAverages = aggregationAverages;
    this.cameraMat = mat4.create();
    this.renderer = renderer;
    this.turnsToHeal = { nose_bridge: 10, upper_ear_left: 5 };

    document.body.addEventListener('render', () => this.layout());
  }

  layout() {
    let { renderer, cameraMat, aggregationAverages } = this;
    let { canvas: { width, height } } = renderer;
    mat4.multiply(cameraMat, renderer.projection, renderer.view);

    let pending = [];
    for (let aggregation in aggregationAverages) {
      let turns = _.max(aggregations.get(aggregation).map(
        partName => this.turnsToHeal[partName])) || 0;
      if (turns == 0) continue;

      let worldPoint = aggregationAverages[aggregation];
      let screenPoint = vec3.transformMat4(vec3.create(), worldPoint, cameraMat);
      let x = (screenPoint[0]+1)*width/2;
      let y = (-screenPoint[1]+1)*height/2;
      pending.push({ name: aggregation, x, y, z: -screenPoint[2], turns });
    }

    let allZ = _.map(pending, 'z');
    let minZ = _.min(allZ), maxZ = _.max(allZ);
    pending = _.sortBy(pending, x => x.z);

    let minOpacity = 1/pending.length;
    for (let i = 0; i < pending.length; i++) {
      let entry = pending[i];
      let { name } = entry;

      entry.zIndex = i;
      entry.opacity = (1 - minOpacity)*(entry.z - minZ) / (maxZ - minZ) + minOpacity;

      let existing = healthContainer.querySelector(`.health-node[data-part="${name}"]`);
      if (existing == null) existing = makeHealthNode(name);
      applyHealthData(existing, entry);
    }
  }
}

module.exports = { Manager };

