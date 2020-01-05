import * as firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';

// backend urls
let _FUNCTIONS_URL_BASE = "";
let _DB_URL_BASE = "";

// if (process.env.NODE_ENV === "production") {
_FUNCTIONS_URL_BASE = "https://us-central1-mapick-rb.cloudfunctions.net";
_DB_URL_BASE = "https://mapick-rb.firebaseio.com";
// }

export const FUNCTIONS_URL_BASE = _FUNCTIONS_URL_BASE;
export const DB_URL_BASE = _DB_URL_BASE;

//backend functions
export const ADD_MISSION = "/addMission";
export const UPDATE_MISSION = "/updateMission";
export const ADD_SCHEDULE = "/addSchedule";
export const GET_SCHEDULE = "/getSchedule";
export const GET_MISSIONS = "/getMissions";
export const GET_USER_INFO = "/getUserInfo";
export const RATE_MISSION = "/rateMission";
export const UPDATE_LAST_PLAYED = "/updateLastPlayed";

const firebaseConfig = {
	apiKey: "AIzaSyCq5oBQaNvE_jN7WmqikJ59MEIJr3bvD-M",
	authDomain: "mapick-rb.firebaseapp.com",
	databaseURL: "https://mapick-rb.firebaseio.com",
	projectId: "mapick-rb",
	storageBucket: "mapick-rb.appspot.com",
	messagingSenderId: "120362856727",
	appId: "1:120362856727:web:2a5db344ff8338feae4752"
}

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

/*
export const initFirebase =  ( userStateChangeCallback = () => {}) => {
	firebase.initializeApp(firebaseConfig);
	firebase.auth().onAuthStateChanged(userStateChangeCallback);

	return {
		db: firebase.firestore()
	};
}
*/
