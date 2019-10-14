import React from "react";
import style from "./rateStars.module.scss";

class RateStars extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			rate: props.rate
		};
	}

	onClick = (e) => {
		let rate = +e.target.getAttribute("data-id");
		if (!isNaN(rate)) {
			this.setState( {
				rate: rate
			});
			this.props.callback(rate, e);
		}
	}

	render() {
		return (
			<div className={`${style.wrapper} ${this.props.wrapperStyle}`} onClick={this.onClick}>
				{this.state.rate >= 1 ? <div className={`${style.item} ${style.item_selected} ${this.props.itemStyle}`} data-id="1"></div> : <div className={`${style.item} ${this.props.itemStyle}`} data-id="1"></div>}
				
				{this.state.rate >= 2 ? <div className={`${style.item} ${style.item_selected} ${this.props.itemStyle}`} data-id="2"></div> : <div className={`${style.item} ${this.props.itemStyle}`} data-id="2"></div>}
				
				{this.state.rate >= 3 ? <div className={`${style.item} ${style.item_selected} ${this.props.itemStyle}`} data-id="3"></div> : <div className={`${style.item} ${this.props.itemStyle}`} data-id="3"></div>}
				
				{this.state.rate >= 4 ? <div className={`${style.item} ${style.item_selected} ${this.props.itemStyle}`} data-id="4"></div> : <div className={`${style.item} ${this.props.itemStyle}`} data-id="4"></div>}
				
				{this.state.rate >= 5 ? <div className={`${style.item} ${style.item_selected} ${this.props.itemStyle}`} data-id="5"></div> : <div className={`${style.item} ${this.props.itemStyle}`} data-id="5"></div>}
			</div>)
	}
}

RateStars.defaultProps = {
	rate : 3,
	callback : () => {},
	itemStyle: "",
	wrapperStyle: ""
}

export default RateStars;