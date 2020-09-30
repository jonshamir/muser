/** @jsx h */
const { h, Component } = require("preact");
const BaseComponent = require("../../components/BaseComponent/BaseComponent");
const classnames = require("classnames");
const animate = require("@jam3/gsap-promise");

const { player } = require("../../context");
const genreTags = require("../../music-data/genres.json");

const MaterialButton = require("../../components/MaterialButton/MaterialButton");
const Header = require("../../components/Header/Header");

function compareGenres(a, b) {
  if (a.value > b.value) return -1;
  if (b.value > a.value) return 1;

  return 0;
}

class Muser extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
    };
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

  formatTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
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

    const currentGenres = genreTags.map((genre) => ({
      title: genre.title,
      color: genre.color,
      // value: this.props.nowPlaying.tags[genre.title],
      value: {},
    }));

    // console.log(this.props.nowPlaying.tags);

    currentGenres.sort(compareGenres);

    const topGenres = currentGenres.slice(0, 5);

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
          {player.nowPlaying.title} | {player.currentTime} / {player.duration}
          <br />
          {/*topGenres.map((genre) => (
            <div style={{ color: genre.color }}>
              {genre.title}:
              {Math.floor(this.props.nowPlaying.tags[genre.title] * 100)}
            </div>
          ))*/}
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
