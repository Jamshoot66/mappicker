import React from "react";
import style from "./item.module.scss";

import * as actionType from "~s/actions.js";
import {connect} from "react-redux";

/*
let testProps = {
			guid: 1,
			name:"Операция «Магистраль»",
			island: "Altis",
			players: 200,
			autor: "Aventador",
			rateAvg: 3,
			rates:[1,2,3,4],
			lastPlayed: 01.02.2019,
			probability: 0.25,
			minimal: true,
			showInMissonPool: true (optional prop)
		}
*/

class Item extends React.Component {

	constructor(props) {
		super(props);
		this.state = {minimal: true};
	}

	itemSizeToggle = (e) =>{
		let newState = Object.assign({}, this.state);
		newState.minimal = !this.state.minimal;
		this.setState(newState);
	}

	addBtnClick = (e) => {
		e.stopPropagation();
		this.props.addToSchedule(this.props.guid);
	}

	removeBtnClick = (e) => {
		e.stopPropagation();
		this.props.removeFromSchedule( this.props.guid );
	}

	render() {

		if (this.state.minimal) {
			var itemStr = (
				<section className={style.wrapper} onClick={this.itemSizeToggle} key="key">
					<div className={style.name}> 
						{this.props.name}
					</div>

					<div className={style.lastPlayed}> 
						{this.props.lastPlayed}
					</div>

					<div className={style.players}> 
						{this.props.players}
					</div>

					<div className={style.island}> 
						{this.props.island}
					</div>

					<div className={style.autor}> 
						{this.props.autor}
					</div>

					<div className={style.rateAvg}> 
						{this.props.rateAvg}
					</div>	

					<div className={style.probability}> 
						{(this.props.probability*100).toFixed(1)}%
					</div>
					{ this.props.showInMissonPool ? 
					<button className={style.addBtn} onClick={this.addBtnClick}> 
						+
					</button> : 
					<button className={style.addBtn} onClick={this.removeBtnClick}> 
						-
					</button>}	
				</section>)
		} else {
			let tmpStyle = `${style.addBtn} ${style.addBtnLine}`;
			itemStr = (
				<section className={style.wrapper} onClick={this.itemSizeToggle} key="key">
					<div className={style.maximazedItemWrapper}>
						<div>
							{this.props.name}	
						</div>

						<div className={style.line}> 
							Последний отыгрыш <strong>{this.props.lastPlayed}</strong>
						</div>
						
						<div className={style.line}> 
							Остров <strong>{this.props.island}</strong>
						</div>

						<div className={style.line}> 
							Количестов игроков <strong>{this.props.players}</strong>
						</div>

						<div className={style.line}> 
							Автор <strong>{this.props.autor}</strong>
						</div>

						<div className={style.line}> 
							Рейтинг <strong>{this.props.rateAvg}</strong>
						</div>

						<div className={style.line}> 
							Вероятность появления в расписании <strong>{(this.props.probability*100).toFixed(1)}%</strong>
						</div>

						{ this.props.showInMissonPool ? 
						<button className={tmpStyle} onClick={this.addBtnClick}> 
							Добавить в расписание
						</button> : 
						<button className={tmpStyle} onClick={this.removeBtnClick}> 
							Убрать из расписания
						</button> }
					</div>
				</section>)
		}

		return [itemStr]
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		addToSchedule: (guid) => {

			dispatch( {
				type: actionType.ADD_MISSION_TO_SCHEDULE,
				payload: {
					date: "01.02.2019",
					guid
				}
			})
		},
		removeFromSchedule: (guid) => {
			dispatch( {
				type: actionType.REMOVE_MISSION_FROM_SCHEDULE,
				payload: {
					date: "01.02.2019",
					guid
				}
			})
		}
	}
}

export default connect(null,mapDispatchToProps)(Item);