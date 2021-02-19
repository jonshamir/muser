/** @jsx h */
const { h, Component } = require("preact");
const BaseComponent = require("../../components/BaseComponent/BaseComponent");
const classnames = require("classnames");
const animate = require("@jam3/gsap-promise");

class IconButton extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let classes = classnames({
      IconButton: true,
    });

    if (this.props.className) classes += " " + this.props.className;

    return (
      <div
        onClick={this.props.onClick}
        className={classes}
        ref={(c) => {
          this.container = c;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

IconButton.defaultProps = {
  onClick: () => {},
};

module.exports = IconButton;
