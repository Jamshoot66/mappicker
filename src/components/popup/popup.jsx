import React from 'react';
import style from './popup.module.scss';

class Popup extends React.Component {
  static defaultProps = {
    onClick: () => {},
  };
  render() {
    return (
      <section className={style.fullscreenWrapper} onClick={this.props.onClick}>
        <div className={style.screen}>
          <div className={style.wrapper}>{this.props?.children}</div>
        </div>
      </section>
    );
  }
}

export default Popup;
