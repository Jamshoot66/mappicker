import Menu from "./menu.jsx";
import React from "react";
import ReactDOM from "react-dom";
import {createStore} from "redux";
import { Provider } from "react-redux";
import { mount } from "enzyme";

describe("Testing Menu component", () => {
	let mockProps = {
		user: {
			auth: false,
			name: "some"
		}
	};

	let mockStore = createStore(() => {
		return mockProps;
	});

	test("renders without crashing", () => {

		let props = { store: mockStore };
		let component = mount(<Menu store={mockStore} />);
		expect(component.exists(".wrapper")).toBe(true);
		expect(component.exists(".userBtn")).toBe(true);
		component.unmount();
	});
});