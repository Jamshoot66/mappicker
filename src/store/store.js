import * as actionType from "~s/actions.js"

let defUser = {
	auth : false,
	shortName : "Товарищ"
}

let defState = {
	user : defUser,
	showMissionPool : true,
	// missionPool: [ {item}, {item}, ... ]
	missionPool : [],
	// schedule : [ {date, new Set()}, ...]
	schedule : []
}


/*
let testItem = {
			guid: 1,
			name:"Операция «Магистраль»",
			island: "Altis",
			players: 200,
			autor: "Aventador",
			rateAvg: 3,
			rates:[1,2,3,4],
			lastPlayed: 01.02.2019,
			probability: 0.25,
			minimal: true
		}
*/

const Store = (state = defState, action) => {
	let newState = Object.assign({}, state);
	switch (action.type) {
		
		/* ADD_MISSIONS usage:
			action.Type : ADD_MISSIONS,
			payload     : [ {testItem}, ... ]
		*/
		case actionType.GET_MISSIONS: 
			newState = Object.assign({}, state);
			newState.missionPool = newState.missionPool.concat(action.payload);
			return newState;

		case actionType.SHOW_MISSION_POOL_TOGGLE:
				newState.showMissionPool = !newState.showMissionPool;
			return newState;

		case actionType.UPDATE_PROPABILITIES:
			return newState;
		/* ADD_MISSION_TO_SCHEDULE usage:
			action.Type : ADD_MISSION_TO_SCHEDULE,
			payload     : [ {data, guid: item.guid}, ... ]
		*/	
		case actionType.ADD_MISSION_TO_SCHEDULE:
			newState = Object.assign({}, state);
			
			let dateInSchedule = false;
			for( let i in newState.schedule ) {
				if (newState.schedule[i].date === action.payload.date) {
					newState.schedule[i].missions.add(action.payload.guid)
					dateInSchedule = true;
				} 
			}

			if (!dateInSchedule) {
				newState.schedule.push( {
					date: action.payload.date,
					missions: new Set()
				});
				newState.schedule[ newState.schedule.length - 1].missions.add(action.payload.guid)
			}
			return newState;
		
		default:
			break;
	}
	return state;
}

export default Store;