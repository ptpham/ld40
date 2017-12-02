
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
    varying vec3 v_position, v_normal;

    void main() {
      vec3 displaced = position + shift.z*normal;
      gl_Position = projection*view*vec4(displaced, 1.0);
      v_position = gl_Position.xyz;
      v_normal = normal;
    }
  `;

  let fs = `
    precision mediump float;
    varying vec3 v_position, v_normal;

    uniform vec3 lightPosition;
    uniform vec4 diffuseColor, ambientColor, specularColor;

    void main() {
      vec3 lightDiff = normalize(lightPosition - v_position);
      float lightDot = clamp(dot(lightDiff, v_normal), 0.0, 1.0);
      float ambientWeight = 1.0 - lightDot;
      float weightSum = 1.0 + ambientWeight + lightDot;
      gl_FragColor = (diffuseColor + lightDot*specularColor + ambientWeight*ambientColor)/weightSum;
    }
  `;
  
  return createShader(gl, vs, fs);
}

function createDefaultCamera() {
  let result = new TurntableCamera();
  result.distance = 15;
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
    this.lightPosition = vec3.fromValues(10, 10, 10);
    this.diffuseColor = vec4.fromValues(1,0.8,0.6,1);
    this.specularColor = vec4.fromValues(1,1,1,1);
    this.ambientColor = vec4.fromValues(0.7,0.7,0.6,1);
    this.geometry = [];
  }

  drawFrame() {
    this.preFrame();
    for (let geometry of this.geometry) {
      this.draw(geometry);
    }
  }

  draw(geometry) {
    let { shader, projection, view } = this;
    let { uniforms } = shader;
    geometry.bind(shader);
    uniforms.projection = projection;
    uniforms.lightPosition = this.lightPosition;
    uniforms.ambientColor = this.ambientColor;
    uniforms.specularColor = this.specularColor;
    uniforms.diffuseColor = this.diffuseColor;
    uniforms.view = view;
    geometry.draw();
  }
}

class Face extends Default {
  installFace(faceMesh, faceWeights) {
    this.geometry = [];

    this.faceMesh = faceMesh;
    this.faceWeights = faceWeights;
    this.faceGeometry = Setup.createGeometryFromObj(this.gl, faceMesh);
    this.geometry.push(this.faceGeometry);
  }

  applyFaceParameters(transforms) {
    let shifts = _.times(3*this.faceMesh.cells.length, i => vec3.create());
    transforms.forEach(({type, key, value}) => {
      let weights = this.faceWeights[key];
      if (weights == null) return;

      switch (type) {
        case NSHIFT: {
          for(let i = 0; i < weights.length; i++) {
            shifts[i][2] += value*weights[i];
          }
          break;
        }
      }
    })

    this.faceGeometry.attr('shift', shifts);
  }
}

module.exports = { Default, Face, NSHIFT };

