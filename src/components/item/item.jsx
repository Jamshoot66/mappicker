import React from "react";
import style from "./item.module.scss";

import * as actionType from "~s/actions.js";
import {connect} from "react-redux";

import RateStars from "~c/rateStars/rateStars.jsx";

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
		this.rate = {
			balance : 3,
			task: 3,
			gameplay: 3
		}

		this.hint = "Относительный рейтинг зависит от оценки миссии и времени последнего отыгрыша. При этом относительный рейтинг миссии с оценкой 1 (плохая), отыгранной год назад, соответсвует рейтингу миссии с оценкой 3 (средней), отыграной 3 месяца назад, и хорошей, отыгранной 2 месяца назад."
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

	onRateBtnClick = (e) => {
		e.stopPropagation();
		let avg = (this.rate.balance + this.rate.task + this.rate.gameplay) / 3;
		avg = Math.round(avg*100)/100;
		this.props.updateRate(this.props.guid, avg);
	}

	onBalanceRateClick = (rate, e) => {
		e.stopPropagation();
		this.rate.balance = rate;
	}

	onTaskRateClick = (rate, e) => {
		e.stopPropagation();
		this.rate.task = rate;
	}

	onGameplayRateClick = (rate, e) => {
		e.stopPropagation();
		this.rate.gameplay = rate;
	}

	render() {
		let evenClass = this.props.even ? style.wrapper_even : "";
		if (this.state.minimal) {
			var itemStr = (
				<section className={`${style.wrapper} ${evenClass} ${style.wrapper_selectable}`} onClick={this.itemSizeToggle} key="key">
					<div className={style.name}> 
						{this.props.name}
					</div>

					<div className={style.mods}> 
						{this.props.mods}
					</div>

					<div className={style.lastPlayed}> 
						{new Date(this.props.lastPlayed).toLocaleDateString()}
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

					<div className={style.probability}
						title={this.hint}> 
						{(this.props.probability*100).toFixed(1)}%
					</div>
					{this.props.user.auth ? 
						this.props.showInMissonPool ? 
							<button className={style.addBtn} onClick={this.addBtnClick}> 
								+
							</button> : 
							<button className={style.addBtn} onClick={this.removeBtnClick}> 
								-
							</button> : 
						false}	
				</section>)
		} else {
			let tmpStyle = `${style.addBtn} ${style.addBtnLine}`;
			let rateStr = false;
			if (this.props.user.auth) {
				rateStr =
					<div>
						<h3 className={style.rateHeader}>Оцените миссию:</h3>
						<ul>
							<li className={style.rateElement} >
								<label htmlFor="">Баланс</label>
								<div className={style.rateStarsWrapper}>
									<RateStars rate={this.rate.balance} callback={this.onBalanceRateClick} />
								</div>

							</li>
							<li className={style.rateElement}>
								<label htmlFor="">Задачи</label>
								<div className={style.rateStarsWrapper}>
									<RateStars rate={this.rate.task} callback={this.onTaskRateClick} />
								</div>

							</li>
							<li className={style.rateElement}>
								<label htmlFor="">Геймплей</label>
								<div className={style.rateStarsWrapper}>
									<RateStars rate={this.rate.gameplay} callback={this.onGameplayRateClick} />
								</div>

							</li>
							<button className={tmpStyle} 
								onClick={this.onRateBtnClick}> 
								Оценить 
							</button>
						</ul> 

					</div>
			};
			itemStr = (
				<section className={`${style.wrapper}  ${evenClass}`} onClick={this.itemSizeToggle} key="key">
					<div className={style.maximazedItemWrapper}>
						<div className={style.column}> 
							<div className={style.maximazedName}>
								{this.props.name}	
							</div>

							<div className={style.line}> 
								Моды <strong>{this.props.mods}</strong>
							</div>

							<div className={style.line}> 
								Последний отыгрыш <strong>{new Date(this.props.lastPlayed).toLocaleDateString()}</strong>
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

							<div className={style.line}
								title={this.hint}> 
								Относительный рейтинг <strong>{(this.props.probability*100).toFixed(1)}%</strong> [ ? ]
							</div>
						</div>

						<div className={style.column}>
							{rateStr}
						</div>
						
					</div>

					{this.props.user.auth ? 
							this.props.showInMissonPool ? 
							<button className={tmpStyle} onClick={this.addBtnClick}> 
								Добавить в расписание
							</button> : 
							<button className={tmpStyle} onClick={this.removeBtnClick}> 
								Убрать из расписания
							</button> : 
						false
					}
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
		},

		updateRate: (guid, rate) => {
			dispatch({
				type: actionType.UPDATE_MISSION_RATE,
				payload: {
					guid, rate
				}
			})
			
		}
	}
}

const mapStateToProps = (store) => {
	return {
		user : store.user
	}
}

export default connect(mapStateToProps ,mapDispatchToProps)(Item);