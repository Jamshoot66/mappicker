import React from "react";
import style from "./menu.module.scss";

import {connect} from "react-redux";
import * as actionType from "~s/actions.js";

import UserMenu from "~c/userMenu/userMenu.jsx";

class Menu extends React.Component{
	constructor(props) {
		super(props);
		this.ref = React.createRef();
		this.state = { menuIsFixed: false};
		this.MenuTop = 0;
		this.shouldFix = false;
	}

	onScrollEvent = () => {

		this.shouldFix = (window.scrollY > this.MenuTop) ? true : false;

		if (this.shouldFix !== this.state.menuIsFixed){
			let newState = Object.assign({}, this.state);
			newState.menuIsFixed = this.shouldFix;
			this.setState(newState);
		}
	}

	toggleLogin = (e) => {
		e.stopPropagation();
		this.props.showUserMenuToggle();
	}
	
	onScheduleDateChange = (e) => {
		e.stopPropagation();
		this.props.setCurrentScheduleDate(new Date(e.target.value).getTime())
	}

	onScheduleApproveClick = async (e) => {
		e.stopPropagation();
		let missions = [];
		for (let i in this.props.schedule) {
			if (this.props.schedule[i].date === this.props.currentScheduleDate) {
				missions = Array.from(this.props.schedule[i].missions);
			}
		}

		// console.log(missions);
		try {
			await this.props.addScheduleToServer(this.props.currentScheduleDate, missions);
		} catch (e) {
			console.log(e);
		}
		
		// this.props.setCurrentScheduleDate(new Date(e.target.value).getTime())
	}

	componentDidMount() {
		document.addEventListener("scroll", this.onScrollEvent);
		this.MenuTop = this.ref.current.offsetTop;
	}

	componentWillUnmount() {
		document.removeEventListener("scroll", this.onScrollEvent);
	}

	componentDidUpdate() {
		
	}

	render() {
		let greeting = (this.props.user.auth ? `Приветствую, ` : `Залогинься, `) + this.props.user.shortName;
		
		let menuClassName = this.state.menuIsFixed ? `${style.wrapper} ${style.fixed}` : `${style.wrapper}`;

		let fakeMenu = this.state.menuIsFixed ? <div className={style.fakeMenu}></div> : false;
		return (
			<div className={style.row}>
				{fakeMenu}
				<nav className={menuClassName} ref={this.ref}>
					
					{ this.props.user.rights.canAdd ? 
						<button className={style.addMissionBtn} onClick={this.props.showAddMissionComponentToggle}></button> : null }
					{/* TODO: implement add random missions
					 this.props.user.auth ? 
						<button 
							className={style.randomizeBtn} 
							id="menuRandomizeBtn"
							onClick={this.props.addRandomMissions}>
						</button> :
						null */}
					{/* TODO: implement filter feature
					<button className={style.filterBtn} id="menuFilterBtn"></button>		*/}
					
					{this.props.user.rights.canAdd ?
						<button className={style.approveBtn}
							onClick={this.onScheduleApproveClick}
							id="menuApproveBtn"></button>
						: null}
					
					{this.props.user.rights.canAdd ?
						<a href="#schedule">
							<button className={style.calendarBtn} id="menuCalendarBtn"></button>
						</a> : null}

					{this.props.user.rights.canAdd ?
						<input type="date" size="10" className={style.scheduleDate}
							onChange={this.onScheduleDateChange}
						/> : null}
					
					<div className={style.placeholder}></div>
					<label htmlFor="menuUserBtn" className={style.label}>{greeting}</label>
					<button 
						className={style.userBtn}
						id="menuUserBtn"
						onClick={this.toggleLogin}>					
					</button>
					<UserMenu customWrapperStyle={style.userMenuWrapper}/>
				</nav>
			</div>)
			
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		currentScheduleDate: state.currentScheduleDate,
		schedule: state.schedule
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		showMissionPoolToggle: () => {
			dispatch( {type: actionType.SHOW_MISSION_POOL_TOGGLE})
		},

		addRandomMissions: () => {
			dispatch( {
				type: actionType.ADD_RANDOM_MISSIONS,
				payload: {
					date: "01.02.2019"
				}	
			})
		},

		showUserMenuToggle: () => {
			dispatch({
				type: actionType.SHOW_USER_MENU_TOGGLE
			});
		},

		showAddMissionComponentToggle: () => {
			dispatch({
				type: actionType.SHOW_ADD_MISSION_COMPONENT_TOGGLE
			});
		},

		setCurrentScheduleDate: (date) => {
			dispatch({
				type: actionType.SET_CURRENT_SCHEDULE_DATE,
				payload: {
					date
				}
			})
		},

		addScheduleToServer: async (date, missions) => {
			await actionType.addScheduleToServer(dispatch, { date, missions });  
        },

		login: () => {
			actionType.loginViaGmail(dispatch)
		},

		logout: () => {
			actionType.logoutFromServer(dispatch)
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);