import * as firebase from "firebase/app";
import * as firebaseConst from "~u/firebase.js";
import * as mock from "./mockData.js";
import * as utils from "~u/utils.js";
import { DONE, PENDING, ERROR } from "~c/spinner/spinner.jsx";

// import * as templates from "~u/objectTemplates.js";

// export const TEST_ACTION = "TEST_ACTION";
export const ADD_MISSIONS = "ADD_MISSIONS";
export const UPDATE_MISSION = "UPDATE_MISSION";
export const FILTER_MISSIONS = "FILTER_MISSIONS";
export const CLEAR_MISSIONS = "CLEAR_MISSIONS";
export const GET_MISSIONS = "GET_MISSIONS";
export const SET_PAGE = "SET_PAGE";
export const SET_FIREBASE = "SET_FIREBASE";
export const ADD_MISSION_TO_SCHEDULE = "ADD_MISSION_TO_SCHEDULE";
export const SET_CURRENT_MISSION = "SET_CURRENT_MISSION";
export const SET_SCHEDULE = "SET_SCHEDULE";
export const GET_SCHEDULE = "GET_SCHEDULE";
export const REMOVE_MISSION_FROM_SCHEDULE = "REMOVE_MISSION_FROM_SCHEDULE";
export const SET_CURRENT_SCHEDULE_DATE = "SET_CURRENT_SCHEDULE_DATE"; 		//@deprecated
export const UPDATE_MISSION_LASTPLAYED = "UPDATE_MISSION_LASTPLAYED";
export const SET_SYNC_SCHEDULE_STATE = "SET_SYNC_SCHEDULE_STATE";
export const SHOW_MISSION_POOL_TOGGLE = "SHOW_MISSION_POOL_TOGGLE";
export const UPDATE_MISSION_RATE = "UPDATE_MISSION_RATE";
export const UPDATE_SYNC_RATE_STATE = "UPDATE_SYNC_RATE_STATE";
export const UPDATE_PROPABILITIES = "UPDATE_PROPABILITIES";
export const UPDATE_MISSIONS_ORDER = "UPDATE_MISSIONS_ORDER";
export const ADD_RANDOM_MISSIONS = "ADD_RANDOM_MISSIONS";
export const UPDATE_USER_INFO = "UPDATE_USER_INFO";
export const SHOW_USER_MENU_TOGGLE = "SHOW_USER_MENU_TOGGLE";
export const SHOW_ADD_MISSION_COMPONENT_TOGGLE = "SHOW_ADD_MISSION_COMPONENT_TOGGLE";
export const SHOW_FILTER_MISSION_POPUP_TOGGLE = "SHOW_FILTER_MISSION_POPUP_TOGGLE";
export const SHOW_SET_TAGS_POPUP_TOGGLE = "SHOW_SET_TAGS_POPUP_TOGGLE";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const pages = {
	INIT: "INIT",
	PRELOAD: "PRELOAD",
	MAIN: "MAIN"
}

export async function getAllMissions(dispatch) {
	const trueFetch = fetch;
	// fetch = mock.fakeGetData;

	if (firebase.auth().currentUser != null) {
		await firebase.auth().currentUser.getIdToken().then(async token => {
			await fetch(firebaseConst.FUNCTIONS_URL_BASE + firebaseConst.GET_MISSIONS, {
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
					if (utils.isEmpty(item.link)) {
						item.link = `https://www.google.com/search?q=${item.name}&as_sitesearch=red-bear.ru`
					}
				});
				dispatch({
					type: CLEAR_MISSIONS
				});

				dispatch({
					type: ADD_MISSIONS,
					payload: json
				});

				dispatch({
					type: FILTER_MISSIONS,
					payload: null
				});
			}).catch(err => {
				console.log(err);
				throw new Error(err.message);
			})

		});
	}
	fetch = trueFetch;
}



export async function getAllSchedule(dispatch) {
	if (firebase.auth().currentUser != null) {
		await firebase.auth().currentUser.getIdToken().then(async token => {
			await fetch(firebaseConst.FUNCTIONS_URL_BASE + firebaseConst.GET_SCHEDULE, {
				credentials: "include",
				method: "GET",
				headers: {
					"content-type": "application/json",
					"authorization": token
				}
			}).then((r) => {
				if (r.status === 200) {
					return r.json()
				} else {
					return null
				}
			}).then((json) => {
				if (json != null) {
					dispatch({
						type: SET_SCHEDULE,
						payload: json
					})
				}
			}).catch(err => {
				console.log(err);
				throw new Error(err.message);
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

export async function updateMissionOnServer(payload) {
	return firebase.auth().currentUser.getIdToken().then(token => {
		return fetch(firebaseConst.FUNCTIONS_URL_BASE + firebaseConst.UPDATE_MISSION, {
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
			// console.log('update response ', json);
		})
	}).catch(e => {
		console.log(e);
		throw new Error(e.message);
	})
}

export async function updateMission(dispatch, mission) {
	await updateMissionOnServer(mission);
	dispatch({
		type: UPDATE_MISSION,
		payload: mission
	})
}

/**
 * 
 * @param {*} dispatch - redux dispatcher provided due to connect(...) 
 * @param {object} payload - object, with fields:
 * 	{number} date - date in ms
 *  {array} missions - array of mission guids
 */
export async function addScheduleToServer(dispatch, payload) {
	return firebase.auth().currentUser.getIdToken().then(token => {
		return fetch(firebaseConst.FUNCTIONS_URL_BASE + firebaseConst.ADD_SCHEDULE, {
			credentials: "include",
			method: "POST",
			headers: {
				"content-type": "application/json",
				"authorization": token
			},
			body: JSON.stringify({
				dateMs: payload.date,
				missions: payload.missions
			})
		}).then((response) => {
			return response.json();
		})
	}).catch(e => {
		console.log(e);
		throw new Error(e.message);
	})
}

export async function loginViaGmail(dispatch) {

	let provider = new firebase.auth.GoogleAuthProvider();
	try {
		await firebase.auth().signInWithPopup(provider);
		let firebaseUser = firebase.auth().currentUser;

		let user = {
			auth: true,
			unit: utils.defUser.unit,
			shortName: firebaseUser.displayName,
			name: firebaseUser.displayName
		}

		dispatch({
			type: UPDATE_USER_INFO,
			payload: {
				user
			}
		})
	} catch (err) {
		alert(err)
	}
}

export async function logoutFromServer(dispatch) {
	await firebase.auth().signOut();
	dispatch({
		type: UPDATE_USER_INFO
	})
}

export function syncMissionRate(dispatch, props) {

	if (firebase.auth().currentUser != null) {

		firebase.auth().currentUser.getIdToken().then(token => {
			dispatch({
				type: UPDATE_SYNC_RATE_STATE,
				payload: {
					guid: props.guid,
					syncRateState: PENDING
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
						syncRateState: DONE
					}
				})

			}).catch(err => {
				dispatch({
					type: UPDATE_SYNC_RATE_STATE,
					payload: {
						guid: props.guid,
						syncRateState: ERROR
					}
				})
				console.log(err);
			})
		});
	}

}