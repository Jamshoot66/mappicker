import * as firebase from "firebase/app";
import * as firebaseConst from "~u/firebase.js";
import * as mock from "./mockData.js";
import * as utils from "~u/utils.js";

// import undefined from "firebase/empty-import";
// import * as templates from "~u/objectTemplates.js";


// export const TEST_ACTION = "TEST_ACTION";
export const ADD_MISSIONS = "ADD_MISSIONS";
export const GET_MISSIONS = "GET_MISSIONS";
export const SET_FIREBASE = "SET_FIREBASE";
export const ADD_MISSION_TO_SCHEDULE = "ADD_MISSION_TO_SCHEDULE";
export const REMOVE_MISSION_FROM_SCHEDULE = "REMOVE_MISSION_FROM_SCHEDULE";
export const SHOW_MISSION_POOL_TOGGLE = "SHOW_MISSION_POOL_TOGGLE";
export const UPDATE_MISSION_RATE = "UPDATE_MISSION_RATE";
export const UPDATE_SYNC_RATE_STATE = "UPDATE_SYNC_RATE_STATE";
export const UPDATE_PROPABILITIES = "UPDATE_PROPABILITIES";
export const UPATE_MISSIONS_ORDER = "UPATE_MISSIONS_ORDER";
export const ADD_RANDOM_MISSIONS = "ADD_RANDOM_MISSIONS";
export const UPDATE_USER_INFO = "UPDATE_USER_INFO";
export const SHOW_USER_MENU_TOGGLE = "SHOW_USER_MENU_TOGGLE";
export const SHOW_ADD_MISSION_COMPONENT_TOGGLE = "SHOW_ADD_MISSION_COMPONENT_TOGGLE";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";


export function getAllMissions(dispatch) {
	// let db = firebase.firestore();
	/* eslint-disable */
	if (firebase.auth().currentUser != undefined) {
	/* eslint-enable */
		
		firebase.auth().currentUser.getIdToken().then(token => {
			fetch(firebaseConst.FUNCTIONS_URL_BASE+firebaseConst.GET_MISSIONS, {
				credentials: "include",
				method: "GET",
				headers: {
					"content-type": "application/json",
					"authorization": token
				}		
			}).then((r) => {
				return r.json()
			}).then((json) => {
				json.forEach((item) => {
					if (item.link === undefined) {
						item.link = `https://www.google.com/search?q=${item.name}&as_sitesearch=red-bear.ru`
					}
				});
				dispatch( {
					type: ADD_MISSIONS,
					payload: json		
					// payload: mock.missions		
				})
			}).catch(err => {
				console.log(err);
			})
		
		});
	}
}

export async function addMissionToServer(dispatch, payload) {
	return firebase.auth().currentUser.getIdToken().then(token => {
		return fetch(firebaseConst.FUNCTIONS_URL_BASE + firebaseConst.ADD_MISSION, {
			credentials: "include",
			method: "POST",
			headers: {
				"content-type": "application/json",
				"authorization": token
			},
			body: JSON.stringify({
				mission: payload
			})
		}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json.guid);
			let mission = payload;
			mission.guid = json.guid;
			dispatch({
				type: ADD_MISSIONS,
				payload: [mission]
			})
		})
	}).catch(e => {
		console.log(e);	
		throw new Error(e.message);
	})	
}

export async function loginViaGmail(dispatch){
	
	let provider = new firebase.auth.GoogleAuthProvider();
	try {
		await firebase.auth().signInWithPopup(provider);
		let firebaseUser = firebase.auth().currentUser;

		let user = {
			auth : true,
			unit : utils.defUser.unit,
			shortName : firebaseUser.displayName,
			name : firebaseUser.displayName
		}

		dispatch( {
			type: UPDATE_USER_INFO,
			payload: {
				user
			}		
		})
	} catch (err) {
		alert(err)
	}
}

export async function logoutFromServer(dispatch){
	await firebase.auth().signOut();
	dispatch( {
		type: UPDATE_USER_INFO
	})
}

export function syncMissionRate(dispatch, props) {

	/* eslint-disable */
	if (firebase.auth().currentUser != undefined) {
	/* eslint-enable */

		firebase.auth().currentUser.getIdToken().then(token => {
			
			dispatch({
				type: UPDATE_SYNC_RATE_STATE,
				payload: {
					guid: props.guid,
					syncRateState: "PENDING"
				}
			})
			fetch(firebaseConst.FUNCTIONS_URL_BASE + firebaseConst.RATE_MISSION, {
				credentials: "include",
				method: "POST",
				headers: {
					"content-type": "application/json",
					"authorization": token
				},
				body: JSON.stringify({
					"mission_id": props.guid,
					"rate": props.rate
				})
			}).then((r) => {
				return r.json()
			}).then((resp) => { 

				dispatch({
					type: UPDATE_MISSION_RATE,
					payload: {
						guid: props.guid,
						rate: resp.rateAvg
					}
				})

				dispatch({
					type: UPDATE_SYNC_RATE_STATE,
					payload: {
						guid: props.guid,
						syncRateState: "DONE"
					}
				})

			}).catch(err => {
				dispatch({
					type: UPDATE_SYNC_RATE_STATE,
					payload: {
						guid: props.guid,
						syncRateState: "ERROR"
					}
				})
				console.log(err);
			})
		
		});
	}

}