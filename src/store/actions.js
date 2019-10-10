import * as firebase from "firebase/app";
import * as mock from "./mockData.js";

// export const TEST_ACTION = "TEST_ACTION";
export const ADD_MISSIONS = "ADD_MISSIONS";
export const GET_MISSIONS = "GET_MISSIONS";
export const ADD_MISSION_TO_SCHEDULE = "ADD_MISSION_TO_SCHEDULE";
export const REMOVE_MISSION_FROM_SCHEDULE = "REMOVE_MISSION_FROM_SCHEDULE";
export const SHOW_MISSION_POOL_TOGGLE = "SHOW_MISSION_POOL_TOGGLE";
export const UPDATE_MISSION_RATE = "UPDATE_MISSION_RATE";
export const UPDATE_PROPABILITIES = "UPDATE_PROPABILITIES";
export const ADD_RANDOM_MISSIONS = "ADD_RANDOM_MISSIONS";
export const UPDATE_USER_INFO = "UPDATE_USER_INFO";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";


export function getAllMissions(dispatch){
	dispatch( {
		type: GET_MISSIONS,
		payload: mock.missions		
	})
}



export async function loginViaGmail(dispatch){
	
	let provider = new firebase.auth.GoogleAuthProvider();
	await firebase.auth().signInWithPopup(provider);
	let firebaseUser = firebase.auth().currentUser;

	let user = {
		auth : true,
		unit : "без отряда",
		shortName : firebaseUser.displayName,
		name : firebaseUser.displayName
	}

	dispatch( {
		type: UPDATE_USER_INFO,
		payload: {
			user
		}		
	})
}

export async function logoutFromServer(dispatch){
	await firebase.auth().signOut();
	dispatch( {
		type: UPDATE_USER_INFO
	})
}

