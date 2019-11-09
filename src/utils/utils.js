/**
 * @description do a shallow equality of obj1 and obj2. Tests only enumerable object keys
 * 
 * @param {Object} obj1 - common object
 * @param {Object} obj2 - common object
 */
export function shallowEqual(obj1, obj2) {

	for (let key of Object.getOwnPropertyNames(obj1)) {	
		if (!Object.prototype.hasOwnProperty.call(obj2, key)) { return false };
	} 
	
	for (let key of Object.getOwnPropertyNames(obj2)) {
		if (!Object.prototype.hasOwnProperty.call(obj1, key)) { return false };
	}
	
    return true;
}

/**
 * @description do a shallow equality of obj1 to obj2 (not obj2 to ob1). Tests only enumerable object keys
 * 
 * @param {Object} obj1 - common object
 * @param {Object} obj2 - common object
 */
export function validMission(obj1, obj2) {

	for (let key of Object.getOwnPropertyNames(obj1)) {	
		if (!Object.prototype.hasOwnProperty.call(obj2, key)) { return false };
	} 
	
    return true;
}

/**
 * @description compares item to empty string "", zero number "", NaN, null, undefined
 * 
 * @param {any} item - any item
 * 
 */
export function isEmpty(item) {
	return (	item === "" 		||
				Number(item) === 0 	||
				(typeof item === "number" && isNaN(item))  		||
				item === null 		||
				item === undefined 
	)
}

export const defUser = {
	auth: false,
	authedUnit: false,
	unit: "null",
	uid: null,
	shortName : "Комрад",
	name: "Комрад",
	rights: {
		canRead: true,
		canRate: false,
		canAdd: false,
		canAdmin: false,
		canSuperuser: false
	}
}