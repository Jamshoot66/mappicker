import React from "react";
import Item from "./item.jsx";
import { mount } from "enzyme";
import Store from "~s/store.js";
import { createStore } from "redux";


describe("Testing Item component", () => {
    it("Should render without crash", () => {
        let store = createStore(Store);
        let component = mount(<Item store = {store}/>);
        
        expect(component.exists(".name")).toBe(true);
        expect(component.exists(".mods")).toBe(true);
        expect(component.exists(".lastPlayed")).toBe(true);
        expect(component.exists(".players")).toBe(true);
        expect(component.exists(".island")).toBe(true);
        expect(component.exists(".autor")).toBe(true);
        expect(component.exists(".rateAvg")).toBe(true);
        expect(component.exists(".probability")).toBe(true);
        
        component.unmount();
    });
})
