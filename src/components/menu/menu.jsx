import React from "react";
import style from "./menu.module.scss";
import {connect} from "react-redux";

class Menu extends React.Component{


	render() {
	
		let greeting = this.props.user.auth ? "Hello" : "Login";

		return (
			<div className={style.wrapper}>
				menu
				<div className={style.placeholder}></div>
				{greeting}, {this.props.user.name}
				<button className={style.userBtn}></button>
			</div>)
	}
}

const mapStateToProps = (state) => {
	return {
		user : state.user
	}
}

export default connect(mapStateToProps)(Menu);