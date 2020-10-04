const { gui, webgl, assets, player } = require("../../context");

const LiveShaderMaterial = require("../materials/LiveShaderMaterial");
const Particles = require("./Particles");
const animate = require("@jam3/gsap-promise");
const chroma = require("chroma-js");

module.exports = class MuserVisualizer extends THREE.Object3D {
  constructor() {
    super();

    // Visualization properties
    this.visualizationWidth = 2.5;
    this.createdMeshes = false;
    this.barMeshes = [];
    this.prevBG = "#ffffff";
    this.currBG = "#ffffff";
    this.particlesBass = null;
    this.particlesMid = null;
    this.particlesTreble = null;

    this.children = [];

    if (gui) {
      // assume it can be falsey, e.g. if we strip dat-gui out of bundle
      // attach dat.gui stuff here as usual
      const folder = gui.addFolder("visualizer");
      folder.open();
    }
  }

  createFrequencyMeshes() {
    const totalWidth = this.visualizationWidth;
    const barSize = totalWidth / (2 * player.numFrequencyBins);
    for (let i = 0; i < player.numFrequencyBins; i++) {
      const geometry = new THREE.BoxGeometry(barSize, 1, barSize);
      const material = new THREE.MeshLambertMaterial();
      const bar = new THREE.Mesh(geometry, material);
      bar.translateX(2 * i * barSize - 0.5 * totalWidth);
      bar.translateY(0.6);

      this.barMeshes.push(bar);
      this.add(bar);
    }
  }

  createParticles() {
    this.particlesBass = new Particles(5, 1);
    this.particlesMid = new Particles(10, 2);
    this.particlesTreble = new Particles(1000, 3);

    this.particlesBass.material.uniforms.uColor.value = new THREE.Vector4(
      0,
      0,
      0,
      0.8
    );
    this.particlesMid.material.uniforms.uColor.value = new THREE.Vector4(
      0,
      0,
      0,
      0.5
    );
    this.particlesTreble.material.uniforms.uColor.value = new THREE.Vector4(
      1,
      1,
      1,
      0.5
    );

    this.add(this.particlesBass);
    this.add(this.particlesMid);
    this.add(this.particlesTreble);
  }

  onAppDidUpdate(oldProps, oldState, newProps, newState) {
    if (!this.createdMeshes) {
      // this.createFrequencyMeshes();
      this.createParticles();
      this.createdMeshes = true;
    }
  }

  update(dt = 0, time = 0) {
    this.rotation.y += dt * 0.1;

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

      // Edit scene
      // frequencies.forEach((item, i) => {
      //   this.barMeshes[i].scale.y = item ? item * 0.005 : 0.001;
      // });

      this.particlesBass.material.uniforms.uSize.value =
        0.3 + 0.3 * (bass.average / 255);

      this.particlesMid.material.uniforms.uSize.value =
        0.1 + 0.1 * (mid.average / 255);

      this.particlesTreble.material.uniforms.uSize.value =
        0.01 + 0.05 * (treble.average / 255);

      // console.log(total.average / 255);

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
    }
  }

  onTouchStart(ev, pos) {
    const [x, y] = pos;
    console.log("Touchstart / mousedown: (%d, %d)", x, y);

    // For example, raycasting is easy:
    const coords = new THREE.Vector2().set(
      (pos[0] / webgl.width) * 2 - 1,
      (-pos[1] / webgl.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(coords, webgl.camera);
    const hits = raycaster.intersectObject(this, true);
    console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : "No hit");
  }

  onTouchMove(ev, pos) {}

  onTouchEnd(ev, pos) {}
};
