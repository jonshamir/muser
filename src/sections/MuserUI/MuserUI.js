/** @jsx h */
const { h, Component } = require("preact");
const BaseComponent = require("../../components/BaseComponent/BaseComponent");
const classnames = require("classnames");
const animate = require("@jam3/gsap-promise");

const { player } = require("../../context");

const MaterialButton = require("../../components/MaterialButton/MaterialButton");
const Header = require("../../components/Header/Header");

const formatTime = (seconds) => {
  if (seconds < 0) return "-";
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};

class MuserUI extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      nowPlaying: player.getNowPlayingData(),
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
    }
  }

  handleToggleAudio = () => {
    if (this.state.isPlaying) player.pause();
    else player.play();

    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  };

  render() {
    const classes = classnames({
      Muser: true,
    });

    const { nowPlaying } = this.state;

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
          <ul>
            {player.playlist.map((track) => (
              <li>{track.title}</li>
            ))}
          </ul>
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
              {this.state.isPlaying ? "pause" : "play"}
            </MaterialButton>
          </div>
          <strong>{nowPlaying.title}</strong>
          <br />
          {nowPlaying.artist}
          <br /> <br />
          {nowPlaying.topGenres.map((genre) => (
            <div>
              <div className="genreTag">
                {genre.title} <strong>{Math.floor(genre.weight * 100)}%</strong>
              </div>
              <div
                class="genreBar"
                style={{
                  backgroundColor: genre.color,
                  width: `${genre.weight * 80}%`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

MuserUI.defaultProps = {
  onPlay: () => {},
};

module.exports = MuserUI;
