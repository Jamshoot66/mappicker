import * as firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyCq5oBQaNvE_jN7WmqikJ59MEIJr3bvD-M",
	authDomain: "mapick-rb.firebaseapp.com",
	databaseURL: "https://mapick-rb.firebaseio.com",
	projectId: "mapick-rb",
	storageBucket: "mapick-rb.appspot.com",
	messagingSenderId: "120362856727",
	appId: "1:120362856727:web:2a5db344ff8338feae4752"
}

export const initFirebase = ( userStateChangeCallback = () => {}) => {
	firebase.initializeApp(firebaseConfig);

	firebase.auth().onAuthStateChanged( userStateChangeCallback);
	
}
