/** @jsx h */
const { h } = require("preact");

const Spinner = (props) => (
  <div className="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
);

module.exports = Spinner;
