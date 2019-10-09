import * as mock from "./mockData.js";

// export const TEST_ACTION = "TEST_ACTION";
export const ADD_MISSIONS = "ADD_MISSIONS";
export const GET_MISSIONS = "GET_MISSIONS";
export const ADD_MISSION_TO_SCHEDULE = "ADD_MISSION_TO_SCHEDULE";
export const REMOVE_MISSION_FROM_SCHEDULE = "REMOVE_MISSION_FROM_SCHEDULE";
export const SHOW_MISSION_POOL_TOGGLE = "SHOW_MISSION_POOL_TOGGLE";
export const UPDATE_PROPABILITIES = "UPDATE_PROPABILITIES";
export const ADD_RANDOM_MISSIONS = "ADD_RANDOM_MISSIONS";

export function getAllMissions(dispatch){
	dispatch( {
		type: GET_MISSIONS,
		payload: mock.missions		
	})
}

