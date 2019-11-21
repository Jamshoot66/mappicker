import React from "react";
import App from "./app";
import { shallow } from "enzyme";
import {createStore} from "redux";


it("renders without crashing", () => {
	let reducer = () => true;
	let store = createStore(reducer);
	let props = { store };
	let component = shallow( <App {...props}/>); 
	component.unmount();
});

