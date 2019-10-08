import React from "react";
import App from "./app";
import { shallow, mount, render } from "enzyme";


it("renders without crashing", () => {
	let component = shallow( <App />); 
	expect(component.find("Connect(Menu)").length).toEqual(1);
	expect(component.find("Header").length).toEqual(1);
	component.unmount();
});

