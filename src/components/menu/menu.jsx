import React from "react";
import style from "./menu.module.scss";

import {connect} from "react-redux";
import * as actionType from "~s/actions.js";

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

	toggleLogin = () => {
		if (!this.props.user.auth) {
			this.props.login();
		} else {
			this.props.logout();
		}
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
					{/*<label htmlFor="menuFilterBtn" className={style.label}>Фильтр</label>*/}

					<button 
						className={style.calendarBtn} 
						id="menuRandomizeBtn"
						onClick={this.props.showMissionPoolToggle}>
					</button>
					{this.props.user.auth ?
						<button 
							className={style.randomizeBtn} 
							id="menuRandomizeBtn"
							onClick={this.props.addRandomMissions}>
						</button> :
						false}
					{/*<button className={style.filterBtn} id="menuFilterBtn"></button>		*/}
					<div className={style.placeholder}></div>
					<label htmlFor="menuUserBtn" className={style.label}>{greeting}</label>
					<button 
						className={style.userBtn}
						id="menuUserBtn"
						onClick={this.toggleLogin}>
					</button>
				</nav>
			</div>)
			
	}
}

const mapStateToProps = (state) => {
	return {
		user : state.user
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

		login: () => {
			actionType.loginViaGmail(dispatch)
		},

		logout: () => {
			actionType.logoutFromServer(dispatch)
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);