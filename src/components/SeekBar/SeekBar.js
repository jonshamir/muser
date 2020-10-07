/** @jsx h */
const { h } = require("preact");

const SeekBar = ({ children, ...props }) => (
  <div class="SeekBar">
    <input
      type="range"
      value={props.value}
      step="0.1"
      onChange={props.onChange}
      style={`background-image: linear-gradient(to right ,${props.backgroundColors.join()});`}
    />
  </div>
);

module.exports = SeekBar;
