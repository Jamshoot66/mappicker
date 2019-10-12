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
		this.rate = {
			balance : 3,
			task: 3,
			gameplay: 3
		}
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

	onRateInputClick = (e) => {
		e.stopPropagation();
	}

	onBalanceRateInputChange = (e) => {
		this.rate.balance = parseInt(e.target.value);
	}

	onTaskRateInputChange = (e) => {
		this.rate.task = parseInt(e.target.value);
	}

	onGameplayRateInputChange = (e) => {
		this.rate.gameplay = parseInt(e.target.value);
	}

	onRateBtnClick = (e) => {
		e.stopPropagation();
		let avg = (this.rate.balance + this.rate.task + this.rate.gameplay) / 3;
		avg = Math.round(avg*100)/100;
		this.props.updateRate(this.props.guid, avg);
	}

	render() {

		if (this.state.minimal) {
			var itemStr = (
				<section className={`${style.wrapper} ${style.wrapper_selectable}`} onClick={this.itemSizeToggle} key="key">
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

					<div className={style.probability} title="Вероятность пропорциональна рейтингу и расчитывается как %rate * 2 - 1. При этом вероятность миссии с рейтингом 1 (плохая) ниже миссии с рейтингом 3 (средняя) в 5 раз."> 
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
								<input type="number" 
									min="1" max="5" defaultValue="3" 
									onClick={this.onRateInputClick} 
									onChange={this.onBalanceRateInputChange}/>
							</li>
							<li className={style.rateElement}>
								<label htmlFor="">Задачи</label>
								<input type="number" 
									min="1" max="5" defaultValue="3" 
									onClick={this.onRateInputClick}
									onChange={this.onTaskRateInputChange}/>
							</li>
							<li className={style.rateElement}>
								<label htmlFor="">Геймплей</label>
								<input type="number" 
									min="1" max="5" defaultValue="3" 
									onClick={this.onRateInputClick}
									onChange={this.onGameplayRateInputChange}/>
							</li>
							<button className={tmpStyle} 
								onClick={this.onRateBtnClick}> 
								Оценить 
							</button>
						</ul> 

					</div>
			};
			itemStr = (
				<section className={style.wrapper} onClick={this.itemSizeToggle} key="key">
					<div className={style.maximazedItemWrapper}>
						<div className={style.column}> 
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

							<div className={style.line} title="Вероятность пропорциональна рейтингу и расчитывается как %rate * 2 - 1. При этом вероятность миссии с рейтингом 1 (плохая) ниже миссии с рейтингом 3 (средняя) в 5 раз."> 
								Вероятность появления в расписании <strong>{(this.props.probability*100).toFixed(1)}%</strong> [ ? ]
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