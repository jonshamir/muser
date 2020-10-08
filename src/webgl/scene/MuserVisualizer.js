const { gui, webgl, assets, player } = require("../../context");

const LiveShaderMaterial = require("../materials/LiveShaderMaterial");
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
const Particles = require("./Particles");
const animate = require("@jam3/gsap-promise");
const chroma = require("chroma-js");

function getPointOnSphere(radius) {
  var u = Math.random();
  var v = Math.random();
  var theta = 2 * Math.PI * u;
  var phi = Math.acos(2 * v - 1);
  var x = radius * Math.sin(phi) * Math.cos(theta);
  var y = radius * Math.sin(phi) * Math.sin(theta);
  var z = radius * Math.cos(phi);
  return [x, y, z];
}

module.exports = class MuserVisualizer extends THREE.Object3D {
  constructor() {
    super();

    // Visualization properties
    this.visualizationWidth = 2.5;
    this.createdMeshes = false;
    this.prevBG = "#ffffff";
    this.currBG = "#ffffff";
    this.particlesBass = null;
    this.particlesMid = null;
    this.particlesTreble = null;

    this.lineMeshes = [];
    this.lineMaterial = new MeshLineMaterial({
      useMap: false,
      color: "#000000",
      opacity: 1,
      resolution: new THREE.Vector2(webgl.width, webgl.height),
      sizeAttenuation: false,
      lineWidth: 10,
      transparent: true,
      depthTest: false,
    });

    this.children = [];

    window.addEventListener("resize", () => this.onWindowResize());

    if (gui) {
      // assume it can be falsey, e.g. if we strip dat-gui out of bundle
      // attach dat.gui stuff here as usual
      const folder = gui.addFolder("visualizer");
      folder.open();
    }
  }

  createParticles() {
    this.particlesBass = new Particles(8, 1.2);
    this.particlesMid = new Particles(14, 2.0, 0.8);
    this.particlesTreble = new Particles(100, 3.5, 3);

    this.add(this.particlesBass);
    this.add(this.particlesMid);
    this.add(this.particlesTreble);
  }

  createLines() {
    const radius = 2;
    const numLines = 10;

    for (var i = 0; i < numLines; i++) {
      const points = [];
      points.push(...getPointOnSphere(radius));
      points.push(...getPointOnSphere(radius));
      const line = new MeshLine();
      line.setPoints(points);

      const meshLine = new THREE.Mesh(line, this.lineMaterial);
      this.add(meshLine);
      this.lineMeshes.push(meshLine);
    }
  }

  onWindowResize() {
    this.lineMaterial.resolution = new THREE.Vector2(webgl.width, webgl.height);
  }

  onAppDidUpdate(oldProps, oldState, newProps, newState) {
    if (!this.createdMeshes) {
      // this.createFrequencyMeshes();
      this.createParticles();
      this.createLines();
      this.createdMeshes = true;
    }
  }

  update(dt = 0, time = 0) {
    if (player.isPlaying) {
      // Get data
      const {
        frequencies,
        total,
        bass,
        mid,
        treble,
        high,
      } = player.getCurrentFrequencyData();
      const nowPlayingData = player.getNowPlayingData();

      const topGenresColor = nowPlayingData.topGenresColor;

      // Interpolate background color from the previous second
      if (topGenresColor != this.currBG) {
        this.prevBG = this.currBG;
        this.currBG = topGenresColor;
      }

      const a = player.getCurrentTime() % 1;
      const genreColor = chroma.average([this.prevBG, this.currBG], "lab", [
        1 - a,
        a,
      ]);

      // const bgColor = genreColor.brighten((2 * bass.average) / 255);

      webgl.renderer.setClearColor(genreColor.hex(), 1);

      // Particles
      this.particlesBass.material.uniforms.uSize.value =
        0.3 + 0.35 * (bass.average / 255);
      this.particlesBass.material.uniforms.uColor.value = new THREE.Vector4(
        ...genreColor.darken(1).alpha(0.8).gl()
      );

      this.particlesMid.material.uniforms.uSize.value =
        0.1 + 0.1 * (mid.average / 255);
      this.particlesMid.material.uniforms.uColor.value = new THREE.Vector4(
        ...genreColor.darken(2.5).alpha(0.7).gl()
      );

      this.particlesTreble.material.uniforms.uSize.value =
        0.01 + 0.05 * (treble.average / 255);
      this.particlesTreble.material.uniforms.uColor.value = new THREE.Vector4(
        ...genreColor.brighten(2).alpha(0.9).gl()
      );
    }
    // Rotate all the scene
    this.rotation.y += dt * 0.1;
  }
};
