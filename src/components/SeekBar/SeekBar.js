/** @jsx h */
const { h } = require("preact");

const SeekBar = ({ children, ...props }) => (
  <div class="SeekBar">
    <input type="range" value={props.value} step="0.1" />
  </div>
);

module.exports = SeekBar;
