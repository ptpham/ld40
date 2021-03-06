
let TurntableCamera = require('turntable-camera');
let createShader = require('gl-shader');
let createTexture = require('gl-texture2d');
let { vec3, vec4, mat4 } = require('gl-matrix');
let Setup = require('./setup');
let Eye = require('./eye');

const NSHIFT = 'normalShifts';

const skinColors = [
  // Fair
  {
    diffuseColor: vec4.fromValues(1,0.8,0.6,1),
    specularColor: vec4.fromValues(1,1,1,1),
    ambientColor: vec4.fromValues(0.5,0.5,0.4,1),
    injuryColor: vec4.fromValues(0.4, 0.1, 0.15, 1),
  },
  // Medium
  {
    diffuseColor: vec4.fromValues(0.93, 0.70, 0.55, 1.00),
    specularColor: vec4.fromValues(1,1,1,1),
    ambientColor: vec4.fromValues(0.64, 0.48, 0.39, 1.00),
    injuryColor: vec4.fromValues(0.25, 0.1, 0.15, 1),
  },
  // Tanned
  {
    diffuseColor: vec4.fromValues(0.71, 0.54, 0.47, 1.00),
    specularColor: vec4.fromValues(0.94, 0.71, 0.62, 1.00),
    ambientColor: vec4.fromValues(0.3, 0.2, 0.15, 1.00),
    injuryColor: vec4.fromValues(0.2, 0, 0.1, 1),
  },
  // Dark
  {
    diffuseColor: vec4.fromValues(0.40, 0.21, 0.16, 1.00),
    specularColor: vec4.fromValues(0.69, 0.38, 0.30, 1.00),
    ambientColor: vec4.fromValues(0.10, 0.10, 0.07, 1.00),
    injuryColor: vec4.fromValues(0.1, 0, 0.2, 1),
  },
];

const hairColors = [
  // Blonde
  {
    hairAmbientColor: vec4.fromValues(0.2,0.1,0.1,1),
    hairSpecularColor: vec4.fromValues(1, 1, 1,1),
    hairDiffuseColor: vec4.fromValues(1.00, 0.83, 0.32, 1.00),
  },
  // Platinum
  {
    hairAmbientColor: vec4.fromValues(0.16, 0.14, 0.09, 1.00),
    hairSpecularColor: vec4.fromValues(1, 1, 1, 1.00),
    hairDiffuseColor: vec4.fromValues(1, 0.95, 0.8, 1.00),
  },
  // Brown
  {
    hairAmbientColor: vec4.fromValues(0, 0, 0, 1.00),
    hairSpecularColor: vec4.fromValues(0.60, 0.28, 0.17, 1.00),
    hairDiffuseColor: vec4.fromValues(0.46, 0.21, 0.13, 1.00),
  },
  // Black
  {
    hairAmbientColor: vec4.fromValues(0, 0, 0, 1.00),
    hairSpecularColor: vec4.fromValues(0.4, 0.2, 0.1, 1.00),
    hairDiffuseColor: vec4.fromValues(0.2, 0.15, 0.07, 1.00),
  },
];

function preFrame(gl, canvas, color = [1,1,1,1]) {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  gl.clearColor(color[0], color[1], color[2], color[3]);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var { width, height } = canvas;
  gl.viewport(0, 0, width, height);
}

function canvasProjection(projection, canvas) {
  let { width, height } = canvas;
  return mat4.perspective(projection, Math.PI/4, width/height, 1, 100);
}

