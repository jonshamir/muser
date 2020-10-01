// Audio
const createPlayer = require("web-audio-player");
const createAnalyser = require("web-audio-analyser");

const genreTags = require("../music-data/genres.json");

const songTitle = "lovin-you";
const songTags = require("../music-data/lovin-you.json");

const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

const compareGenres = (a, b) => {
  if (a.value > b.value) return -1;
  if (b.value > a.value) return 1;
  return 0;
};

class AudioPlayer {
  constructor(opt = {}) {
    this._renderer = opt.renderer;
    this._isPlaying = false;

    this._webAudioPlayer = null;
    this._webAudioUtil = null;
    this._audioLoaded = false;
    this._tagDuration = 1;
    this.numFrequencyBins = 64;

    this._nowPlayingData = {
      title: "-",
      tags: null,
      genres: null,
      time: 0,
      duration: 0,
    };

    this.playlist = [];

    this._loadAudio();

    fetch("assets/music-data/rap-god.json")
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  play() {
    this._isPlaying = true;
    this._webAudioPlayer.play();
  }

  pause() {
    this._isPlaying = false;
    this._webAudioPlayer.pause();
  }

  getCurrentFrequencies() {
    return this._webAudioUtil.frequencies();
  }

  getNowPlayingData() {
    const currentTime = this._webAudioPlayer.currentTime; // In seconds

    // Update data up to once per second
    if (
      Math.floor(currentTime) != Math.floor(this._nowPlayingData.currentTime)
    ) {
      const currentTagsIndex = Math.floor(currentTime / this._tagDuration);
      const currentTags = objectMap(
        songTags,
        (tagList) => tagList[currentTagsIndex]
      );

      // Get all genre tags and sort according to value
      const currentGenres = genreTags.map((genre) => ({
        ...genre,
        value: currentTags[genre.title],
      }));

      currentGenres.sort(compareGenres);

      this._nowPlayingData = {
        title: songTitle,
        tags: currentTags,
        genres: currentGenres,
        time: currentTime,
        duration: this._webAudioPlayer.duration,
      };
    }
    return this._nowPlayingData;
  }

  _loadAudio() {
    const player = createPlayer(`assets/music/${songTitle}.mp3`);

    const audioUtil = createAnalyser(player.node, player.context, {
      stereo: false,
    });

    audioUtil.analyser.fftSize = this.numFrequencyBins * 2;

    player.on("load", () => {
      console.log("Audio loaded...");
      this._audioLoaded = true;

      player.node.connect(player.context.destination);
      this._webAudioPlayer = player;
      this._webAudioUtil = audioUtil;
    });
  }
}

module.exports = AudioPlayer;
