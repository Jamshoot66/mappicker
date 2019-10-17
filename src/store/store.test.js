import Store from "./store.js";
import {createStore} from "redux";
import * as actionType from "./actions.js";
import * as mockData from "./mockData.js";



// TODO: add tests for uncritical actions:
// export const GET_MISSIONS = "GET_MISSIONS";
// export const ADD_MISSION_TO_SCHEDULE = "ADD_MISSION_TO_SCHEDULE";
// export const REMOVE_MISSION_FROM_SCHEDULE = "REMOVE_MISSION_FROM_SCHEDULE";
// export const UPDATE_MISSION_RATE = "UPDATE_MISSION_RATE";
// export const UPATE_MISSIONS_ORDER = "UPATE_MISSIONS_ORDER";
// export const ADD_RANDOM_MISSIONS = "ADD_RANDOM_MISSIONS";
// export const UPDATE_USER_INFO = "UPDATE_USER_INFO";
// export const LOGIN = "LOGIN";
// export const LOGOUT = "LOGOUT";

describe("Testing Store", () => {
    it("Should run action ADD_MISSIONS without crash and add some to store", () => {
        let store = createStore(Store);
        let error = null;
        try {
            store.dispatch({
                type: actionType.ADD_MISSIONS,
                payload: mockData.missions
            });
        } catch (e) {
            error = e;
        }
        
        expect(error).toBeNull();
        expect(store.getState().missionPool.length).toBe(mockData.missions.length);
    });

    it("Should run action SHOW_MISSION_POOL_TOGGLE without crash", () => {
        let store = createStore(Store);
        let error = null;
        let showMissionPool = store.getState().showMissionPool;
        try {
            //toggle twice
            store.dispatch({
                type: actionType.SHOW_MISSION_POOL_TOGGLE
            });
            store.dispatch({
                type: actionType.SHOW_MISSION_POOL_TOGGLE
            });
        } catch (e) {
            error = e;
        }
        expect(error).toBeNull();
        expect(showMissionPool).toBe(store.getState().showMissionPool);
    });

    it("Should run action UPDATE_PROPABILITIES without crash", () => {
        let store = createStore(Store);
        let error = null;
        try {
            store.dispatch({
                type: actionType.ADD_MISSIONS,
                payload: mockData.missions
            })
            store.dispatch({
                type: actionType.UPDATE_PROPABILITIES
            });
        } catch (e) {
            error = e;
        }

        expect(error).toBeNull();
        expect(store.getState().missionPool.every(item => {
            return typeof item.probability === "number" &&
                !isNaN(item.probability);
        })).toBe(true);
    });
});