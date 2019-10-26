import React from "react";
import style from "./app.module.scss";

import {connect} from "react-redux";
import * as actionType from "~s/actions.js";

import Header from "~c/header/header.jsx";
import Menu from "~c/menu/menu.jsx";
import Item from "~c/item/item.jsx";
import ItemHeader from "~c/item/itemHeader.jsx";

import { initFirebase } from "~u/firebase.js";
// import * as utils from "~/utils.js";

class App extends React.Component {
	constructor(props){
		super(props);
		initFirebase( (firebaseUser) => {

			/* eslint-disable */
			if (firebaseUser != undefined){
			
					let user = {
						auth : true,
						shortName : firebaseUser.displayName,
						name : firebaseUser.displayName
					}

				console.log(firebaseUser);
				this.props.updateUserInfo(user);
			}
			/* eslint-enable */
			
		});
	}

	componentDidMount(){
		this.props.getAllMissions();
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
				<button onClick={this.addItemBtn}>Add item</button>
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
			
			</main>
		);
	}
	
}

const mapStateToProps = (state) => {
	return {
		missionPool : state.missionPool,
		schedule : state.schedule,
		showMissionPool: state.showMissionPool
	}
} 

const mapDispatchToProps = (dispatch) => {
	return {
		getAllMissions: () => {
			actionType.getAllMissions(dispatch)
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