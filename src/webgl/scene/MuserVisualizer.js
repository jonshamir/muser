const { gui, webgl, assets } = require("../../context");

const LiveShaderMaterial = require("../materials/LiveShaderMaterial");
const honeyShader = require("../shaders/honey.shader");
const animate = require("@jam3/gsap-promise");

const frequencyAverage = require("analyser-frequency-average");

// tell the preloader to include this asset
// we need to define this outside of our class, otherwise
// it won't get included in the preloader until *after* its done loading
// const gltfKey = assets.queue({
//   url: "assets/models/honeycomb.gltf",
// });

module.exports = class MuserVisualizer extends THREE.Object3D {
  constructor() {
    super();

    // Audio properties
    this.nowPlaying = null;
    this.frequencyBins = 1;
    this.barMeshes = [];

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

  createVisualizerMeshes() {
    const totalWidth = 2.5;
    const barSize = totalWidth / (2 * this.frequencyBins);
    for (let i = 0; i < this.frequencyBins; i++) {
      const geometry = new THREE.BoxGeometry(barSize, 1, barSize);
      const material = new THREE.MeshLambertMaterial();
      const bar = new THREE.Mesh(geometry, material);
      bar.translateX(2 * i * barSize - 0.5 * totalWidth);

      this.barMeshes.push(bar);
      this.add(bar);
    }
  }

  onAppDidUpdate(oldProps, oldState, newProps, newState) {
    const material = this.altMaterial;
    this.children.forEach((child) => {
      child.material = material;
    });

    if (newState.nowPlaying.audio) {
      this.nowPlaying = newState.nowPlaying;
      if (this.frequencyBins != newProps.frequencyBins) {
        this.frequencyBins = newProps.frequencyBins;
        this.createVisualizerMeshes();
      }
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
    this.rotation.x += dt * 0.5;
    this.material.uniforms.time.value = time;

    // grab our byte frequency data for this frame
    const { audioUtil } = this.nowPlaying;
    const frequencies = audioUtil.frequencies();

    // find an average signal between two Hz ranges
    // const minHz = 40;
    // const maxHz = 100;
    // let avg = frequencyAverage(audioUtil.analyser, frequencies, minHz, maxHz);
    // avg = avg ? avg : 0.001;
    // this.scale.y = avg;

    frequencies.forEach((item, i) => {
      this.barMeshes[i].scale.y = item ? item * 0.005 : 0.001;
    });
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
