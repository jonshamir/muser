/** @jsx h */
const { h } = require("preact");
const classnames = require("classnames");
const IconButton = require("../../components/IconButton/IconButton");

const AboutInfo = ({ onClose, ...props }) => {
  return (
    <div className="about">
      <IconButton onClick={onClose} className="close">
        <i className="material-icons">close</i>
      </IconButton>
      <div className="text-content">
        <h2>What is this?</h2>
        <p>
          <strong>Muser</strong> is a “smart” music visualizer, made by{" "}
          <a href="https://jonshamir.com" target="_blank">
            Jon Shamir
          </a>
          . It is an experiment to test how maching learning technology can be
          used to enhance music visualization.
        </p>
        <p>
          Select a track using the <i className="material-icons">queue_music</i>
          dropdown on the top left, then click the{" "}
          <i className="material-icons">play_arrow</i>play button. Currently
          only a few pre-analyzed tracks are available.
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
            {Array(16)
              .fill(null)
              .map((_, i) => (
                <div
                  className="bar"
                  key={i}
                  style={{ height: Math.random() * 50 + 5 }}
                />
              ))}
          </div>
          <div class="arrow">
            <i className="material-icons">east</i>
            <span>musicnn</span>
          </div>
          <div class="tags">
            <div class="genre-tag">
              <div class="color" style={{ backgroundColor: "#1155cc" }}></div>
              Blues 39%
            </div>
            <div class="genre-tag">
              <div class="color" style={{ backgroundColor: "#0a5394" }}></div>
              Jazz 25%
            </div>
            <div class="genre-tag">
              <div class="color" style={{ backgroundColor: "#f1c232" }}></div>
              Classic Rock 17%
            </div>
            <div class="genre-tag">
              <div class="color" style={{ backgroundColor: "#b3c376" }}></div>
              Pop 8%
            </div>
            <div class="genre-tag">
              <div class="color" style={{ backgroundColor: "#990000" }}></div>
              Electronic 8%
            </div>
          </div>
          <div class="arrow">
            <i className="material-icons">east</i>
            <span>average</span>
          </div>
          <div class="color" style={{ backgroundColor: "#7d678b" }}></div>
        </div>
        <p>
          The final visualization colors are based on the 5 most-fitting genres.
          The visualization shapes move and react to the audio data, like any
          classic music visualizer.
        </p>
        <p>
          To see the genre tags for the currently playing song, click the{" "}
          <i className="material-icons">insert_chart_outlined</i> graph icon.
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
            <i>Circles In A Circle</i> by Wassily Kandinsky, 1923
          </figcaption>
        </figure>
        <p>
          Ideally, music genres which are stylistically closer will get similar
          colors. The colors for each genre were chosen according to the{" "}
          <a href="https://musicmap.info/" target="_blank">
            Musicmap project
          </a>
          .
        </p>
        <p>[musicmap genres image]</p>
      </div>
    </div>
  );
};

module.exports = AboutInfo;
