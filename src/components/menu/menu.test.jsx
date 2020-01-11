import Menu from "./menu.jsx";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { mount } from "enzyme";

describe("Testing Menu component", () => {
	let mockProps = {
		user: {
			auth: true,
			authedUnit: true,
			name: "MockName",
			shortName: "ShortMockName",
			unit: "MockUnit",
			rights: {
				canAdd: true,
				canRead: true,
				canRate: true,
				canAdmin: true,
				canSuperuser: true
			}
		}
	};

	let mockStore = createStore(() => {
		return mockProps;
	});

	it("renders without crashing", () => {
		let component = mount(<Provider store={mockStore}><Menu /></Provider>);
		expect(component.find("label.label").text().includes(mockProps.user.shortName)).toBe(true);
		component.unmount();
	});
});