/** @jsx h */
const { h } = require("preact");

const GenreGraph = ({ children, ...props }) => (
  <div>
    {props.genres.map((genre) => (
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
);

module.exports = GenreGraph;
