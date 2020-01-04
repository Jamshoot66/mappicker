import * as actionType from "~s/actions.js";
import * as utils from "~u/utils.js";
import * as templates from "~u/objectTemplates.js";
/* eslint-disable */
import {PENDING, DONE, ERROR} from "~c/spinner/spinner.jsx";
/* eslint-enable */

let defState = {
	user: utils.defUser,
	firebase: {},
	page: actionType.pages.INIT,
	showMissionPool: true,
	showUserMenu: false,
	showAddMissionComponent: false,
	showFilterMissionsComponent: false,
	// currentScheduleDate: 0,
	currentSchedule: {
		date: 0,
		missions: []
	},
	syncScheduleState: DONE,
	// missionPool: [ {missionItem}, {missionItem}, ... ]
	missionPool : [],
	// missionPool: [ {missionItem}, {missionItem}, ... ]
	filteredMissionPool : [],
	// schedule : [ {date: date, missions: new Set()}, ...]
	schedule : []
}

const Store = (state = defState, action) => {
	let newState = Object.assign({}, state);

	switch (action.type) {
		
	/* ADD_MISSIONS usage:
		action.Type : ADD_MISSIONS,
		payload     : [ {missionItem}, ... ]
	*/
		case actionType.ADD_MISSIONS: 
			return addMissions(state, action);
		
	/* FILTER_MISSIONS usage:
		action.Type : FILTER_MISSIONS,
		payload     : {filterString, isEasy... }
	*/
		case actionType.FILTER_MISSIONS: 
			return filterMissions(state, action);
		
	/* CLEAR_MISSIONS usage:
		action.Type : CLEAR_MISSIONS
	*/
		case actionType.CLEAR_MISSIONS: 
			newState.missionPool = [];
			return newState;
		
	/* SET_PAGE usage:
		action.Type : SET_PAGE,
		payload     : {page: "page_state"}
	*/
		case actionType.SET_PAGE: 
			newState.page = action.payload.page;
			return newState;
			
	/* SHOW_MISSION_POOL_TOGGLE */
		case actionType.SHOW_MISSION_POOL_TOGGLE:
			newState.showMissionPool = !newState.showMissionPool;
			return newState;
		
	/* SET_FIREBASE */
		case actionType.SET_FIREBASE:
			newState.firebase = action.payload.firebase;
			return newState;
		
	/* SHOW_USER_MENU_TOGGLE */
		case actionType.SHOW_USER_MENU_TOGGLE:
			newState.showUserMenu = !newState.showUserMenu;
			return newState;
		
	/* SHOW_ADD_MISSION_COMPONENT_TOGGLE */
		case actionType.SHOW_ADD_MISSION_COMPONENT_TOGGLE:
			newState.showAddMissionComponent = !newState.showAddMissionComponent;
			return newState;
		
	/* SHOW_FILTER_MISSION_POPUP_TOGGLE */
		case actionType.SHOW_FILTER_MISSION_POPUP_TOGGLE:
			newState.showFilterMissionsComponent = !newState.showFilterMissionsComponent;
			return newState;

	/* UPDATE_PROPABILITIES */
		case actionType.UPDATE_PROPABILITIES:	
			return updateProbabilities(state, action);

	/* UPDATE_MISSIONS_ORDER*/
		case actionType.UPDATE_MISSIONS_ORDER:
			newState.missionPool = action.payload.missionPool;
			return newState;
		
	/* ADD_RANDOM_MISSIONS */
		case actionType.ADD_RANDOM_MISSIONS:
			return addRandomMissions(state, action);

	/* ADD_MISSION_TO_SCHEDULE usage:
		action.Type : ADD_MISSION_TO_SCHEDULE,
		payload     : {data, guid: item.guid}
	*/	
		case actionType.ADD_MISSION_TO_SCHEDULE:		
			return addMissionToSchedule(state, action);
		
	/* SET_SYNC_SCHEDULE_STATE usage:
		action.Type : SET_SYNC_SCHEDULE_STATE,
		payload     : {state}
	*/	
		case actionType.SET_SYNC_SCHEDULE_STATE:		
			newState.syncScheduleState = action.payload.state;
			return newState;
		
	/* UPDATE_MISSION_LASTPLAYED usage:
		action.Type : UPDATE_MISSION_LASTPLAYED,
		payload     : {date, missions:[guid, guid...]}
	*/	
		case actionType.UPDATE_MISSION_LASTPLAYED:	
			return updateMissionLastPlayed(state, action);
		
	/* SET_SCHEDULE usage:
		action.Type : SET_SCHEDULE,
		payload     : [{data, [guids]}]
	*/	
		case actionType.SET_SCHEDULE:		
			return setSchedule(state, action);
		
	/* GET_SCHEDULE usage:
		action.Type : GET_SCHEDULE,
		payload     : {date}
	*/	
		case actionType.GET_SCHEDULE:		
			return getSchedule(state, action);
				
	/* SET_CURRENT_SCHEDULE_DATE usage:
		action.Type : SET_CURRENT_SCHEDULE_DATE,
		payload     : {date}
	*/	
		case actionType.SET_CURRENT_SCHEDULE_DATE:
			console.warn("SET_CURRENT_SCHEDULE_DATE is depricated. Use GET_SCHEDULE.");
			let newCurrentSchedule = Object.assign({}, newState.currentSchedule);
			newCurrentSchedule.date = action.payload.date;
			newState.currentSchedule = newCurrentSchedule;
			return newState;

	/* REMOVE_MISSION_FROM_SCHEDULE usage:
		action.Type : REMOVE_MISSION_FROM_SCHEDULE,
		payload     : [ {data, guid: item.guid}, ... ]
	*/
		case actionType.REMOVE_MISSION_FROM_SCHEDULE:
			return removeMissionFromSchedule(state, action);

	/*UPDATE_USER_INFO*/		
		case actionType.UPDATE_USER_INFO:
			return updateUserInfo(state, action);

	/*UPDATE_MISSION_RATE usage:
		action.Type : UPDATE_MISSION_RATE,
		payload     : [ {guid: guid, rate: rate} ]
	*/
		case actionType.UPDATE_MISSION_RATE:
			return updateMissionRate(state, action);

	/*UPDATE_SYNC_RATE_STATE usage:
		action.Type : UPDATE_SYNC_RATE_STATE,
		payload     : [ {guid: guid, syncRateState: "PENDING || ERROR || DONE"} ] 
	*/
		case actionType.UPDATE_SYNC_RATE_STATE:
			return updateSyncRateState(state, action);
		
		default:			
			return newState;
	}
}

