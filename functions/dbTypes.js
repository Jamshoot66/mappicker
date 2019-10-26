module.exports.collections = {
    users: "users",
    missions: "maps"
}

module.exports.default = {
    defUser: {
        canRead: true,
        canRate: false,
        canAdmin: false,
        unit: "null"
    },

    defMission: {
        guid: "check doc name",
		name:"unknown name",
		mods: "mods",
		island: "island",
		players: 1,
		autor: "unknown",
		rateAvg: 3,
		rates:{},
		lastPlayed: 0
    }
}