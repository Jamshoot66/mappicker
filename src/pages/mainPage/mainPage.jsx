import React from "react";
import style from "./mainPage.module.scss"

import {connect} from "react-redux";
import * as actionType from "~s/actions.js";

import Header from "~c/header/header.jsx";
import Menu from "~c/menu/menu.jsx";
import Item from "~c/item/item.jsx";
import ItemHeader from "~c/item/itemHeader.jsx";
import AddMission from "~c/addMission/addMission.jsx";
import Spinner from "~c/spinner/spinner.jsx";

class MainPage extends React.Component {
    
    render() {
		let itemsStr = false;
		let itemsPoolStr = false;
		itemsStr = this.props.missionPool.map( (item, index) => {
			return <Item key={item.guid} showInMissonPool {...item} even={index%2}/>
		});

		itemsPoolStr = this.props.currentSchedule.missions.map( (scheduleItem, index) => {
			return <Item key={scheduleItem.guid} {...scheduleItem} even={index%2}/>
			/*
			if (this.props.currentSchedule.date === scheduleItem.date) {
				let setItemsStr = [...scheduleItem.missions.entries()].map((item, index) => {
					let mission = this.props.missionPool.find((itemFromPool) => {
						return itemFromPool.guid === item[0]
					});
					return <Item key={mission.guid} {...mission} even={index%2}/>
				})

				let result = [setItemsStr];
				return result;
			}
			return null;
			*/
		});

		let contentStr;
		if (this.props.user.auth) {		
			contentStr = <div>
				<div><h2>Пул миссий</h2></div>
				<ItemHeader />
				{itemsStr}

				{this.props.user.rights.canAdd && this.props.currentSchedule.date ? <div id="schedule" className={style.dummyPlaceholder}></div> : null}
					
				{this.props.user.rights.canAdd && this.props.currentSchedule.date ?
					<div>
						<h2>
							Расписание на {(new Date(this.props.currentSchedule.date)).toLocaleDateString()}
							<Spinner spinnerState={this.props.syncScheduleState} width="25px" height="25px" />
						</h2>
					</div> : null}
				{this.props.user.rights.canAdd && this.props.currentSchedule.date > 0 ? itemsPoolStr : null}
				
				<div className={style.viewHeight}></div>

				{this.props.showAddMissionComponent ?
					<div className={style.fullscreenWrapper} onClick={this.props.showAddMissionComponentToggle}><AddMission /></div>
					: null}
			</div>	
		} else {
			contentStr = <div className={style.loginMessage}>
				Залогинтесь через Google+, чтобы получить доступ к контенту
			</div>
		}

		return (
			<main className={style.wrapper}>
				<header className={style.row}>
					<Header/>
				</header>
				<Menu />	
				{contentStr}
			</main>
		);
	}
	
};

const mapStateToProps = (state) => {
	return {
		user : state.user,
		missionPool: state.missionPool,
		syncScheduleState: state.syncScheduleState,
		schedule : state.schedule,
		showMissionPool: state.showMissionPool,
		showAddMissionComponent: state.showAddMissionComponent,
		db: state.firebase.db,
		currentSchedule: state.currentSchedule
	}
} 

const mapDispatchToProps = (dispatch) => {
	return {
		getAllMissions: async () => {
			await actionType.getAllMissions(dispatch)
		},

		getAllSchedule: async () => {
			await actionType.getAllSchedule(dispatch)
		},

		setFirebase: (firebase) => {
			dispatch({
				type: actionType.SET_FIREBASE,
				payload: {
					firebase
				}
			})
		},

		updatePropabilities: () => {
			dispatch( {type: actionType.UPDATE_PROPABILITIES} )
		},
		
		updateUserInfo: (user) => {
			dispatch( {
				type: actionType.UPDATE_USER_INFO, 
				payload: {user}
			})
		},

		showAddMissionComponentToggle: () => {
			dispatch({
				type: actionType.SHOW_ADD_MISSION_COMPONENT_TOGGLE
			})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
