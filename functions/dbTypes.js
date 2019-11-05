module.exports.collections = {
    users: "users",
    missions: "maps"
}

module.exports.default = {
    defUser: {
        canRead: true,
        canRate: false,
        canAdmin: false,
        canAdd: false,
        canSuperuser: false,
        unit: "null"
    },

    defMission: {
        guid: "check doc name",
		name:"unknown name",
		mods: "mods",
        island: "island",
        fileName:"fileName",
		players: 1,
		author: "unknown",
		rateAvg: 3,
		rates:{},
		lastPlayed: 0
    },

    requiredMissionFields: {
		name:"unknown name",
		mods: "mods",
        island: "island",
        fileName:"fileName",
		players: 1,
		author: "unknown",
    }
}

/**
 * @description do a shallow equality of obj1 to obj2 (not obj2 to ob1). Tests only enumerable object keys
 * 
 * @param {Object} obj1 - common object
 * @param {Object} obj2 - common object
 */
module.exports.validMission = function(obj1, obj2) {

	for (let key of Object.getOwnPropertyNames(obj1)) {	
		if (!Object.prototype.hasOwnProperty.call(obj2, key)) { return false }
	} 
	
    return true;
}