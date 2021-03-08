/** @jsx h */
const { h, Component } = require("preact");
const BaseComponent = require("../../components/BaseComponent/BaseComponent");
const classnames = require("classnames");
const animate = require("@jam3/gsap-promise");

class JonLogo extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const classes = classnames({
      JonLogo: true,
    });
    return (
      <a
        href="https://jonshamir.com/"
        className={classes}
        ref={(c) => {
          this.container = c;
        }}
      >
        <div className="logo-container">
          <div className="rotate">
            <div className="logo">
              <div className="top">
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
              </div>
              <div className="bottom">
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
              </div>
              <div className="middle">
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
              </div>
              <div className="side">
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
                <div className="face"></div>
              </div>
            </div>
          </div>
        </div>
      </a>
    );
  }
}

JonLogo.defaultProps = {
  onClick: () => {},
};

module.exports = JonLogo;
