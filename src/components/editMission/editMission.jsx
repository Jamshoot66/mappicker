import React from 'react';
import { connect } from 'react-redux';
import style from './editMission.module.scss';
import Popup from '~c/popup';
import Spinner from '~c/spinner/spinner.jsx';
import { DONE, PENDING, ERROR } from '~c/spinner/spinner.jsx';

import * as actionType from '~s/actions.js';

class EditMission extends React.Component {
  constructor(props) {
    super(props);

    const tags = this.props.currentMission?.tags?.split(',');

    const defState = {
      actualCheckbox: false,
      aircraftsCheckbox: false,
      tanksCheckbox: false,
      apcsCheckbox: false,
      helicoptersCheckbox: false,
    };

    if (tags) {
      tags.forEach(tag => {
        switch (tag) {
          case '#актуальная':
            defState.actualCheckbox = true;
            break;
          case '#самолеты':
            defState.aircraftsCheckbox = true;
            break;
          case '#тяжелаятехника':
            defState.tanksCheckbox = true;
            break;
          case '#легкаятехника':
            defState.apcsCheckbox = true;
            break;
          case '#вертолеты':
            defState.helicoptersCheckbox = true;
            break;
          default:
            break;
        }
      });
    }

    this.state = Object.assign({}, defState, {
      currentMission: props.currentMission,
      spinnerState: DONE,
    });

    this.islandList = [
      'altis',
      'beketov',
      'borzcaada',
      'bukovina',
      'bystrica',
      'chernarus',
      'chernarus_summer',
      'chernarus_winter',
      'deniland',
      'desert',
      'dingor',
      'emita',
      'enoch',
      'fallujah',
      'fata',
      'hellanmaa',
      'Isla_abramia',
      'lingor',
      'lythium',
      'malden',
      'porto',
      'prei_khmaoch_luong',
      'proving_grounds',
      'rahmadi',
      'reshmaan_province',
      'ruha',
      'sahrani',
      'shapur',
      'southrn_sahrani',
      'stratis',
      'takistan',
      'takistan_mountains',
      'tanoa',
      'tem_anizay',
      'united_sahrani',
      'utes',
      'virtual_reality',
      'wl_rosche',
      'yellowstone',
      'zargabad',
    ];

    this.islandOptionsStr = this.islandList.map(item => {
      return (
        <option value={item} key={item}>
          {item}
        </option>
      );
    });
  }

  onBackgroundClick = e => {
    e.stopPropagation();
  };

  updateMission = async e => {
    e.preventDefault();
    e.stopPropagation();

    const tags = [];
    if (this.state.actualCheckbox) tags.push(`#актуальная`);
    if (this.state.aircraftsCheckbox) tags.push(`#самолеты`);
    if (this.state.tanksCheckbox) tags.push(`#тяжелаятехника`);
    if (this.state.apcsCheckbox) tags.push(`#легкаятехника`);
    if (this.state.helicoptersCheckbox) tags.push(`#вертолеты`);

    const tagsStr = tags.join(',');

    const newMission = Object.assign({}, this.state.currentMission);
    newMission.tags = tagsStr;
    newMission.lastPlayed = this.state.currentMission.lastPlayedMs;
    delete newMission.lastPlayedMs;

    this.setState({ spinnerState: PENDING });
    await this.props.updateMission(newMission);
    this.setState({ spinnerState: DONE });
    this.props.hide();
  };

  onNameChange = e => {
    const currentMission = Object.assign({}, this.state.currentMission);
    currentMission.name = e.target.value;
    this.setState({ currentMission });
  };

  onModsChange = e => {
    const currentMission = Object.assign({}, this.state.currentMission);
    currentMission.mods = e.target.value;
    this.setState({ currentMission });
  };

  onIslandChange = e => {
    const currentMission = Object.assign({}, this.state.currentMission);
    currentMission.island = e.target.value;
    this.setState({ currentMission });
  };

  onPlayersChange = e => {
    const currentMission = Object.assign({}, this.state.currentMission);
    currentMission.players = e.target.value;
    this.setState({ currentMission });
  };

  onAuthorChange = e => {
    const currentMission = Object.assign({}, this.state.currentMission);
    currentMission.author = e.target.value;
    this.setState({ currentMission });
  };

  onLastPlayedChange = e => {
    const currentMission = Object.assign({}, this.state.currentMission);
    console.log(e.target.value);
    currentMission.lastPlayed = new Date(e.target.value).getTime();
    this.setState({ currentMission });
  };

  onLinkChange = e => {
    const currentMission = Object.assign({}, this.state.currentMission);
    currentMission.link = e.target.value;
    this.setState({ currentMission });
  };

