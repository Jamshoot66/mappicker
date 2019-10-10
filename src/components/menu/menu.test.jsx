import Menu from "./menu.jsx";
import React from "react";
import ReactDOM from "react-dom";
import {createStore} from "redux";
import {Provider} from "react-redux";

let mockProps = {
		user: {
			auth : false,
			name : "some"
		}
	};

let mockStore = createStore( () => {
		return mockProps;
	});

test("renders without crashing", () => {

	let props = {store : mockStore};

	let root = document.createElement("div");
	ReactDOM.render(<Menu {...props}/>, root);
});
