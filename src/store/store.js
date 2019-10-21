import * as actionType from "~s/actions.js";
import * as utils from "~u/utils.js";
import * as templates from "~u/objectTemplates.js";



let defState = {
	user : utils.defUser,
	showMissionPool: true,
	showUserMenu: false,
	// missionPool: [ {missionItem}, {missionItem}, ... ]
	missionPool : [],
	// schedule : [ {date: date, missions: new Set()}, ...]
	schedule : []
}

function probabilityFunc(rate) {
	return (rate*2-1)
}

const Store = (state = defState, action) => {
	let newState = Object.assign({}, state);
	switch (action.type) {
		
	/* ADD_MISSIONS usage:
		action.Type : ADD_MISSIONS,
		payload     : [ {missionItem}, ... ]
	*/
		case actionType.ADD_MISSIONS: 

			if (action.payload.some(item => { 
				return !utils.shallowEqual(item, templates.missionItem)
			})) {
				throw new Error("Payload should be an array of objects with 'missionItem' fields")
			};

			newState.missionPool = newState.missionPool.concat(action.payload);
			return newState;

	/* SHOW_MISSION_POOL_TOGGLE */
		case actionType.SHOW_MISSION_POOL_TOGGLE:
			newState.showMissionPool = !newState.showMissionPool;
			return newState;
		
	/* SHOW_MISSION_POOL_TOGGLE */
		case actionType.SHOW_USER_MENU_TOGGLE:
			newState.showUserMenu = !newState.showUserMenu;
			return newState;

	/* UPDATE_PROPABILITIES */
		case actionType.UPDATE_PROPABILITIES:	
			let sum = newState.missionPool.reduce((acc, item) => acc + probabilityFunc(item.rateAvg), 0);
			if (sum > 0) {
				let koef = 1 / sum;
				newState.missionPool.forEach( (item) => {
					item.probability = probabilityFunc(item.rateAvg)*koef;
				});
			};
			return newState;

	/* UPATE_MISSIONS_ORDER*/
		case actionType.UPATE_MISSIONS_ORDER:
			newState.missionPool = action.payload.missionPool;
			return newState;
	/* ADD_RANDOM_MISSIONS */
		case actionType.ADD_RANDOM_MISSIONS:
				newState.schedule = [ {date:action.payload.date, missions: new Set()} ];
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

	/* ADD_MISSION_TO_SCHEDULE usage:
		action.Type : ADD_MISSION_TO_SCHEDULE,
		payload     : {data, guid: item.guid}
	*/	
		case actionType.ADD_MISSION_TO_SCHEDULE:
			if (!utils.shallowEqual(action.payload, templates.scheduleMission)) {
				throw new Error("Payload should be an objects with fields 'data' and 'guid'")
			}
			
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
				newState.schedule[newState.schedule.length - 1].missions.add(action.payload.guid);
			}
			return newState;

	/* REMOVE_MISSION_FROM_SCHEDULE usage:
		action.Type : REMOVE_MISSION_FROM_SCHEDULE,
		payload     : [ {data, guid: item.guid}, ... ]
	*/
		case actionType.REMOVE_MISSION_FROM_SCHEDULE:
			let index = newState.schedule.findIndex( (item) => item.date === action.payload.date);
			if (index < 0) break;
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
			break;

	/*UPDATE_USER_INFO*/		
		case actionType.UPDATE_USER_INFO:
			/* eslint-disable */
			if (action.payload != undefined && action.payload.user != undefined) {
				newState.user = Object.assign({}, utils.defUser, action.payload.user) ;
			} else {
				newState.user = utils.defUser;
			}
			/* eslint-enable */
			
			return newState;

	/*UPDATE_MISSION_RATE usage:
		action.Type : UPDATE_MISSION_RATE,
		payload     : [ {guid: guid, rate: rate} ]
	*/
		case actionType.UPDATE_MISSION_RATE:		

			let missionIndex = newState.missionPool.findIndex( (item) =>{
				return item.guid === action.payload.guid
			})
			let missionPool = newState.missionPool.slice(0);
			let mission = Object.assign( {}, newState.missionPool[missionIndex]);
			mission.rateAvg = action.payload.rate;
			missionPool[missionIndex] = mission;
			newState.missionPool = missionPool;

			Store( newState, {
				type: actionType.UPDATE_PROPABILITIES
			});
			return newState;

		default:			
			return newState;
	}
	
}

export default Store;