/** @jsx h */
const { h, Component } = require("preact");
const BaseComponent = require("../../components/BaseComponent/BaseComponent");
const classnames = require("classnames");
const animate = require("@jam3/gsap-promise");

const { player } = require("../../context");
const genreTags = require("../../music-data/genres.json");

const MaterialButton = require("../../components/MaterialButton/MaterialButton");
const Header = require("../../components/Header/Header");

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

class Muser extends BaseComponent {
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
    if (Math.floor(nowPlaying.time) != Math.floor(this.state.nowPlaying.time)) {
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
        <div class="text">
          {nowPlaying.title} | {formatTime(nowPlaying.time)} /{" "}
          {formatTime(nowPlaying.duration)}
          <br />
          {nowPlaying.genres.slice(0, 5).map((genre) => (
            <div style={{ color: genre.color }}>
              {genre.title}:{Math.floor(nowPlaying.tags[genre.title] * 100)}
            </div>
          ))}
        </div>
        <MaterialButton
          onClick={this.handleToggleAudio}
          ref={(c) => {
            this.button = c;
          }}
        >
          {this.state.isPlaying ? "pause" : "play"}
        </MaterialButton>
      </div>
    );
  }
}

Muser.defaultProps = {
  onPlay: () => {},
};

module.exports = Muser;
