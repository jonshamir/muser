/** @jsx h */
const { h, Component } = require("preact");

const BaseComponent = require("../../components/BaseComponent/BaseComponent");
const classnames = require("classnames");

class TrackSelector extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      areOptionsVisible: false,
    };
  }

  handleChange(e) {
    this.props.onChange(e);
    this.dropdown.blur();
  }

  handleDropdownClick() {
    this.setState({ areOptionsVisible: !this.state.areOptionsVisible });
  }

  handleSelectOption(trackId) {
    this.setState({ areOptionsVisible: false });
    this.props.onChange(trackId);
  }

  render() {
    const classes = classnames({
      TrackSelector: true,
      isOpen: this.state.areOptionsVisible,
    });

    return (
      <div className={classes}>
        <div className="dropdown" onClick={() => this.handleDropdownClick()}>
          <span className="material-icons">queue_music</span>
          <div className="dropdownTitle"> Select track</div>
          <span className="material-icons dropdownArrow">
            keyboard_arrow_down
          </span>
        </div>
        <ul className="optionContainer">
          {this.state.areOptionsVisible &&
            this.props.tracks.map((track) => (
              <li
                key={track.id}
                onClick={() => this.handleSelectOption(track.id)}
                className={this.props.value == track.id ? "selected" : ""}
              >
                {track.title}
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

TrackSelector.defaultProps = {
  onClick: () => {},
};

module.exports = TrackSelector;
