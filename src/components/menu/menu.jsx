import React from 'react';
import style from './menu.module.scss';

import { connect } from 'react-redux';
import * as actionType from '~s/actions.js';

import UserMenu from '~c/userMenu/userMenu.jsx';
import { DONE, ERROR, PENDING } from '~c/spinner/spinner.jsx';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = { menuIsFixed: false };
    this.MenuTop = 0;
    this.shouldFix = false;
  }

  onScrollEvent = () => {
    this.shouldFix = window.scrollY > this.MenuTop ? true : false;

    if (this.shouldFix !== this.state.menuIsFixed) {
      let newState = Object.assign({}, this.state);
      newState.menuIsFixed = this.shouldFix;
      this.setState(newState);
    }
  };

  toggleLogin = e => {
    e.stopPropagation();
    this.props.showUserMenuToggle();
  };

  onScheduleDateChange = e => {
    e.stopPropagation();
    this.props.setCurrentScheduleDate(new Date(e.target.value).getTime());
  };

  onScheduleApproveClick = async e => {
    e.stopPropagation();
    if (this.props.syncScheduleState === PENDING) return false;
    let missions = [];
    let date = this.props.currentScheduleDate;
    for (let i in this.props.schedule) {
      if (this.props.schedule[i].date === date) {
        missions = Array.from(this.props.schedule[i].missions);
      }
    }

    try {
      this.props.setSyncScheduleState(PENDING);
      await this.props.addScheduleToServer(date, missions);
      this.props.updateMissionLastPlayed(date, missions);
      this.props.setSyncScheduleState(DONE);
    } catch (e) {
      console.log(e);
      this.props.setSyncScheduleState(ERROR);
    }
  };

  componentDidMount() {
    document.addEventListener('scroll', this.onScrollEvent);
    this.MenuTop = this.ref.current.offsetTop;
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.onScrollEvent);
  }

  componentDidUpdate() {}

  render() {
    let greeting =
      (this.props.user.auth ? `Приветствую, ` : `Залогинься, `) +
      this.props.user.shortName;

    let menuClassName = this.state.menuIsFixed
      ? `${style.wrapper} ${style.fixed}`
      : `${style.wrapper}`;

    let fakeMenu = this.state.menuIsFixed ? (
      <div className={style.fakeMenu}></div>
    ) : (
      false
    );
    return (
      <div className={style.row}>
        {fakeMenu}
        <nav className={menuClassName} ref={this.ref}>
          {this.props.user.auth ? (
            <button
              className={style.filterBtn}
              id="menuFilterBtn"
              onClick={this.props.showFilterMissionsComponentToggle}
            ></button>
          ) : null}

          {this.props.user.rights.canAdd ? (
            <button
              className={style.addMissionBtn}
              onClick={this.props.showAddMissionComponentToggle}
            ></button>
          ) : null}
          {/* TODO: implement add random missions
					 this.props.user.auth ? 
						<button
							className={style.randomizeBtn} 
							id="menuRandomizeBtn"
							onClick={this.props.addRandomMissions}>
						</button> :
						null */}

          {this.props.user.rights.canAdd && this.props.currentScheduleDate ? (
            <button
              className={style.approveBtn}
              onClick={this.onScheduleApproveClick}
              id="menuApproveBtn"
              title="Утвердить расписание"
            ></button>
          ) : null}

          {this.props.user.rights.canAdd && this.props.currentScheduleDate ? (
            <a href="#schedule">
              <button
                className={style.calendarBtn}
                id="menuCalendarBtn"
                title="К расписанию"
              ></button>
            </a>
          ) : null}

          {this.props.user.rights.canAdd ? (
            <input
              type="date"
              size="10"
              className={style.scheduleDate}
              onChange={this.onScheduleDateChange}
            />
          ) : null}

          <div className={style.placeholder}></div>
          <label htmlFor="menuUserBtn" className={style.label}>
            {greeting}
          </label>
          <button
            style={{ marginRight: '7px' }}
            className={style.userBtn}
            id="menuUserBtn"
            onClick={this.toggleLogin}
          ></button>
          <UserMenu customWrapperStyle={style.userMenuWrapper} />
        </nav>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    currentScheduleDate: state.currentSchedule.date,
    syncScheduleState: state.syncScheduleState,
    schedule: state.schedule,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showMissionPoolToggle: () => {
      dispatch({ type: actionType.SHOW_MISSION_POOL_TOGGLE });
    },

    addRandomMissions: () => {
      dispatch({
        type: actionType.ADD_RANDOM_MISSIONS,
        payload: {
          date: '01.02.2019',
        },
      });
    },

    showUserMenuToggle: () => {
      dispatch({
        type: actionType.SHOW_USER_MENU_TOGGLE,
      });
    },

    showAddMissionComponentToggle: () => {
      dispatch({
        type: actionType.SHOW_ADD_MISSION_COMPONENT_TOGGLE,
      });
    },

    showFilterMissionsComponentToggle: () => {
      dispatch({
        type: actionType.SHOW_FILTER_MISSION_POPUP_TOGGLE,
      });
    },

    setCurrentScheduleDate: date => {
      dispatch({
        type: actionType.GET_SCHEDULE,
        payload: {
          date,
        },
      });
    },

    setSyncScheduleState: state => {
      dispatch({
        type: actionType.SET_SYNC_SCHEDULE_STATE,
        payload: {
          state,
        },
      });
    },

    updateMissionLastPlayed: (date, missions) => {
      dispatch({
        type: actionType.UPDATE_MISSION_LASTPLAYED,
        payload: { date, missions },
      });
    },

    addScheduleToServer: async (date, missions) => {
      await actionType.addScheduleToServer(dispatch, { date, missions });
    },

    login: () => {
      actionType.loginViaGmail(dispatch);
    },

    logout: () => {
      actionType.logoutFromServer(dispatch);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
