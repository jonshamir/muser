// Audio
const createPlayer = require("web-audio-player");
const createAnalyser = require("web-audio-analyser");
const chroma = require("chroma-js");

const genreTags = require("../data/genres.json");
const playlist = require("../data/playlist.json");

// Helper functions
const average = (nums) => nums.reduce((a, b) => a + b) / nums.length;

const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

const compareGenres = (a, b) => {
  if (a.value > b.value) return -1;
  if (b.value > a.value) return 1;
  return 0;
};

const defaultNowPlayingData = {
  title: "-",
  artist: "-",
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

class AudioPlayer {
  constructor(opt = {}) {
    this._renderer = opt.renderer;
    this.isPlaying = false;
    this.playlist = playlist;
    this._currentTrack = null;
    this._currentTrackTags = null;

    this._webAudioPlayer = null;
    this._webAudioUtil = null;
    this._audioLoaded = false;
    this._tagDuration = 1;
    this.numFrequencyBins = 64;

    this._nowPlayingData = defaultNowPlayingData;

    this._loadTrack(playlist[0]);
  }

  async _loadTrack(track) {
    this._currentTrack = track;
    this._webAudioPlayer = createPlayer(track.path);

    this._webAudioUtil = createAnalyser(
      this._webAudioPlayer.node,
      this._webAudioPlayer.context,
      {
        stereo: false,
      }
    );

    this._webAudioUtil.analyser.fftSize = this.numFrequencyBins * 2;

    await this._loadMP3();

    return fetch(`assets/music-tags/${track.id}.json`)
      .then((response) => response.json())
      .then((data) => {
        this._currentTrackTags = data;
      });
  }

  _loadMP3() {
    return new Promise((resolve, reject) => {
      this._webAudioPlayer.on("load", () => {
        this._audioLoaded = true;

        this._webAudioPlayer.node.connect(
          this._webAudioPlayer.context.destination
        );
        this._nowPlayingData.title = this._currentTrack.title;
        this._nowPlayingData.artist = this._currentTrack.artist;
        resolve();
      });
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

  seek(percentage) {}

  switchTrack(trackId) {
    this.pause();
    const track = this.playlist.find((track) => track.id === trackId);
    return this._loadTrack(track);
  }

  getCurrentTime() {
    return this._webAudioPlayer.currentTime;
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

  getDefaultNowPlayingData() {
    return defaultNowPlayingData;
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
        this._currentTrackTags,
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
        title: this._currentTrack.title,
        artist: this._currentTrack.artist,
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
