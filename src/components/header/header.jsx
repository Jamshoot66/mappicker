import React from 'react';
import style from './header.module.scss';
import rbcLogo from './rbclogo_m.png';

class Header extends React.Component {
  render() {
    return (
      <div className={style.wrapper}>
        <a href="http://www.red-bear.ru/">
          <img src={rbcLogo} alt="rb-logo" className={style.rbcLogo} />
        </a>
        <div className={style.text}>
          <div>Утилита ротации карт в расписании игр TVT</div>
          <div>
            Специально для сообщества <span>КРАСНЫЙ МЕДВЕДЬ</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