export default Store;

function addMissions(state, action) {
	let newState = Object.assign({}, state);

	if (action.payload.some(item => { 
		return !utils.validMission(templates.missionItem, item)
	})) {
		throw new Error("Payload should be an array of objects with 'missionItem' fields")
	};

	newState.missionPool = newState.missionPool.concat(action.payload);
	updateProbabilities(newState, action)
	return newState;
}

/* FILTER_MISSIONS usage:
		action.Type : FILTER_MISSIONS,
		payload     : {filterString, isEasy... }
	*/
function filterMissions(state, action) {
	let newState = Object.assign({}, state);
	if (action.payload == null) {
		newState.filteredMissionPool = newState.missionPool.slice();
		return newState;
	};

	newState.filteredMissionPool = newState.missionPool.filter((mission) => {
		return (
			mission.name.toLowerCase().includes(action.payload.filterString.toLowerCase()) ||
			mission.mods.toLowerCase().includes(action.payload.filterString.toLowerCase()) ||
			mission.island.toLowerCase().includes(action.payload.filterString.toLowerCase()) ||
			mission.author.toLowerCase().includes(action.payload.filterString.toLowerCase())
		)
	})
	return newState;
}



function addRandomMissions(state, action) {
	let newState = Object.assign({}, state);

	newState.schedule = [{ date: action.payload.date, missions: new Set() }];
	let propLine = [];
	let acc = 0
	newState.missionPool.forEach( (item) => {
		acc += item.probability;
		propLine.push({
			guid: item.guid,
			maxProp: acc
		});
	});
	let guids = new Set();
	while (guids.size < 4) {
		let rnd = Math.random();
		let guid = propLine.find( (item) => {
			return item.maxProp > rnd
		}).guid;

		guids.add( guid )
	}

	guids.forEach( (item) => {
		Store(newState, 
			{
				type: actionType.ADD_MISSION_TO_SCHEDULE,
				payload: {
					date:action.payload.date, 
					guid:item} 
			});
	});
	return newState;
}

function removeMissionFromSchedule(state, action) {
	let newState = Object.assign({}, state);
	let index = newState.schedule.findIndex((item) => item.date === action.payload.date);
	if (index < 0) return newState;
	let schedule = newState.schedule.slice(0);
	let elem = Object.assign({}, newState.schedule[index]);
	let missions = new Set(elem.missions);
	let done = missions.delete( action.payload.guid);
	if (done) {
		elem.missions = missions;
		schedule[index] = elem;
		newState.schedule = schedule;
		return newState;
	};
}