function createDefaultShader(gl) {
  let vs = `
    attribute vec3 position, normal, shift, texcoord;

    uniform mat4 projection, view;
    varying vec3 v_position, v_normal, v_shift, v_texcoord;

    void main() {
      vec3 displaced = position + shift.z*normal;
      gl_Position = projection*view*vec4(displaced, 1.0);
      v_position = gl_Position.xyz;
      v_texcoord = texcoord;
      v_normal = normal;
      v_shift = shift;
    }
  `;

  let fs = `
    precision mediump float;
    varying vec3 v_position, v_normal, v_shift, v_texcoord;

    uniform vec3 lightPosition0, lightPosition1;
    uniform vec4 diffuseColor, ambientColor, specularColor, injuryColor;
    uniform sampler2D texture;

    void main() {
      vec3 lightDiff0 = normalize(lightPosition0 - v_position);
      vec3 lightDiff1 = normalize(lightPosition1 - v_position);

      vec4 sample = texture2D(texture, v_texcoord.xy);
      vec4 diffuseUse = vec4(((1.0 - sample[3])*diffuseColor + sample[3]*sample).xyz, 1.0);
      float lightDot = clamp(max(dot(lightDiff0, v_normal), dot(lightDiff1, v_normal)), 0.0, 1.0);
      float ambientWeight = 1.0 - lightDot;
      float weightSum = 1.0 + ambientWeight + lightDot;
      vec4 litColor = (diffuseUse + lightDot*specularColor + ambientWeight*ambientColor)/weightSum;
      gl_FragColor = (1.0 - v_shift.x)*litColor + v_shift.x*injuryColor;
    }
  `;
  
  return createShader(gl, vs, fs);
}

function createBackgroundGeometry(gl) {
  let positions = [], texcoords = []; 
  let radius = 20, count = 32;
  for (let i = 0; i < count; i++) {
    let t = i/(count-1);
    let nextT = (i+1)/(count-1);

    let theta = 2*Math.PI*(t - 0.25);
    let nextTheta = 2*Math.PI*(nextT - 0.25);

    let bottom = -20, top = 40;
    positions.push([radius*Math.cos(theta), bottom, -radius*Math.sin(theta)]);
    positions.push([radius*Math.cos(theta), top, -radius*Math.sin(theta)]);
    positions.push([radius*Math.cos(nextTheta), top, -radius*Math.sin(nextTheta)]);

    positions.push([radius*Math.cos(nextTheta), bottom, -radius*Math.sin(nextTheta)]);
    positions.push([radius*Math.cos(theta), bottom, -radius*Math.sin(theta)]);
    positions.push([radius*Math.cos(nextTheta), top, -radius*Math.sin(nextTheta)]);

    texcoords.push([t, 0, 0]);
    texcoords.push([t, 1, 0]);
    texcoords.push([nextT, 1, 0]);

    texcoords.push([nextT, 0, 0]);
    texcoords.push([t, 0, 0]);
    texcoords.push([nextT, 1, 0]);
  }
  return createGeometry(gl).attr('position', positions)
    .attr('texcoord', texcoords);
}

function createBackgroundShader(gl) {
  let vs = `
    attribute vec3 position, texcoord;
    uniform mat4 projection, view;
    varying vec2 v_texcoord;

    void main() {
      gl_Position = projection*view*vec4(position, 1.0);
      v_texcoord = texcoord.xy;
    }
  `;

  let fs = `
    precision mediump float;
    uniform sampler2D texture;
    varying vec2 v_texcoord;

    void main() {
      gl_FragColor = texture2D(texture, v_texcoord);
    }
  `;
  
  return createShader(gl, vs, fs);
}

function createDefaultCamera() {
  let result = new TurntableCamera();
  result.center[1] -= 1;
  result.center[2] -= 2;
  result.distance = 9;
  result.rotation = -Math.PI/6;
  result.downwards = -Math.PI/16;
  return result;
}

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl');
    this.camera = createDefaultCamera();
    this.projection = mat4.create();
    this.view = mat4.create();
    this.gl.enable(this.gl.DEPTH_TEST);
    this.clearColor = vec4.fromValues(0.05, 0.1, 0.2, 1.0);
  }

  preFrame() {
    preFrame(this.gl, this.canvas, this.clearColor);
    canvasProjection(this.projection, this.canvas);
    this.camera.view(this.view);
  }

  requestFrame() {
    requestAnimationFrame(this.drawFrame.bind(this));
  }
}

class Default extends Renderer {
  constructor(canvas) {
    super(canvas);
    this.shader = createDefaultShader(this.gl);
    this.lightPosition0 = vec3.fromValues(10, 10, 10);
    this.lightPosition1 = vec3.fromValues(-10, -2, 0);
    this.diffuseColor = vec4.fromValues(1,0.8,0.6,1);
    this.specularColor = vec4.fromValues(1,1,1,1);
    this.ambientColor = vec4.fromValues(0.7,0.7,0.6,1);
    this.injuryColor = vec4.fromValues(0.4, 0.1, 0.15, 1);
    this.geometry = [];
  }