  onLastPlayedBlur = e => {
    const currentMission = Object.assign({}, this.state.currentMission);

    if (e.target.value !== '') {
      currentMission.lastPlayedMs = new Date(e.target.value).getTime();
      this.setState({ currentMission });
    } else {
      e.target.type = 'text';
      currentMission.lastPlayedMs = '';
      this.setState({ currentMission });
    }
  };

  onLastPlayedFocus = e => {
    e.target.type = 'date';
  };

  onFileNameChange = e => {
    this.setState({ fileName: e.target.value.toLowerCase() });
  };

  onFileNameBlur = e => {
    let mission = {};
    let fileName = '';

    //trim pbo
    if (this.state.fileName.slice(-4).toLowerCase() === '.pbo') {
      fileName = this.state.fileName.slice(0, -4);
    } else {
      fileName = this.state.fileName;
    }
    mission.fileName = fileName;

    //get island
    let island = fileName.match(/[^.]+/g);
    if (island !== null) {
      if (this.islandList.includes(island[1])) {
        mission.island = island[1];
      }

      //parse whole file name
      let parsedFileName = island[0].match(/[^_]+/g);
      if (parsedFileName != null) {
        //get players
        mission.players = parsedFileName[1];
        //get name
        mission.name = parsedFileName.reduce((acc, item, index) => {
          if (index > 2 && index < parsedFileName.length - 1) {
            return acc + ' ' + item;
          } else {
            return acc;
          }
        }, parsedFileName[2]);
      }
    }

    this.setState(mission);
  };