function updateUserInfo(state, action) {
	let newState = Object.assign({}, state);
	/* eslint-disable */
	if (action.payload != undefined && action.payload.user != undefined) {
		newState.user = Object.assign({}, utils.defUser, action.payload.user) ;
	} else {
		newState.user = utils.defUser;
	}
	/* eslint-enable */
	return newState;
}


function setSchedule(state, action) {
	let newState = Object.assign({}, state);
	newState.schedule = [];
	for (let item of action.payload) {
		let scheduleItem = {
			date: +item.date,
			missions: new Set(item.missions)
		}
		
		newState.schedule.push(scheduleItem)
	}
	
	return newState;
}

function getSchedule(state, action) {
	let newState = Object.assign({}, state);

	let newCurrentSchedule = {
		date: action.payload.date,
		missions: []
	};
	//get schedule with payload.date
	let scheduleItem = newState.schedule.find(item => {
		return item.date === action.payload.date
	});

	if (scheduleItem != null) {
	//for each guid in found schedule get mission with its guid
		scheduleItem.missions.forEach(guidInSchedule => {
			let mission = newState.missionPool.find(itemInMissionPool => {
				return itemInMissionPool.guid === guidInSchedule
			})
			if (mission != null) {
				newCurrentSchedule.missions.push(mission)
			}
		})
	}
	

	
	newState.currentSchedule = newCurrentSchedule;
	return newState;
}


function addMissionToSchedule(state, action) {
	let newState = Object.assign({}, state);

	if (!utils.shallowEqual(action.payload, templates.scheduleMission)) {
		throw new Error("Payload should be an objects with fields 'data' and 'guid'")
	}

	if (action.payload.date <= 0) {return state}
	
	let dateInSchedule = false;
	let newSchedule = newState.schedule.slice(0);
	let newMissions;

	for (let i in newSchedule) {
		if (newSchedule[i].date === action.payload.date) {		
			newMissions = new Set(state.schedule[i].missions);	
			newMissions.add(action.payload.guid);
			newSchedule[i].missions = newMissions;
			newState.schedule = newSchedule;
			dateInSchedule = true;
			break;
		} 
	}

	if (!dateInSchedule) {
		newSchedule.push( {
			date: action.payload.date,
			missions: new Set()
		});
		newSchedule[newSchedule.length - 1].missions.add(action.payload.guid);
		newState.schedule = newSchedule;
	}

	return newState;
}



function updateMissionRate(state, action) {
	let newState = Object.assign({}, state);

	let missionIndex = newState.missionPool.findIndex((item) => {
		return item.guid === action.payload.guid
	})
	let missionPool = newState.missionPool.slice(0);
	let mission = Object.assign( {}, newState.missionPool[missionIndex]);
	mission.rateAvg = action.payload.rate;
	missionPool[missionIndex] = mission;
	newState.missionPool = missionPool;
	newState = updateProbabilities(newState, action);

	return newState;
}

function updateSyncRateState(state, action) {
	let newState = Object.assign({}, state);

	let missionIndex = newState.missionPool.findIndex((item) => {
		return item.guid === action.payload.guid
	})
	let missionPool = newState.missionPool.slice(0);
	let mission = Object.assign( {}, newState.missionPool[missionIndex]);
	mission.syncRateState = action.payload.syncRateState;
	missionPool[missionIndex] = mission;
	newState.missionPool = missionPool;
	newState = updateProbabilities(newState, action);

	return newState;
}

function updateProbabilities(state, action) {
	let newState = Object.assign({}, state);

	let sum = newState.missionPool.reduce((acc, item) => acc +
		probabilityFunc(item.rateAvg, item.lastPlayed), 0);
	if (sum > 0) {
		let koef = 1 / sum;
		newState.missionPool.forEach( (item) => {
			item.probability = probabilityFunc(item.rateAvg, item.lastPlayed)*koef;
		});
	};
	return newState;
}

function probabilityFunc(rate, lastPlayed) {
	const halfYearMs = 0.5 * 30 * 24 * 60 * 60 * 1000;
	let today = Date.now();
	let func = (rate * 10 - 3) * (today - lastPlayed) / halfYearMs;
	if (func < 1.1) { func = 1.1 } 
	let coef = Math.log10(func);
	return coef;
}


function updateMissionLastPlayed(state, action) {
	let newState = Object.assign({}, state);
	let missions = newState.missionPool.slice(0);
	for (let newMissionGuid of action.payload.missions) {
		missions.find(item => {
			return item.guid === newMissionGuid;
		}).lastPlayed = action.payload.date;
	}
	newState.missions = missions;
	return updateProbabilities(newState, action);
}