  drawFrame() {
    this.preFrame();
    for (let geometry of this.geometry) {
      this.draw(geometry);
    }
    document.body.dispatchEvent(new CustomEvent('render'));
  }

  draw(geometry, overrides = {}) {
    let { shader, projection, view } = this;
    let { uniforms } = shader;
    geometry.bind(shader);
    uniforms.projection = overrides.projection || projection;
    uniforms.lightPosition0 = this.lightPosition0;
    uniforms.lightPosition1 = this.lightPosition1;
    uniforms.ambientColor = overrides.ambientColor || this.ambientColor;
    uniforms.specularColor = overrides.specularColor || this.specularColor;
    uniforms.diffuseColor = overrides.diffuseColor || this.diffuseColor;
    uniforms.injuryColor = this.injuryColor;
    uniforms.view = overrides.view || view;
    geometry.draw();
  }
}

class Face extends Default {
  constructor(canvas) {
    super(canvas);
    var skinColor = _.sample(skinColors);
    var hairColor = _.sample(hairColors);
    Object.assign(this, skinColor);
    Object.assign(this, hairColor);
    this.eyePair = new Eye.Pair(this,
      vec3.fromValues(-0.85, 0.9, 3.4),
      vec3.fromValues(0.85, 0.9, 3.4));

    this.cityTexture = createTexture(this.gl, cityImage);
    this.backgroundShader = createBackgroundShader(this.gl);
    this.backgroundGeometry = createBackgroundGeometry(this.gl);
    this.featuresTexture = createTexture(this.gl, featuresImage);

    this.hairOptions = {
      ambientColor: this.hairAmbientColor,
      specularColor: this.hairSpecularColor,
      diffuseColor: this.hairDiffuseColor
    };
  }

  installFace(faceMesh, faceWeights) {
    this.geometry = [];

    this.faceMesh = faceMesh;
    this.faceWeights = faceWeights;
    this.shifts = _.times(3*faceMesh.cells.length, i => vec3.create());
    this.faceGeometry = Setup.createGeometryFromObj(this.gl, faceMesh)
      .attr('shifts', this.shifts);
    this.geometry.push(this.faceGeometry);
  }

  _applyWeights(paramsSet, shiftIndex) {
    if (paramsSet == null) return;
    let { shifts } = this;

    for (let key in paramsSet) {
      let value = paramsSet[key];
      let weights = this.faceWeights[key];
      if (weights == null) continue;
      for(let i = 0; i < weights.length; i++) {
        shifts[i][shiftIndex] += value*weights[i];
      }
    }
  }

  applyFaceParameters(params) {
    let { shifts } = this;
    let { normalShifts, injuryValues } = params;

    for (let shift of shifts) vec3.set(shift, 0, 0, 0);
    this._applyWeights(normalShifts, 2);
    this._applyWeights(injuryValues, 0);

    this.faceGeometry.attr('shift', shifts);
  }

  drawFrame() {
    this.preFrame();

    let { canvas: { width, height } } = this;
    this.gl.viewport(0, 0, width, height);
    this.backgroundGeometry.bind(this.backgroundShader);
    this.backgroundShader.uniforms.projection = this.projection;
    this.backgroundShader.uniforms.view = this.view;
    this.backgroundShader.uniforms.texture = this.cityTexture.bind();
    this.backgroundGeometry.draw();

    let aspect = Math.max((2/3)*width/height, 1.1);
    mat4.perspective(this.projection, Math.PI/4, aspect, 1, 100);
    this.gl.viewport(0, 0, Math.floor(aspect*height), height);
    this.aspect = aspect;

    this.faceGeometry.bind(this.shader);
    this.shader.uniforms.texture = this.featuresTexture.bind();
    for (let geometry of this.geometry) {
      let options = geometry != this.faceGeometry ? this.hairOptions : undefined;
      this.draw(geometry, options);
    }

    this.eyePair.draw();
    document.body.dispatchEvent(new CustomEvent('render'));
  }
}

module.exports = { Default, Face, NSHIFT };