  render() {
    const { currentMission, spinnerState } = this.state;
    return (
      <Popup onClick={this.props.hide}>
        {/*<div className={style.screen} onClick={this.onBackgroundClick}>*/}
        {/*<div className={style.wrapper}>*/}
        <div onClick={this.onBackgroundClick}>
          <header className={style.itemHeader}>Редактировать миссию</header>

          <hr className={style.horisontalLine} />

          <section className={style.itemWrapper}>
            <label htmlFor="fileName" className={style.itemLabel}>
              Имя файла
            </label>
            <input
              id="fileName"
              size="10"
              className={style.itemInput}
              value={currentMission.fileName}
              onChange={this.onFileNameChange}
              onBlur={this.onFileNameBlur}
              type="text"
              placeholder="обязательное поле"
            />
          </section>

          <section className={style.itemWrapper}>
            <label htmlFor="name" className={style.itemLabel}>
              Название миссии
            </label>
            <input
              id="name"
              size="10"
              value={currentMission.name}
              onChange={this.onNameChange}
              className={style.itemInput}
              type="text"
              placeholder="обязательное поле"
            />
          </section>

          <section className={style.itemWrapper}>
            <label htmlFor="mods" className={style.itemLabel}>
              Моды
            </label>
            <select
              id="mods"
              value={currentMission.mods}
              onChange={this.onModsChange}
              className={style.itemSelect}
              type="text"
              required
              placeholder="обязательное поле"
            >
              <option value="" hidden disabled>
                обязательное поле
              </option>
              <option value="rhs">rhs</option>
              <option value="vanilla">vanilla</option>
            </select>
          </section>

          <section className={style.itemWrapper}>
            <label htmlFor="island" className={style.itemLabel}>
              Остров
            </label>
            <select
              id="island"
              size="1"
              value={currentMission.island}
              onChange={this.onIslandChange}
              className={style.itemSelect}
              required
            >
              <option value="" hidden disabled>
                обязательное поле
              </option>
              [{this.islandOptionsStr}]
            </select>
          </section>

          <section className={style.itemWrapper}>
            <label htmlFor="players" className={style.itemLabel}>
              Кол-во игроков
            </label>
            <input
              id="players"
              min="0"
              max="999"
              value={currentMission.players}
              onChange={this.onPlayersChange}
              className={style.itemInput}
              type="number"
              placeholder="обязательное поле"
            />
          </section>

          <section className={style.itemWrapper}>
            <label htmlFor="author" className={style.itemLabel}>
              Автор
            </label>
            <input
              id="author"
              size="10"
              value={currentMission.author}
              onChange={this.onAuthorChange}
              className={style.itemInput}
              type="text"
              placeholder="обязательное поле"
            />
          </section>

          <section className={style.itemWrapper}>
            <label htmlFor="lastPlayed" className={style.itemLabel}>
              Отыгрыш
            </label>
            <input
              id="lastPlayed"
              size="10"
              value={
                currentMission.lastPlayed
                  ? new Date(currentMission.lastPlayed)
                      .toISOString()
                      .substr(0, 10)
                  : ''
              }
              onFocus={this.onLastPlayedFocus}
              onChange={this.onLastPlayedChange}
              onBlur={this.onLastPlayedBlur}
              className={style.itemInput}
              type="date"
              placeholder={currentMission.lastPlayedPlaceholder}
            />
          </section>

          <section className={style.itemWrapper}>
            <label htmlFor="link" className={style.itemLabel}>
              Ссылка
            </label>
            <input
              id="link"
              size="10"
              value={currentMission.link}
              onChange={this.onLinkChange}
              className={style.itemInput}
              type="text"
              placeholder="опциональное поле"
            />
          </section>

          <hr className={style.horisontalLine} />
          {/*</div>*/}

          <form
            // style={{ position: 'relative' }}
            className={style.tagsWrapper}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <header className={style.itemHeader}>Редактировать метки</header>

            <section className={style.checkBoxGroupWrapper}>
              <div className={style.checkBoxWrapper}>
                <input
                  id="actualCheckbox"
                  size="10"
                  className={style.itemInput}
                  type="checkbox"
                  placeholder="Фильтр"
                  checked={this.state.actualCheckbox}
                  onChange={e => {
                    this.setState({ actualCheckbox: e.target.checked });
                  }}
                  style={{ borderRadius: '3px' }}
                />
                <label htmlFor="actualCheckbox">Актуальная</label>
              </div>
            </section>

            <section className={style.checkBoxGroupWrapper}>
              <div className={style.checkBoxWrapper}>
                <input
                  id="apcsCheckbox"
                  size="10"
                  className={style.itemInput}
                  type="checkbox"
                  placeholder="Фильтр"
                  style={{ borderRadius: '3px' }}
                  checked={this.state.apcsCheckbox}
                  onChange={e => {
                    this.setState({ apcsCheckbox: e.target.checked });
                  }}
                />
                <label htmlFor="apcsCheckbox">Легкая техника</label>
              </div>

              <div className={style.checkBoxWrapper}>
                <input
                  id="tanksCheckbox"
                  size="10"
                  className={style.itemInput}
                  type="checkbox"
                  placeholder="Фильтр"
                  style={{ borderRadius: '3px' }}
                  checked={this.state.tanksCheckbox}
                  onChange={e => {
                    this.setState({ tanksCheckbox: e.target.checked });
                  }}
                />
                <label htmlFor="tanksCheckbox">Тяжелая техника</label>
              </div>

              <div className={style.checkBoxWrapper}>
                <input
                  id="helicoptersCheckbox"
                  size="10"
                  className={style.itemInput}
                  type="checkbox"
                  placeholder="Фильтр"
                  style={{ borderRadius: '3px' }}
                  checked={this.state.helicoptersCheckbox}
                  onChange={e => {
                    this.setState({ helicoptersCheckbox: e.target.checked });
                  }}
                />
                <label htmlFor="helicoptersCheckbox">Вертолеты</label>
              </div>

              <div className={style.checkBoxWrapper}>
                <input
                  id="aircraftsCheckbox"
                  size="10"
                  className={style.itemInput}
                  type="checkbox"
                  placeholder="Фильтр"
                  style={{ borderRadius: '3px' }}
                  checked={this.state.aircraftsCheckbox}
                  onChange={e => {
                    this.setState({ aircraftsCheckbox: e.target.checked });
                  }}
                />
                <label htmlFor="aircraftsCheckbox">Самолеты</label>
              </div>
            </section>

            <hr className={style.horisontalLine} />
            <section className={style.itemWrapper}>
              <div className={style.buttonBlock}>
                <button
                  className={style.itemButton}
                  type="submit"
                  onClick={this.updateMission}
                >
                  {/*Применить*/}
                  {spinnerState === DONE ? (
                    'Применить'
                  ) : (
                    <Spinner
                      spinnerState="PENDING"
                      width="21px"
                      height="21px"
                    />
                  )}
                </button>
              </div>
              {/* <button className={style.itemButton} onClick={this.props.hide}> */}
              <button
                className={style.itemButton}
                type="reset"
                onClick={this.props.hide}
              >
                Отменить
              </button>
            </section>
          </form>
        </div>
      </Popup>
    );
  }
}

EditMission.defaultProps = {
  closeCallBack: () => {},
};

const mapStateToProps = store => {
  return {
    currentMission: store.missionPool.find(
      mission => mission.guid === store.currentMission
    ),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateMission: async mission => {
      return actionType.updateMission(dispatch, mission);
    },

    hide: () => {
      dispatch({
        type: actionType.SHOW_EDIT_MISSION_COMPONENT_TOGGLE,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMission);
