
let TurntableCamera = require('turntable-camera');
let createShader = require('gl-shader');
let { vec3, vec4, mat4 } = require('gl-matrix');
let Setup = require('./setup');

const NSHIFT = 'normalShifts';

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
    attribute vec3 position, normal, shift;

    uniform mat4 projection, view;
    varying vec3 v_position, v_normal, v_shift;

    void main() {
      vec3 displaced = position + shift.z*normal;
      gl_Position = projection*view*vec4(displaced, 1.0);
      v_position = gl_Position.xyz;
      v_normal = normal;
      v_shift = shift;
    }
  `;

  let fs = `
    precision mediump float;
    varying vec3 v_position, v_normal, v_shift;

    uniform vec3 lightPosition0, lightPosition1;
    uniform vec4 diffuseColor, ambientColor, specularColor, injuryColor;

    void main() {
      vec3 lightDiff0 = normalize(lightPosition0 - v_position);
      vec3 lightDiff1 = normalize(lightPosition1 - v_position);
      float lightDot = clamp(max(dot(lightDiff0, v_normal), dot(lightDiff1, v_normal)), 0.0, 1.0);
      float ambientWeight = 1.0 - lightDot;
      float weightSum = 1.0 + ambientWeight + lightDot;
      vec4 litColor = (diffuseColor + lightDot*specularColor + ambientWeight*ambientColor)/weightSum;
      gl_FragColor = (1.0 - v_shift.x)*litColor + v_shift.x*injuryColor;
    }
  `;
  
  return createShader(gl, vs, fs);
}

function createDefaultCamera() {
  let result = new TurntableCamera();
  result.center[1] -= 1;
  result.distance = 10;
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
    uniforms.projection = projection;
    uniforms.lightPosition0 = this.lightPosition0;
    uniforms.lightPosition1 = this.lightPosition1;
    uniforms.ambientColor = overrides.ambientColor || this.ambientColor;
    uniforms.specularColor = overrides.specularColor || this.specularColor;
    uniforms.diffuseColor = overrides.diffuseColor || this.diffuseColor;
    uniforms.injuryColor = this.injuryColor;
    uniforms.view = view;
    geometry.draw();
  }
}

class Face extends Default {
  constructor(canvas) {
    super(canvas);
    this.hairAmbientColor = vec4.fromValues(0.3,0.1,0.3,1);
    this.hairSpecularColor = vec4.fromValues(1,0.8,0.4,1);
    this.hairDiffuseColor = vec4.fromValues(0.4,0.3,0.2,1);
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
    let aspect = Math.max((2/3)*width/height, 1.2);
    mat4.perspective(this.projection, Math.PI/4, aspect, 1, 100);
    this.gl.viewport(0, 0, Math.floor(aspect*height), height);
    this.aspect = aspect;

    let hairOptions = {
      ambientColor: this.hairAmbientColor,
      specularColor: this.hairSpecularColor,
      diffuseColor: this.diffuseColor
    };

    for (let geometry of this.geometry) {
      let options = geometry != this.faceGeometry ? hairOptions : undefined;
      this.draw(geometry, options);
    }

    document.body.dispatchEvent(new CustomEvent('render'));
  }
}

module.exports = { Default, Face, NSHIFT };

