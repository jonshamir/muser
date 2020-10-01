const { gui, webgl, assets, player } = require("../../context");

const LiveShaderMaterial = require("../materials/LiveShaderMaterial");
const honeyShader = require("../shaders/honey.shader");
const animate = require("@jam3/gsap-promise");
const chroma = require("chroma-js");

const frequencyAverage = require("analyser-frequency-average");
const genreTags = require("../../music-data/genres.json");

module.exports = class MuserVisualizer extends THREE.Object3D {
  constructor() {
    super();

    // Visualization properties
    this.visualizationWidth = 2.5;
    this.createdMeshes = false;
    this.barMeshes = [];
    this.genreMeshes = {};
    this.prevBG = "#000000";
    this.currBG = "#000000";

    // Shader setup
    this.material = new LiveShaderMaterial(honeyShader, {
      transparent: true,
      uniforms: {
        alpha: { value: 0 },
        time: { value: 0 },
        colorA: { value: new THREE.Color("rgb(213,70,70)") },
        colorB: { value: new THREE.Color("rgb(223,191,86)") },
      },
    });

    this.altMaterial = new THREE.MeshLambertMaterial();

    this.children = [];

    if (gui) {
      // assume it can be falsey, e.g. if we strip dat-gui out of bundle
      // attach dat.gui stuff here as usual
      const folder = gui.addFolder("visualizer");
      const settings = {
        colorA: this.material.uniforms.colorA.value.getStyle(),
        colorB: this.material.uniforms.colorB.value.getStyle(),
      };
      const update = () => {
        this.material.uniforms.colorA.value.setStyle(settings.colorA);
        this.material.uniforms.colorB.value.setStyle(settings.colorB);
      };
      folder.addColor(settings, "colorA").onChange(update);
      folder.addColor(settings, "colorB").onChange(update);
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

  createGenreMeshes() {
    const totalWidth = this.visualizationWidth;
    const meshSize = totalWidth / genreTags.length;

    genreTags.forEach((genre, i) => {
      const geometry = new THREE.BoxGeometry(1, meshSize, meshSize);
      const material = new THREE.MeshBasicMaterial({ color: genre.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.translateX(i * meshSize - 0.5 * totalWidth);
      mesh.translateY(-0.4);

      this.genreMeshes[genre.title] = mesh;
      this.add(mesh);
    });
  }

  onAppDidUpdate(oldProps, oldState, newProps, newState) {
    const material = this.altMaterial;
    this.children.forEach((child) => {
      child.material = material;
    });

    if (!this.createdMeshes) {
      this.createFrequencyMeshes();
      this.createGenreMeshes();
      this.createdMeshes = true;
    }
  }

  animateIn(opt = {}) {
    animate.to(this.material.uniforms.alpha, 2.0, {
      ...opt,
      value: 1,
    });
    animate.fromTo(
      this.rotation,
      2.0,
      {
        x: -Math.PI / 4,
      },
      {
        ...opt,
        x: 0,
        ease: Expo.easeOut,
      }
    );
  }

  update(dt = 0, time = 0) {
    // This function gets propagated down from the WebGL app to all children
    this.material.uniforms.time.value = time;

    // Visualize frequencies
    const frequencies = player.getCurrentFrequencies();

    frequencies.forEach((item, i) => {
      this.barMeshes[i].scale.y = item ? item * 0.005 : 0.001;
    });

    // Visualize genres
    const totalWidth = this.visualizationWidth;

    const nowPlayingData = player.getNowPlayingData();
    const topGenres = nowPlayingData.genres.slice(0, 5);

    // Hide all genres off-screen
    for (const genre in this.genreMeshes) {
      this.genreMeshes[genre].position.x = 100;
    }

    // Show & scale top genres
    const genreSum = topGenres.reduce((sum, genre) => ({
      value: sum.value + genre.value,
    })).value;

    let currPosX = 0;
    let colors = [];
    let weights = [];
    topGenres.forEach((genre, i) => {
      const weight = genre.value / genreSum;
      const width = totalWidth * weight;
      this.genreMeshes[genre.title].scale.x = width;
      this.genreMeshes[genre.title].position.x =
        currPosX + 0.5 * width - 0.5 * totalWidth;
      currPosX += width;

      colors.push(genre.color);
      weights.push(weight);
    });

    // Background color
    const averageColor = chroma.average(colors, "lab", weights).hex();
    if (averageColor != this.currBG) {
      this.prevBG = this.currBG;
      this.currBG = averageColor;
    }

    const a = player._webAudioPlayer.currentTime % 1;
    const currColor = chroma.average([this.prevBG, this.currBG], "lab", [
      1 - a,
      a,
    ]);

    webgl.renderer.setClearColor(currColor.hex(), 1);
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
