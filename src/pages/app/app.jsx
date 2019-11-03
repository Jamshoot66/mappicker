import React from "react";
import style from "./app.module.scss";

import {connect} from "react-redux";
import * as actionType from "~s/actions.js";

import Header from "~c/header/header.jsx";
import Menu from "~c/menu/menu.jsx";
import Item from "~c/item/item.jsx";
import ItemHeader from "~c/item/itemHeader.jsx";
import AddMission from "~c/addMission/addMission.jsx";


// import { initFirebase } from "~u/firebase.js";
import * as utils from "~u/utils.js";

import * as firebase from "firebase/app";
import 'firebase/firestore';

class App extends React.Component {
	constructor(props){
		super(props);

		let callback = async (firebaseUser) => {
			/* eslint-disable */
			if (firebaseUser != undefined) {
				/* eslint-enable */
				
				let db = firebase.firestore();
				let info = (await db.collection("users").doc(firebaseUser.uid).get()).data();
				let user = Object.assign({},
					utils.defUser,
					{
						auth: true,
						uid: firebaseUser.uid,
						shortName: firebaseUser.displayName,
						name: firebaseUser.displayName,
						unit: `[${info.unit.toUpperCase()}]`,
						rights: {
							canAdd: info.canAdd,
							canAdmin: info.canAdmin,
							canRate: info.canRate,
							canRead: info.canRead
						}
					});

				this.props.updateUserInfo(user);
				this.props.getAllMissions();
				// this.props.setFirebase({ db });
			}
		}

		firebase.auth().onAuthStateChanged(callback);
	}

	componentDidMount(){
		// this.props.getAllMissions();
		this.props.updatePropabilities();
	}

	addItemBtn() {
		console.log("adding...");
	}

	render() {

		let itemsStr = false;
		let itemsPoolStr = false;
		if (this.props.showMissionPool === true) {
			// show missions as mission pool
			itemsStr = this.props.missionPool.map( (item, index) => {
				return <Item key={item.guid} showInMissonPool {...item} even={index%2}/>
			});

			itemsPoolStr = this.props.schedule.map( (scheduleItem) => {

				let setItemsStr = [...scheduleItem.missions.entries()].map( (item, index) => {
					let mission = this.props.missionPool.find((itemFromPool) => {
						return itemFromPool.guid === item[0]
					});
					return <Item key={mission.guid} {...mission} even={index%2}/>
				})

				let result = [setItemsStr];
				return result;
			});

		} else {
			// show missions as schedule
			itemsStr = this.props.schedule.map( (scheduleItem) => {

				let setItemsStr = [...scheduleItem.missions.entries()].map( item => {
					let mission = this.props.missionPool.find( (itemFromPool) => {
						return itemFromPool.guid === item[0] 
					});
					return <Item key={mission.guid} {...mission} />
				})

				let result = [setItemsStr];
				return result;
			});
		}

		return (
			<main className={style.wrapper}>
				
				<header className={style.row}>
					<Header/>
				</header>

				<Menu />
				
				{/* {this.props.showMissionPool ? <h2>Пул миссий</h2> : <h2>Расписание на 01.02.2019</h2>} */}
				<div><h2>Пул миссий</h2></div>
				<ItemHeader />
				{itemsStr}
				<div id="schedule" className={style.dummyPlaceholder}></div>
				<div><h2 >Расписание</h2></div>
				{itemsPoolStr}
				<div className={style.viewHeight}></div>

				{this.props.showAddMissionComponent !== true ? <div className={style.fullscreenWrapper}><AddMission /></div> : null}
			
			</main>
		);
	}
	
}

const mapStateToProps = (state) => {
	return {
		user : state.user,
		missionPool : state.missionPool,
		schedule : state.schedule,
		showMissionPool: state.showMissionPool,
		showAddMissionComponent: state.showAddMissionComponent,
		db: state.firebase.db
	}
} 

const mapDispatchToProps = (dispatch) => {
	return {
		getAllMissions: () => {
			actionType.getAllMissions(dispatch)
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
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
