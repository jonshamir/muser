const WebGLApp = require("./webgl/WebGLApp");
const AssetManager = require("./util/AssetManager");
const AudioPlayer = require("./util/AudioPlayer");
const query = require("./util/query");
const dat = require("./vendor/dat.gui");

// Setup dat.gui
const gui = new dat.GUI();

if (!query.gui) {
  document.querySelector(".dg.ac").style.display = "none";
}

// Create a canvas
const canvas = document.createElement("canvas");

// Setup the WebGLRenderer
const webgl = new WebGLApp({
  background: "white",
  canvas,
});

// Setup an asset manager
const assets = new AssetManager({
  renderer: webgl.renderer,
});

const player = new AudioPlayer();

module.exports = {
  assets,
  canvas,
  webgl,
  gui,
  player,
};
