/** @jsx h */
const { h } = require("preact");
const classnames = require("classnames");

const GenreGraph = ({ children, isHidden, ...props }) => {
  const classes = classnames({
    isHidden: isHidden,
  });

  return (
    <div className={classes}>
      {props.genres.map((genre) => (
        <div>
          <div className="genreTag">
            {genre.title} {genre.value && genre.value.toFixed(2)}{" "}
            <strong>{Math.floor(genre.weight * 100)}%</strong>
          </div>
          <div
            className="genreBar"
            style={{
              backgroundColor: genre.color,
              width: `${genre.weight * 80}%`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

module.exports = GenreGraph;
