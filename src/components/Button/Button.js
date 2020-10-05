/** @jsx h */
const { h, Component } = require("preact");
const BaseComponent = require("../../components/BaseComponent/BaseComponent");
const classnames = require("classnames");
const animate = require("@jam3/gsap-promise");

class Button extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const classes = classnames({
      Button: true,
    });
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

Button.defaultProps = {
  onClick: () => {},
};

module.exports = Button;
