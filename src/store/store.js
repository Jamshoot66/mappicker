import * as actionType from "~s/actions.js"

let defUser = {
	auth : false,
	name : "Stranger"
}

let defState = {
	user : defUser
}

const Store = (state = defState, action) => {
	return state;
}

export default Store;