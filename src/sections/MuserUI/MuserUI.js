/** @jsx h */
const { h, Component } = require("preact");
const BaseComponent = require("../../components/BaseComponent/BaseComponent");
const classnames = require("classnames");
const animate = require("@jam3/gsap-promise");

const { player } = require("../../context");

const MaterialButton = require("../../components/MaterialButton/MaterialButton");
const Header = require("../../components/Header/Header");
const GenreGraph = require("../../components/GenreGraph/GenreGraph");
const SeekBar = require("../../components/SeekBar/SeekBar");

const formatTime = (seconds) => {
  if (seconds < 0) return "-";
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};

const getTrackPercentage = (currentTime, duration) => {
  if (currentTime < 0) return 0;
  return (100 * currentTime) / duration;
};

class MuserUI extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      nowPlaying: player.getNowPlayingData(),
      currentTime: 0,
    };
  }

  componentDidMount() {
    // Update song data
    setInterval(() => {
      this.updateNowPlaying();
    }, 200);
  }

  animateIn() {
    return Promise.all([
      this.header.animateIn({ delay: 0.25 }),
      this.button.animateIn({ delay: 0.5 }),
    ]);
  }

  animateOut() {
    return Promise.all([this.header.animateOut()]);
  }

  updateNowPlaying() {
    const nowPlaying = player.getNowPlayingData();
    if (
      Math.floor(nowPlaying.currentTime) !=
      Math.floor(this.state.nowPlaying.currentTime)
    ) {
      this.setState({ nowPlaying });
    } else if (this.state.isPlaying) {
      this.setState({ currentTime: player.getCurrentTime() });
    }
  }

  handleToggleAudio = () => {
    if (this.state.isPlaying) player.pause();
    else player.play();

    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  };

  handleSwitchTrack = ({ target }) => {
    player.pause();
    const trackId = target.value;
    player.switchTrack(trackId);
    this.setState({
      isPlaying: false,
    });
  };

  render() {
    const classes = classnames({
      Muser: true,
    });

    const { nowPlaying, currentTime, isPlaying } = this.state;

    return (
      <div
        className={classes}
        ref={(c) => {
          this.container = c;
        }}
      >
        <Header
          ref={(c) => {
            this.header = c;
          }}
        >
          Muser
        </Header>
        <div class="playlist">
          <select
            name="playlist"
            id="playlist"
            onChange={this.handleSwitchTrack}
          >
            {player.playlist.map((track) => (
              <option key={track.id} value={track.id}>
                {track.title}
              </option>
            ))}
          </select>
        </div>
        <div class="ui-wrapper">
          <div class="controls">
            {formatTime(nowPlaying.currentTime)} /{" "}
            {formatTime(nowPlaying.duration)}
            <MaterialButton
              onClick={this.handleToggleAudio}
              ref={(c) => {
                this.button = c;
              }}
            >
              {isPlaying ? "pause" : "play"}
            </MaterialButton>
          </div>
          <strong>{nowPlaying.title}</strong>
          <br />
          {nowPlaying.artist}
          <br />
          <SeekBar
            value={getTrackPercentage(currentTime, nowPlaying.duration)}
          />
          <GenreGraph genres={nowPlaying.topGenres} />
        </div>
      </div>
    );
  }
}

MuserUI.defaultProps = {
  onPlay: () => {},
};

module.exports = MuserUI;
