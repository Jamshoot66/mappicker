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
	component.unmount();
});

