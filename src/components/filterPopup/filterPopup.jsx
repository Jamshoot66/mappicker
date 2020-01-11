import React from 'react';
import { connect } from 'react-redux';
import style from './filterPopup.module.scss';
import * as actionType from '~s/actions.js';

class FilterPopup extends React.Component {
  constructor(props) {
    super(props);
    const [filter, ...tags] = this.props.filterString.split(',');

    const defState = {
      filterString: filter,
      actualCheckbox: false,
      aircraftsCheckbox: false,
      tanksCheckbox: false,
      apcsCheckbox: false,
      helicoptersCheckbox: false,
    };

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

    this.state = Object.assign({}, defState);
  }

  onBackgroundClick = e => {
    e.stopPropagation();
  };

  applyFilter = () => {
    let fullFilterString = this.state.filterString || '';
    if (this.state.actualCheckbox)
      fullFilterString = `${fullFilterString},#актуальная`;
    if (this.state.aircraftsCheckbox)
      fullFilterString = `${fullFilterString},#самолеты`;
    if (this.state.tanksCheckbox)
      fullFilterString = `${fullFilterString},#тяжелаятехника`;
    if (this.state.apcsCheckbox)
      fullFilterString = `${fullFilterString},#легкаятехника`;
    if (this.state.helicoptersCheckbox)
      fullFilterString = `${fullFilterString},#вертолеты`;

    this.props.filterMissions({ filterString: fullFilterString });
    this.props.hide();
  };

  defaultFilter = () => {
    this.props.filterMissions({ filterString: '' });
    this.props.hide();
  };

  render() {
    const { filterString } = this.state;

    return (
      <div className={style.screen} onClick={this.onBackgroundClick}>
        <form className={style.wrapper}>
          <header className={style.itemHeader}>Применить фильтр</header>

          <hr className={style.horisontalLine} />

          <section className={style.itemWrapper}>
            <input
              id="filter"
              size="10"
              className={style.itemInput}
              value={filterString}
              onChange={e => {
                this.setState({ filterString: e.target.value });
              }}
              onBlur={e => {
                this.setState({ filterString: e.target.value.trim() });
              }}
              type="text"
              placeholder="Фильтр"
              style={{ borderRadius: '3px', height: '26px' }}
            />
          </section>

          <section className={style.checkBoxGroupWrapper}>
            <div className={style.checkBoxWrapper}>
              <input
                id="actualCheckbox"
                size="10"
                className={style.itemInput}
                value={filterString}
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
                value={filterString}
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
                value={filterString}
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
                value={filterString}
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
                value={filterString}
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
                onClick={this.applyFilter}
              >
                Применить
              </button>
            </div>
            <button className={style.itemButton} onClick={this.defaultFilter}>
              Сбросить
            </button>
          </section>
        </form>
      </div>
    );
  }
}

FilterPopup.defaultProps = {
  closeCallBack: () => {},
};

const mapStateToProps = store => {
  return {
    filterString: store.filterString,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    filterMissions: filter => {
      dispatch({
        type: actionType.FILTER_MISSIONS,
        payload: { filterString: filter.filterString },
      });
    },

    hide: () => {
      dispatch({
        type: actionType.SHOW_FILTER_MISSION_POPUP_TOGGLE,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterPopup);
