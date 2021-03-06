import React from 'react';
import { connect } from 'react-redux';
import style from './addMission.module.scss';
import * as actionType from '~s/actions.js';
import { islandList } from '~u/objectTemplates';
import Spinner from '~c/spinner/spinner.jsx';
import { DONE, PENDING, ERROR } from '~c/spinner/spinner.jsx';

class AddMission extends React.Component {
  constructor(props) {
    super(props);

    const defTags = {
      actualCheckbox: true,
      aircraftsCheckbox: false,
      tanksCheckbox: false,
      apcsCheckbox: false,
      helicoptersCheckbox: false,
    };

    this.defState = {
      fileName: props.filename || '',
      name: props.name || '',
      author: props.author || '',
      island: props.island || '',
      lastPlayed: props.lastPlayed || '',
      lastPlayedPlaceholder: 'опциональное поле',
      lastPlayedMs: props.lastPlayedMs || '',
      mods: props.mods || '',
      link: props.link || '',
      players: props.players || '',
      requestState: DONE,
    };

    this.state = Object.assign({}, this.defState, defTags);

    this.islandList = islandList;

    this.islandOptionsStr = this.islandList.map(item => {
      return (
        <option value={item} key={item}>
          {item}
        </option>
      );
    });
  }

  onNameChange = e => {
    this.setState({ name: e.target.value });
  };

  onModsChange = e => {
    this.setState({ mods: e.target.value });
  };

  onIslandChange = e => {
    this.setState({ island: e.target.value });
  };

  onPlayersChange = e => {
    this.setState({ players: e.target.value });
  };

  onAuthorChange = e => {
    this.setState({ author: e.target.value });
  };

  onLastPlayedChange = e => {
    this.setState({ lastPlayed: e.target.value });
  };

  onLinkChange = e => {
    this.setState({ link: e.target.value });
  };

  onLastPlayedBlur = e => {
    if (e.target.value !== '') {
      this.setState({ lastPlayedMs: new Date(e.target.value).getTime() });
    } else {
      e.target.type = 'text';
      this.setState({ lastPlayedMs: '' });
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

  onAddMissionClick = async () => {
    if (this.state.requestState === PENDING) return;

    const mission = Object.assign(
      {},
      this.state.fileName !== '' ? { fileName: this.state.fileName } : null,
      this.state.name !== '' ? { name: this.state.name } : null,
      this.state.author !== '' ? { author: this.state.author } : null,
      this.state.island !== '' ? { island: this.state.island } : null,
      this.state.lastPlayedMs !== ''
        ? { lastPlayed: this.state.lastPlayedMs }
        : { lastPlayed: 0 },
      this.state.mods !== '' ? { mods: this.state.mods } : null,
      this.state.link !== '' ? { link: this.state.link } : null,
      this.state.players !== '' ? { players: this.state.players } : null,
      { rateAvg: 3 },
      this.state.guid !== '' ? { guid: this.state.guid } : null
    );
  
    const tags = [];
    if (this.state.actualCheckbox) tags.push(`#актуальная`);
    if (this.state.aircraftsCheckbox) tags.push(`#самолеты`);
    if (this.state.tanksCheckbox) tags.push(`#тяжелаятехника`);
    if (this.state.apcsCheckbox) tags.push(`#легкаятехника`);
    if (this.state.helicoptersCheckbox) tags.push(`#вертолеты`);
  
    const tagsStr = tags.join(',');
    mission.tags = tagsStr;

    this.setState({ requestState: PENDING });
    try {
      await this.props.addMissionToStore(mission);
      this.setState(Object.assign({}, this.defState));
    } catch (e) {
      console.log(e);
      this.setState({ requestState: ERROR });
    }
  };


  onBackgroundClick = e => {
    e.stopPropagation();
  };

  render() {
    return (
      <div className={style.screen} onClick={this.onBackgroundClick}>
        <div className={style.wrapper}>
          <header className={style.itemHeader}>Добавить миссию</header>

          <hr className={style.horisontalLine} />

          <section className={style.itemWrapper}>
            <label htmlFor="fileName" className={style.itemLabel}>
              Имя файла
            </label>
            <input
              id="fileName"
              size="10"
              className={style.itemInput}
              value={this.state.fileName}
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
              value={this.state.name}
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
              value={this.state.mods}
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
              value={this.state.island}
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
              value={this.state.players}
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
              value={this.state.author}
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
              value={this.state.lastPlayed}
              onFocus={this.onLastPlayedFocus}
              onChange={this.onLastPlayedChange}
              onBlur={this.onLastPlayedBlur}
              className={style.itemInput}
              type="text"
              placeholder={this.state.lastPlayedPlaceholder}
            />
          </section>

          <section className={style.itemWrapper}>
            <label htmlFor="link" className={style.itemLabel}>
              Ссылка
            </label>
            <input
              id="link"
              size="10"
              value={this.state.link}
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
            <header className={style.itemHeader}>Метки</header>
    
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
                  style={{ borderRadius: '3px',}}
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
          </form>

          <hr className={style.horisontalLine} />

          <section className={style.itemWrapper}>
            <div className={style.buttonBlock}>
              <button
                className={style.itemButton}
                onClick={this.onAddMissionClick}
              >
                Добавить
              </button>
              <Spinner
                spinnerState={this.state.requestState}
                width="25px"
                height="25px"
              />
            </div>
            <button className={style.itemButton} onClick={this.props.hide}>
              Отменить
            </button>
          </section>
        </div>
      </div>
    );
  }
}

AddMission.defaultProps = {
  closeCallBack: () => {},
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    addMissionToStore: async mission => {
      await actionType.addMissionToServer(dispatch, mission);
    },

    hide: () => {
      dispatch({
        type: actionType.SHOW_ADD_MISSION_COMPONENT_TOGGLE,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMission);
