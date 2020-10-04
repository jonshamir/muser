const { gui, webgl, assets } = require("../../context");
const particleShader = require("../shaders/particle.shader");

module.exports = class Particles extends THREE.Mesh {
  constructor(numParticles, radius) {
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
    geometry.addAttribute("position", positions);

    // uvs
    const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
    uvs.setXYZ(0, 0.0, 0.0);
    uvs.setXYZ(1, 1.0, 0.0);
    uvs.setXYZ(2, 0.0, 1.0);
    uvs.setXYZ(3, 1.0, 1.0);
    geometry.addAttribute("uv", uvs);

    // index
    geometry.setIndex(
      new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
    );

    const indices = new Uint16Array(this.numParticles);
    const offsets = new Float32Array(this.numParticles * 3);
    const angles = new Float32Array(this.numParticles);

    for (let i = 0; i < this.numParticles; i++) {
      offsets[i * 3 + 0] = this.radius * (Math.random() * 2 - 1);
      offsets[i * 3 + 1] = this.radius * (Math.random() * 2 - 1);
      offsets[i * 3 + 2] = this.radius * (Math.random() * 2 - 1);

      indices[i] = i;

      angles[i] = Math.random() * Math.PI;
    }

    geometry.addAttribute(
      "pindex",
      new THREE.InstancedBufferAttribute(indices, 1, false)
    );
    geometry.addAttribute(
      "offset",
      new THREE.InstancedBufferAttribute(offsets, 3, false)
    );
    geometry.addAttribute(
      "angle",
      new THREE.InstancedBufferAttribute(angles, 1, false)
    );

    const uniforms = {
      uTime: { value: 0 },
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
