const { gui, webgl, assets } = require("../../context");
const particleShader = require("../shaders/particle.shader");

function getPointInSphere() {
  var u = Math.random();
  var v = Math.random();
  var theta = u * 2.0 * Math.PI;
  var phi = Math.acos(2.0 * v - 1.0);
  var r = Math.cbrt(Math.random());
  var sinTheta = Math.sin(theta);
  var cosTheta = Math.cos(theta);
  var sinPhi = Math.sin(phi);
  var cosPhi = Math.cos(phi);
  var x = r * sinPhi * cosTheta;
  var y = r * sinPhi * sinTheta;
  var z = r * cosPhi;
  return { x: x, y: y, z: z };
}

module.exports = class Particles extends THREE.Mesh {
  constructor(numParticles, radius, timeScale = 0) {
    super();

    this.numParticles = numParticles;
    this.radius = radius;

    const geometry = new THREE.InstancedBufferGeometry();

    // positions
    const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
    positions.setXYZ(0, -0.5, 0.5, 0.0);
    positions.setXYZ(1, 0.5, 0.5, 0.0);
    positions.setXYZ(2, -0.5, -0.5, 0.0);
    positions.setXYZ(3, 0.5, -0.5, 0.0);
    geometry.setAttribute("position", positions);

    // uvs
    const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
    uvs.setXYZ(0, 0.0, 0.0);
    uvs.setXYZ(1, 1.0, 0.0);
    uvs.setXYZ(2, 0.0, 1.0);
    uvs.setXYZ(3, 1.0, 1.0);
    geometry.setAttribute("uv", uvs);

    // index
    geometry.setIndex(
      new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
    );

    const indices = new Uint16Array(this.numParticles);
    const offsets = new Float32Array(this.numParticles * 3);
    const angles = new Float32Array(this.numParticles);

    for (let i = 0; i < this.numParticles; i++) {
      const pos = getPointInSphere();
      offsets[i * 3 + 0] = this.radius * pos.x;
      offsets[i * 3 + 1] = this.radius * pos.y;
      offsets[i * 3 + 2] = this.radius * pos.z;

      indices[i] = i;

      angles[i] = Math.random() * Math.PI;
    }

    geometry.setAttribute(
      "pindex",
      new THREE.InstancedBufferAttribute(indices, 1, false)
    );
    geometry.setAttribute(
      "offset",
      new THREE.InstancedBufferAttribute(offsets, 3, false)
    );
    geometry.setAttribute(
      "angle",
      new THREE.InstancedBufferAttribute(angles, 1, false)
    );

    const uniforms = {
      uTime: { value: 0 },
      uTimeScale: { value: timeScale },
      uRandom: { value: 1.0 },
      uDepth: { value: 2.0 },
      uSize: { value: 0.1 },
      uColor: { value: new THREE.Vector4(0, 0, 0, 1.0) },
    };

    const material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: particleShader.vertex,
      fragmentShader: particleShader.fragment,
      depthTest: false,
      transparent: true,
      blending: THREE.NormalBlending,
    });

    this.geometry = geometry;
    this.material = material;
  }

  onAppDidUpdate(oldProps, oldState, newProps, newState) {}

  update(dt = 0, time = 0) {
    this.material.uniforms.uTime.value += dt;
  }
};
