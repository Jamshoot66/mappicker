import React from "react";
import style from "./app.module.scss";

import {connect} from "react-redux";
import * as actionType from "~s/actions.js";

// import Header from "~c/header/header.jsx";
// import Menu from "~c/menu/menu.jsx";
// import Item from "~c/item/item.jsx";
// import ItemHeader from "~c/item/itemHeader.jsx";
// import AddMission from "~c/addMission/addMission.jsx";
// import Spinner from "~c/spinner/spinner.jsx";

// import { initFirebase } from "~u/firebase.js";
import * as utils from "~u/utils.js";

import * as firebase from "firebase/app";
import 'firebase/firestore';

import MainPage from "~p/mainPage/mainPage.jsx";

class App extends React.Component {
	constructor(props){
		super(props);

		let callback = async (firebaseUser) => {
			if (firebaseUser != null) {
				
				let db = firebase.firestore();
				let info = (await db.collection("users").doc(firebaseUser.uid).get()).data();
				let user;			
				if (info != null) {
					user = Object.assign({},
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
								canRead: info.canRead,
								canSuperuser: info.canSuperuser
							}
						});
				} else {
					user = Object.assign({}, utils.defUser, {
						auth: true,
						uid: firebaseUser.uid,
						shortName: firebaseUser.displayName,
						name: firebaseUser.displayName,
					});  
				}

				try {
					await this.props.updateUserInfo(user);
					if (user.rights.canRead) { await this.props.getAllMissions() }
					if (user.rights.canAdd) { await this.props.getAllSchedule() }
				} catch (e) {
					console.log(e);
				}	
			}
		}

		firebase.auth().onAuthStateChanged(callback);
	}

	componentDidMount(){
		this.props.updatePropabilities();
	}

	async componentDidUpdate(prevProps) {
		if (this.props.user.rights.canRead !== prevProps.user.rights.canRead || 
			this.props.user.rights.canRate !== prevProps.user.rights.canRate ||
			this.props.user.rights.canAdmin !== prevProps.user.rights.canAdmin ||
			this.props.user.rights.canSuperuser !== prevProps.user.rights.canSuperuser) {
			await this.props.getAllMissions()
		}

		if (this.props.user.rights.canAdd !== prevProps.user.rights.canAdd) {
			await this.props.getAllSchedule()
		}

		if (this.props.user.uid !== prevProps.user.uid && this.props.user.uid != null) {
			firebase.firestore().collection("users").doc(this.props.user.uid).onSnapshot((snap) => {	
				if (snap.data() != null) {
					let info = snap.data();
					let newUser = Object.assign({}, this.props.user);
					let rights = {
						canAdd: info.canAdd,
						canAdmin: info.canAdmin,
						canRate: info.canRate,
						canRead: info.canRead,
						canSuperuser: info.canSuperuser
					}
					newUser.unit = `[${info.unit.toUpperCase()}]`;
					newUser.rights = rights;
					this.props.updateUserInfo(newUser);
				}
			});	
		}
	}

	render() {
		return( <MainPage/>)
	} 
	
}

const mapStateToProps = (state) => {
	return {
		user : state.user,
		missionPool: state.missionPool,
		syncScheduleState: state.syncScheduleState,
		schedule : state.schedule,
		showMissionPool: state.showMissionPool,
		showAddMissionComponent: state.showAddMissionComponent,
		db: state.firebase.db,
		currentScheduleDate: state.currentScheduleDate
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
