// Audio
const createPlayer = require("web-audio-player");
const createAnalyser = require("web-audio-analyser");

const songTags = require("../music-data/bohemian-rhapsody.json");

class AudioPlayer {
  constructor(opt = {}) {
    this._renderer = opt.renderer;
    this.isPlaying = false;
    this.audioLoaded = false;

    this.numFrequencyBins = 64;
    this.tagDuration = 1;

    this.nowPlaying = {
      title: "-",
      currentTime: 0,
      duration: 0,
    };
    this.audioPlayer = null;
    this.audioUtil = null;

    this._loadAudio();
  }

  play() {
    this.isPlaying = true;
    this.audioPlayer.play();
  }

  pause() {
    this.isPlaying = false;
    this.audioPlayer.pause();
  }

  updateNowPlaying() {
    if (this.state.nowPlaying.audio) {
      const currentTime = this.state.nowPlaying.audio.currentTime; // In seconds
      const currentTagsIndex = Math.floor(currentTime / this.props.tagDuration);
      const currentTags = objectMap(
        songTags,
        (tagList) => tagList[currentTagsIndex]
      );
      this.setState({
        nowPlaying: {
          ...this.state.nowPlaying,
          currentTime,
          tags: currentTags,
        },
      });
      // console.log(currentTags);
    }
  }

  _loadAudio() {
    const song = {
      id: "bohemian-rhapsody",
    };
    const player = createPlayer(`assets/music/${song.id}.mp3`);

    const audioUtil = createAnalyser(player.node, player.context, {
      stereo: false,
    });

    audioUtil.analyser.fftSize = this.numFrequencyBins * 2;

    player.on("load", () => {
      console.log("Audio loaded...");
      this.audioLoaded = true;

      player.node.connect(player.context.destination);
      this.nowPlaying = {
        title: song.id,
        currentTime: 0,
        duration: player.duration,
      };
      this.audioPlayer = player;
      this.audioUtil = audioUtil;
    });
  }
}

module.exports = AudioPlayer;
