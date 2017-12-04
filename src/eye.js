
let Icosphere = require('icosphere');
let createGeometry = require('gl-geometry');
let createShader = require('gl-shader');
let normals = require('normals');

let eyeVS = `
  attribute vec3 position, normal;

  uniform mat4 projection, view, world;
  varying vec3 v_position, v_normal;

  void main() {
    vec4 worldPosition = world*vec4(position, 1.0);
    gl_Position = projection*view*worldPosition;
    v_position = worldPosition.xyz;
    v_normal = normal;
  }
`;

let eyeFS = `
  precision mediump float;
  varying vec3 v_position, v_normal;

  uniform vec3 lightPosition0, lightPosition1;
  uniform vec4 diffuseColor, ambientColor, specularColor;
  uniform vec3 eyeCenter, lookAt;
  uniform vec4 irisColor;
  uniform float radius;

  void main() {
    vec3 lightDiff0 = normalize(lightPosition0 - v_position);
    vec3 lightDiff1 = normalize(lightPosition1 - v_position);
    vec4 baseColor = vec4(0.8, 0.8, 0.8, 1.0);
    vec4 specularColor = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 diffuseColor = vec4(0.9, 0.9, 0.9, 1.0);
    vec4 black = vec4(0.0, 0.0, 0.0, 1.0);

    vec3 centerToLook = normalize(lookAt - eyeCenter);
    vec3 pointToLook = lookAt - v_position;
    vec3 centerToPoint = pointToLook - dot(pointToLook, centerToLook)*centerToLook;
    float centerToPointLength = length(centerToPoint);

    if (centerToPointLength < radius/2.5) {
      baseColor = irisColor;
      diffuseColor = irisColor;
    }

    if (centerToPointLength < radius/5.0) {
      diffuseColor = black;
      baseColor = black;
    }

    float lightDot = clamp(max(dot(lightDiff0, v_normal), dot(lightDiff1, v_normal)), 0.0, 1.0);
    lightDot *= lightDot;
    float ambientWeight = 1.0 - lightDot;
    float weightSum = 1.0 + ambientWeight + lightDot;
    vec4 litColor = (diffuseColor + lightDot*specularColor + ambientWeight*baseColor)/weightSum;
    gl_FragColor = litColor;
  }
`;

class Pair {
  constructor(faceRenderer, left, right) {
    this.gl = faceRenderer.gl;
    this.faceRenderer = faceRenderer;

    let sphere = Icosphere(3);
    this.geometry = createGeometry(this.gl)
      .attr('position', sphere.positions)
      .attr('normal', normals.vertexNormals(sphere.cells, sphere.positions))
      .faces(sphere.cells);
    this.shader = createShader(this.gl, eyeVS, eyeFS);
    this.irisColor = vec4.fromValues(0.3, 0.2, 0.1, 1);

    this.lookAtRadius = 100;
    this.lookAt = vec3.fromValues(0, 0, -this.lookAtRadius);
    this.scale = _.times(3, () => 0.35);
    this.world = mat4.create();
    this.right = right;
    this.left = left;
    this.lookAtAngle = 0;
     
    this._changeGaze();
    this._saccade();
  }

  _changeGaze() {
    this.lookAtAngle = Math.PI*(Math.random() - 0.5)/3;
    this._updateLookAt();
    setTimeout(()=> this._changeGaze(), _.random(2000, 5000));
  }

  _saccade() {
    let adjustment = Math.PI*(Math.random()-0.5)/32;
    this.lookAtAngle += adjustment;
    this._updateLookAt();
    setTimeout(()=> this._changeGaze(), _.random(10, 200));
  }

  _updateLookAt() {
    let { lookAtAngle, lookAtRadius, faceRenderer } = this;
    let x = lookAtRadius*Math.sin(lookAtAngle);
    let z = -lookAtRadius*Math.cos(lookAtAngle);
    vec3.set(this.lookAt, x, 0, z);
    faceRenderer.requestFrame();
  }

  draw() {
    let { left, right, geometry, shader, faceRenderer: {
      projection, view, lightPosition0, lightPosition1,
      ambientColor, specularColor, diffuseColor
    } } = this;
    let { uniforms } = shader;

    geometry.bind(shader);
    uniforms.view = view;
    uniforms.projection = projection;
    uniforms.lightPosition0 = lightPosition0;
    uniforms.lightPosition1 = lightPosition1;
    uniforms.ambientColor = ambientColor;
    uniforms.specularColor = specularColor;
    uniforms.diffuseColor = diffuseColor;
    uniforms.irisColor = this.irisColor;
    uniforms.radius = this.scale[0];
    uniforms.lookAt = this.lookAt;

    for (let center of [left, right]) {
      mat4.identity(this.world);
      mat4.translate(this.world, this.world, center);
      mat4.scale(this.world, this.world, this.scale);
      uniforms.world = this.world;
      uniforms.eyeCenter = center;
      geometry.draw();
    }
  }
}

module.exports = { Pair };

