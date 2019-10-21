import * as firebase from "firebase/app";
import * as mock from "./mockData.js";
import * as utils from "~u/utils.js"


// export const TEST_ACTION = "TEST_ACTION";
export const ADD_MISSIONS = "ADD_MISSIONS";
export const GET_MISSIONS = "GET_MISSIONS";
export const ADD_MISSION_TO_SCHEDULE = "ADD_MISSION_TO_SCHEDULE";
export const REMOVE_MISSION_FROM_SCHEDULE = "REMOVE_MISSION_FROM_SCHEDULE";
export const SHOW_MISSION_POOL_TOGGLE = "SHOW_MISSION_POOL_TOGGLE";
export const UPDATE_MISSION_RATE = "UPDATE_MISSION_RATE";
export const UPDATE_PROPABILITIES = "UPDATE_PROPABILITIES";
export const UPATE_MISSIONS_ORDER = "UPATE_MISSIONS_ORDER";
export const ADD_RANDOM_MISSIONS = "ADD_RANDOM_MISSIONS";
export const UPDATE_USER_INFO = "UPDATE_USER_INFO";
export const SHOW_USER_MENU_TOGGLE = "SHOW_USER_MENU_TOGGLE";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";


export function getAllMissions(dispatch){
	dispatch( {
		type: ADD_MISSIONS,
		payload: mock.missions		
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

		console.log(user);
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

