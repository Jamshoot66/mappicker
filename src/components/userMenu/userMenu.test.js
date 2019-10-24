import React from "react";
import {createStore} from "redux";
import UserMenu from "./userMenu";
import { shallow, mount } from "enzyme";

describe("Testing UserMenu component", () => {
    let mockProps = {
		user: {
			auth: false,
			name: "some"
		}
	};

	let mockStore = createStore(() => {
		return mockProps;
	});
    
    it("renders without crashing", () => {
        let component = shallow(<UserMenu store={mockStore}/>);
        component.unmount();
    });
});