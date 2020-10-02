/** @jsx h */
const { h } = require("preact");

const TrackSelector = ({ children, ...props }) => (
  <div class="TrackSelector">
    <select onChange={props.onChange}>
      {props.tracks.map((track) => (
        <option key={track.id} value={track.id}>
          {track.title}
        </option>
      ))}
    </select>
  </div>
);

module.exports = TrackSelector;
