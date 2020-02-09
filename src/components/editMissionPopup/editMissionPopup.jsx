import React from 'react';
import { connect } from 'react-redux';
import style from './tagsPopup.module.scss';
import Popup from '~c/popup';
import * as actionType from '~s/actions.js';

class EditMissionPopup extends React.Component {
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

    this.state = Object.assign({}, defState);
  }

  onBackgroundClick = e => {
    e.stopPropagation();
  };

  setTags = async e => {
    e.preventDefault();
    e.stopPropagation();

    const tags = [];
    if (this.state.actualCheckbox) tags.push(`#актуальная`);
    if (this.state.aircraftsCheckbox) tags.push(`#самолеты`);
    if (this.state.tanksCheckbox) tags.push(`#тяжелаятехника`);
    if (this.state.apcsCheckbox) tags.push(`#легкаятехника`);
    if (this.state.helicoptersCheckbox) tags.push(`#вертолеты`);

    const tagsStr = tags.join(',');

    const newMission = Object.assign({}, this.props.currentMission);
    newMission.tags = tagsStr;

    await this.props.updateMission(newMission);
    this.props.hide();
  };

  render() {
    const { currentMission } = this.props;

    return (
      <Popup onClick={this.props.hide}>
        <form
          style={{ position: 'relative' }}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <header className={style.popupHeader}>Редактировать метки</header>
          <header className={style.itemHeader}>
            <p>
              <strong>{currentMission?.name}</strong>
            </p>
          </header>
          <hr className={style.horisontalLine} />

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
                onClick={this.setTags}
              >
                Применить
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
      </Popup>
    );
  }
}

EditMissionPopup.defaultProps = {
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
    updateMission: mission => {
      actionType.updateMission(dispatch, mission);
    },

    hide: () => {
      dispatch({
        type: actionType.SHOW_SET_TAGS_POPUP_TOGGLE,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMissionPopup);
