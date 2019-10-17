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