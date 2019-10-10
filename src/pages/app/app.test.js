import React from "react";
import App from "./app";
import { shallow, mount, render } from "enzyme";
import {createStore} from "redux";
import {Provider} from "react-redux";


it("renders without crashing", () => {
	let reducer = () => true;
	let store = createStore(reducer);
	let props = { store };
	let component = shallow( <App {...props}/>); 
	
	// expect(component.find("Connect(Menu)").length).toEqual(1);
	// expect(component.find("Header").length).toEqual(1);
	component.unmount();
});

