/** @jsx h */
const { h } = require("preact");
const classnames = require("classnames");
const IconButton = require("../../components/IconButton/IconButton");
const GenreGraph = require("../../components/GenreGraph/GenreGraph");
const EXAMPLE_DATA = require("./exampleData.js");

const AboutInfo = ({ onClose, exampleIndex, ...props }) => {
  return (
    <div className="about">
      <IconButton onClick={onClose} className="close">
        <i className="material-icons">close</i>
      </IconButton>
      <div className="text-content">
        <h2>What is this?</h2>
        <p>
          <strong>Muser</strong> is a “smart” music visualizer. It is an
          experiment to see how machine learning technology can be used to
          enhance music visualization.
        </p>
        <p>
          Made by{" "}
          <a href="https://jonshamir.com" target="_blank">
            Jon Shamir
          </a>
          , the source code is available on{" "}
          <a href="https://github.com/jonshamir/muser" target="_blank">
            GitHub
          </a>
          .
        </p>
        <p>
          Select a track using the <i className="material-icons">queue_music</i>
          dropdown on the top left, then click the{" "}
          <i className="material-icons">play_arrow</i>play button. Note that
          only a few pre-analyzed tracks are available currently.
        </p>
        <h2>How does it work?</h2>
        <p>
          A neural network -{" "}
          <a href="https://github.com/jordipons/musicnn" target="_blank">
            musicnn
          </a>{" "}
          - predicts the musical genre for each second of a song. The
          predictions are then used to generate a color scheme:
        </p>
        <div className="process-illustration">
          <div className="waveform">
            {EXAMPLE_DATA[exampleIndex].waveform.map((x, i) => (
              <div className="bar" key={i} style={{ height: x }} />
            ))}
          </div>
          <div class="arrow">
            <i className="material-icons">east</i>
            <span>musicnn</span>
          </div>
          <div class="tags">
            <GenreGraph genres={EXAMPLE_DATA[exampleIndex].genres} />
          </div>
          <div class="arrow">
            <i className="material-icons">east</i>
            <span>average</span>
          </div>
          <div
            class="color"
            style={{ backgroundColor: EXAMPLE_DATA[exampleIndex].color }}
          ></div>
        </div>
        <p>
          The final visualization colors are based on the 5 most-fitting genres.
          The visualization shapes move and react to the audio data, like a
          classic music visualizer.
        </p>
        <p>
          To see the genre tags for the currently playing song, click the{" "}
          <i className="material-icons">insert_chart_outlined</i> graph icon.
          All generated colors for the currently selected song are visualized on
          the timeline, revealing stylistic changes within a track.
        </p>
        <h2>About</h2>
        <p>
          The idea for muser and the visualization itself is inspired by{" "}
          <a
            href="https://en.wikipedia.org/wiki/Wassily_Kandinsky"
            target="_blank"
          >
            Wassily Kandinsky
          </a>{" "}
          (1866-1944). Generally credited as the pioneer of abstract art, his
          work is well-known for its musical inspirations. Kandinsky associated
          specific tones and instruments to shapes and colors, thus
          “visualizing” a musical composition.
        </p>
        <figure>
          <img src="assets/images/kandinsky.jpg" alt="Circles by Kandinsky" />
          <figcaption>
            <i>Circles in a Circle</i> by Wassily Kandinsky, 1923
          </figcaption>
        </figure>
        <p>
          Colors for each genre were chosen according to the{" "}
          <a href="https://musicmap.info/" target="_blank">
            Musicmap
          </a>{" "}
          project so that music genres which are stylistically closer will get
          similar colors.
        </p>
        <p>
          The project structure is based on{" "}
          <a href="https://github.com/mattdesl/threejs-app" target="_blank">
            threejs-app
          </a>
          .
        </p>
      </div>
    </div>
  );
};

module.exports = AboutInfo;
