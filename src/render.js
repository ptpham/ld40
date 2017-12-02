
let TurntableCamera = require('turntable-camera');
let createShader = require('gl-shader');
let { mat4 } = require('gl-matrix');

function preframe(gl, canvas, color = [1,1,1,1]) {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  gl.clearColor(color[0], color[1], color[2], color[3]);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function canvasProjection(projection, canvas) {
  let { width, height } = canvas;
  return mat4.perspective(projection, width/height, Math.PI/4, 1, 100);
}

function createDefaultShader(gl) {
  let vs = `
    attribute vec3 position;
    uniform mat4 projection, view;

    void main() {
      gl_Position = projection*view*vec4(position, 1.0);
    }
  `;

  let fs = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.,0.,0.,1.);
    }
  `;
  
  return createShader(gl, vs, fs);
}

function createDefaultCamera() {
  let result = new TurntableCamera();
  result.distance = 10;
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
  }
}

class Default extends Renderer {
  constructor(canvas) {
    super(canvas);
    this.shader = createDefaultShader(this.gl);
  }

  draw(geometry) {
    var { canvas, camera, view, projection, shader, gl } = this;
    preframe(gl, canvas);

    camera.view(view);
    canvasProjection(projection, canvas);

    geometry.bind(shader);
    shader.uniforms.projection = projection;
    shader.uniforms.view = view;
    geometry.draw();
  }
}

module.exports = { Default };

