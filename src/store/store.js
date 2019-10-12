import * as actionType from "~s/actions.js"

let defUser = {
	auth : false,
	unit : "loner",
	shortName : "Товарищ",
	name : "Товарищ"
}

let defState = {
	user : defUser,
	showMissionPool : true,
	// missionPool: [ {item}, {item}, ... ]
	missionPool : [],
	// schedule : [ {date: date, missions: new Set()}, ...]
	schedule : []
}


/* mission item template 
let missionItem = {
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
		payload     : [ {missionItem}, ... ]
	*/
		case actionType.GET_MISSIONS: 
			newState = Object.assign({}, state);
			newState.missionPool = newState.missionPool.concat(action.payload);
			return newState;

	/* SHOW_MISSION_POOL_TOGGLE */
		case actionType.SHOW_MISSION_POOL_TOGGLE:
				newState.showMissionPool = !newState.showMissionPool;
			return newState;

	/* UPDATE_PROPABILITIES */
		case actionType.UPDATE_PROPABILITIES:
			
			let sum = newState.missionPool.reduce( (acc, item) => acc + (item.rateAvg*5-4), 0);
			let koef = 1 / sum;

			newState.missionPool.forEach( (item) => {
				item.probability = (item.rateAvg*5-4)*koef;
			});

			//check sum of propabilities = 1
			// console.log(newState.missionPool.reduce( (acc, i) => acc + i.probability, 0));
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
											maxProp : acc
										})
				});
				// console.log(propLine);
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
		payload     : [ {data, guid: item.guid}, ... ]
	*/	
		case actionType.ADD_MISSION_TO_SCHEDULE:
			
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
	/* REMOVE_MISSION_FROM_SCHEDULE usage:
		action.Type : REMOVE_MISSION_FROM_SCHEDULE,
		payload     : [ {data, guid: item.guid}, ... ]
	*/
		case actionType.REMOVE_MISSION_FROM_SCHEDULE:
			// ищем расписание по дате
			// убираем из стейта
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
				newState.user = action.payload.user;
			} else {
				newState.user = defUser;
			}
			/* eslint-enable */
			
			return newState;
	/* LOGIN */
		case actionType.LOGIN:
			newState.user = action.payload.user;
			return newState;

	/* LOGOUT */
		case actionType.LOGOUT:
			newState.user = defUser;
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
			break;
	}
	return state;
}

export default Store;