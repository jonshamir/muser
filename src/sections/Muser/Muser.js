/** @jsx h */
const { h, Component } = require("preact");
const BaseComponent = require("../../components/BaseComponent/BaseComponent");
const classnames = require("classnames");
const animate = require("@jam3/gsap-promise");

const MaterialButton = require("../../components/MaterialButton/MaterialButton");
const Header = require("../../components/Header/Header");

class Muser extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  animateIn() {
    return Promise.all([
      this.header.animateIn({ delay: 0.25 }),
      this.button.animateIn({ delay: 0.5 }),
    ]);
  }

  animateOut() {
    return Promise.all([this.header.animateOut()]);
  }

  render() {
    const classes = classnames({
      Muser: true,
    });
    return (
      <div
        className={classes}
        ref={(c) => {
          this.container = c;
        }}
      >
        <Header
          ref={(c) => {
            this.header = c;
          }}
        >
          Muser
        </Header>
        <MaterialButton
          onClick={this.props.onMaterialSwap}
          ref={(c) => {
            this.button = c;
          }}
        >
          Click to swap material
        </MaterialButton>
      </div>
    );
  }
}

Muser.defaultProps = {
  onMaterialSwap: () => {},
};

module.exports = Muser;
