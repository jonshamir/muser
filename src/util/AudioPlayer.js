// Audio
const createPlayer = require("web-audio-player");
const createAnalyser = require("web-audio-analyser");
const chroma = require("chroma-js");

const genreTags = require("../music-data/genres.json");

const songTitle = "lie";
const songTags = require("../music-data/lie.json");

const average = (nums) => nums.reduce((a, b) => a + b) / nums.length;

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
    this.isPlaying = false;

    this._webAudioPlayer = null;
    this._webAudioUtil = null;
    this._audioLoaded = false;
    this._tagDuration = 1;
    this.numFrequencyBins = 64;

    this._nowPlayingData = {
      title: "-",
      tags: [],
      topGenres: [
        { title: "-", color: "#000", weight: 0 },
        { title: "-", color: "#000", weight: 0 },
        { title: "-", color: "#000", weight: 0 },
        { title: "-", color: "#000", weight: 0 },
        { title: "-", color: "#000", weight: 0 },
      ],
      currentTime: -1,
      duration: 0,
    };

    this.playlist = [];

    this._loadAudio();

    // fetch("assets/music-data/rap-god.json")
    //   .then((response) => response.json())
    //   .then((data) => console.log(data));
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

  play() {
    this.isPlaying = true;
    this._webAudioPlayer.play();
  }

  pause() {
    this.isPlaying = false;
    this._webAudioPlayer.pause();
  }

  getCurrentFrequencyData() {
    const frequencies = this._webAudioUtil.frequencies();
    const waveform = this._webAudioUtil.waveform();

    // Compute stats for 4 frequency ranges
    const rangeSize = this.numFrequencyBins / 4;
    let rangeAverage = [0, 0, 0, 0];
    let rangeMax = [0, 0, 0, 0];
    let rangeMin = [255, 255, 255, 255];

    for (var i = 0; i < frequencies.length; i++) {
      const rangeIndex = Math.floor(i / rangeSize);
      rangeAverage[rangeIndex] += frequencies[i] * (1 / rangeSize);
      if (frequencies[i] > rangeMax[rangeIndex])
        rangeMax[rangeIndex] = frequencies[i];
      if (frequencies[i] < rangeMin[rangeIndex])
        rangeMin[rangeIndex] = frequencies[i];
    }

    const data = {
      frequencies,
      total: {
        average: average(rangeAverage),
        max: Math.max(...rangeMax),
        min: Math.min(...rangeMin),
      },
      bass: { average: rangeAverage[0], max: rangeMax[0], min: rangeMin[0] },
      mid: { average: rangeAverage[1], max: rangeMax[1], min: rangeMin[1] },
      treble: { average: rangeAverage[2], max: rangeMax[2], min: rangeMin[2] },
      high: { average: rangeAverage[3], max: rangeMax[3], min: rangeMin[3] },
    };

    return data;
  }

  getNowPlayingData() {
    const currentTime = this._webAudioPlayer.currentTime; // In seconds

    // Update data up to once per second
    if (
      this.isPlaying &&
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

      // Top genres data
      const topGenres = currentGenres.slice(0, 5);
      const genreSum = topGenres.reduce((sum, genre) => ({
        value: sum.value + genre.value,
      })).value;

      let colors = [];
      let weights = [];
      topGenres.forEach((genre, i) => {
        const weight = genre.value / genreSum;
        genre.weight = weight;
        colors.push(genre.color);
        weights.push(weight);
      });
      const topGenresColor = chroma.average(colors, "lab", weights).hex();

      this._nowPlayingData = {
        title: songTitle,
        tags: currentTags,
        topGenres,
        topGenresColor,
        currentTime,
        duration: this._webAudioPlayer.duration,
      };
    }
    return this._nowPlayingData;
  }
}

module.exports = AudioPlayer;
