/** @jsx h */
const { h, Component } = require("preact");
const BaseComponent = require("../components/BaseComponent/BaseComponent");
const classnames = require("classnames");
const animate = require("@jam3/gsap-promise");
const PreactTransitionGroup = require("preact-transition-group");

// Audio
const createPlayer = require("web-audio-player");
const createAnalyser = require("web-audio-analyser");

// DOM Sections
const Landing = require("../sections/Landing/Landing");
const Muser = require("../sections/Muser/Muser");
const Preloader = require("../sections/Preloader/Preloader");

// WebGL canvas component
const WebGLCanvas = require("../components/WebGLCanvas/WebGLCanvas");

// WebGL scenes
// const Honeycomb = require("../webgl/scene/Honeycomb");
const Visualizer = require("../webgl/scene/Visualizer");

const { assets, webgl } = require("../context");

class App extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      isAltMaterial: false,
      section: "Preloader",
      isPlaying: false,
      nowPlaying: null,
    };
  }

  handlePreventDefault = (ev) => {
    ev.preventDefault();
  };

  componentDidUpdate(oldProps, oldState) {
    if (this.state.isLoaded && oldState.isLoaded !== this.state.isLoaded) {
      // start animation loop
      webgl.start();

      // draw a frame so that its correct on first DOM render
      webgl.draw();

      // trigger initial animation in of content
      webgl.animateIn({ delay: 0.5 });
    }

    // propagate through entire scene graph any app changes
    webgl.onAppDidUpdate(oldProps, oldState, this.props, this.state);
  }

  componentDidMount() {
    // To avoid page pulling, text highlighting and such
    webgl.canvas.addEventListener("touchstart", this.handlePreventDefault);
    webgl.canvas.addEventListener("mousedown", this.handlePreventDefault);

    this.loadAudio();
    this.loadWebGL();
  }

  componentWillUnmount() {
    webgl.canvas.removeEventListener("touchstart", this.handlePreventDefault);
    webgl.canvas.removeEventListener("mousedown", this.handlePreventDefault);
  }

  loadAudio() {
    const song = {
      url: "assets/music/hotel-california.mp3",
      title: "Hotel California",
    };
    const player = createPlayer(song.url);

    const audioUtil = createAnalyser(player.node, player.context, {
      stereo: false,
    });

    player.on("load", () => {
      console.log("Audio loaded...");
      player.node.connect(player.context.destination);
      this.setState({
        nowPlaying: {
          title: "Hotel California",
          audio: player,
          audioUtil: audioUtil,
        },
      });
    });
  }

  loadWebGL() {
    // Preload any queued assets
    assets.loadQueued(() => {
      // Do some fake delay for demo purposes
      setTimeout(() => {
        // Once loading is complete, swap to Muser section and ensure WebGL displays
        this.setState({
          section: "Muser",
          isLoaded: true,
        });
      }, this.props.fakePreloadTime);

      // Add any "WebGL components" here...
      webgl.scene.add(new Visualizer());
    });
  }

  handelMaterialSwap = () => {
    this.setState({ isAltMaterial: !this.state.isAltMaterial });
  };

  handleToggleAudio = () => {
    if (this.state.isPlaying) this.state.nowPlaying.audio.pause();
    else this.state.nowPlaying.audio.play();

    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  };

  getContent(section) {
    // You are probably better off using a real "Router" for history push etc.
    // NB: Ensure there is a 'key' attribute so transition group can create animations
    switch (section) {
      case "Preloader":
        return <Preloader key="Preloader" />;

      default:
      case "Landing":
        return (
          <Landing key="Landing" onMaterialSwap={this.handelMaterialSwap} />
        );
      case "Muser":
        return (
          <Muser
            key="Muser"
            onTogglePlay={this.handleToggleAudio}
            isPlaying={this.state.isPlaying}
          />
        );
    }
  }

  render() {
    const classes = classnames({
      App: true,
    });

    const section = this.state.section;
    const content = this.getContent(section);

    // Render the WebGL if loaded
    // And also render the current UI section on top, with transitions
    return (
      <div
        className={classes}
        ref={(c) => {
          this.container = c;
        }}
      >
        {this.state.isLoaded && <WebGLCanvas />}
        <PreactTransitionGroup className="content">
          {content}
        </PreactTransitionGroup>
      </div>
    );
  }
}

App.defaultProps = {
  // Artificially inflate preload time so
  // we can see it for demo purposes
  fakePreloadTime: 1250,
};

module.exports = App;
