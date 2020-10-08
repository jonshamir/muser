/** @jsx h */
const { h, Component } = require("preact");
const BaseComponent = require("../../components/BaseComponent/BaseComponent");
const classnames = require("classnames");

class TrackSelector extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange(e) {
    this.props.onChange(e);
    this.dropdown.blur();
  }

  render() {
    const classes = classnames({
      TrackSelector: true,
    });

    return (
      <div className={classes}>
        <select
          onChange={(e) => this.handleChange(e)}
          ref={(c) => {
            this.dropdown = c;
          }}
        >
          {this.props.tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.title}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

TrackSelector.defaultProps = {
  onClick: () => {},
};

module.exports = TrackSelector;
