import React from "react";
import style from "./item.module.scss";

import * as actionType from "~s/actions.js";
import {connect} from "react-redux";

import RateStars from "~c/rateStars/rateStars.jsx";
import Spinner from "~c/spinner/spinner.jsx";


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

		// this.inShedule = false;

		this.hint = "Относительный рейтинг зависит от оценки миссии и времени последнего отыгрыша. При этом относительный рейтинг миссии с оценкой 1 (плохая), отыгранной год назад, соответсвует рейтингу миссии с оценкой 3 (средней), отыграной 3 месяца назад, и хорошей, отыгранной 2 месяца назад."
	}

	itemSizeToggle = (e) =>{
		let newState = Object.assign({}, this.state);
		newState.minimal = !this.state.minimal;
		this.setState(newState);
	}

	addBtnClick = (e) => {
		e.stopPropagation();
		this.props.addToSchedule(this.props.guid, this.props.currentScheduleDate);
	}

	removeBtnClick = (e) => {
		e.stopPropagation();
		this.props.removeFromSchedule( this.props.guid, this.props.currentScheduleDate);
	}

	onRateBtnClick = (e) => {
		e.stopPropagation();
		let avg = (this.rate.balance + this.rate.task + this.rate.gameplay) / 3;
		avg = Math.round(avg*100)/100;
		this.props.syncMissionRate(this.props.guid, avg);
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

	onEmptyClick = (e) => {
		// e.stopPropagation();
	}

	isInSchedule = () => {
		//find shedule with currentScheduleDate
		//search in missions
		// let result = false;
		for (let i in this.props.schedule) {
			if (this.props.schedule[i].date === this.props.currentScheduleDate) {
				return this.props.schedule[i].missions.has(this.props.guid);
			}
		}
		// this.props.schedule.filter( item => {})
		return false;
	}

	render() {
		let evenClass = this.props.even ? style.wrapper_even : "";
		let addButtonClass = this.isInSchedule() ? `${style.addBtn} ${style.addBtn_inSchedule}` : `${style.addBtn}`;
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
						{(+this.props.lastPlayed === 0)? "новая" : 
							new Date(+this.props.lastPlayed).toLocaleDateString()}
					</div>

					<div className={style.players}> 
						{this.props.players}
					</div>

					<div className={style.island}> 
						{this.props.island}
					</div>

					<div className={style.author}> 
						{this.props.author}
					</div>

					{this.props.user.rights.canRate ?
						<div className={style.rateAvg}>
							{this.props.rateAvg}
						</div> : null}	

					{this.props.user.rights.canRate ?
						<div className={style.probability}
							title={this.hint}>
							{(this.props.probability * 100).toFixed(1)}%
						</div>
						: null}
					{this.props.user.rights.canAdd ? 
						this.props.showInMissonPool ? 
							<button className={addButtonClass} onClick={this.addBtnClick}> 
								+
							</button> : 
							<button className={style.addBtn} onClick={this.removeBtnClick}> 
								-
							</button> : 
						null }	
				</section>)
		} else {
			let rateStyle = `${style.addBtn} ${style.addBtnLine}`;
			let addButtonLineStyle = `${addButtonClass} ${style.addBtnLine}`;
			let rateStr = false;
			if (this.props.user.rights.canRate) {
				rateStr =
					<div>
						<h3 className={style.rateHeader}>Оцените миссию:</h3>
						<ul className={style.reteList}>
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
							<div className={style.buttonWrapper}>
								<button className={rateStyle} 
										onClick={this.onRateBtnClick}> 
										Оценить 
								</button>
								<Spinner spinnerState={this.props.syncRateState} width="25px" height="25px"/>
							</div>
							
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
							
							<div className={style.line} onClick={this.onEmptyClick}> 
								Имя файла <strong>{this.props.fileName}</strong>
							</div>

							<div className={style.line} onClick={this.onEmptyClick}> 
								<strong><a target="_blank" rel="noopener noreferrer" href={this.props.link} className={style.link}>Ссылка</a></strong>
							</div>

							<div className={style.line} onClick={this.onEmptyClick}> 
								Моды <strong>{this.props.mods}</strong>
							</div>

							<div className={style.line} onClick={this.onEmptyClick}> 
								Последний отыгрыш <strong>{
									(+this.props.lastPlayed === 0) ? "новая" : 
									new Date(+this.props.lastPlayed).toLocaleDateString()
								}</strong>
							</div>
							
							<div className={style.line} onClick={this.onEmptyClick}> 
								Остров <strong>{this.props.island}</strong>
							</div>

							<div className={style.line} onClick={this.onEmptyClick}> 
								Количестов игроков <strong>{this.props.players}</strong>
							</div>

							<div className={style.line} onClick={this.onEmptyClick}> 
								Автор <strong>{this.props.author}</strong>
							</div>

							{ this.props.user.rights.canRate ?
							<div className={style.line} onClick={this.onEmptyClick}> 
								Рейтинг <strong>{this.props.rateAvg}</strong>
							</div> : null }

							{ this.props.user.rights.canRate ?
							<div className={style.line} onClick={this.onEmptyClick}
								title={this.hint}> 
								Относительный рейтинг <strong>{(this.props.probability*100).toFixed(1)}%</strong> [ ? ]
							</div> : null }
							
							{ this.props.user.rights.canSuperuser ?
								<div className={style.line} onClick={this.onEmptyClick}> 
								guid <strong>{this.props.guid}</strong>
							</div> : null }
						</div>

						<div className={style.columnRate}>
							{rateStr}
						</div>
						
					</div>

					{this.props.user.rights.canAdd ?
						<div className={style.buttonWrapper}>
							{this.props.user.auth ?
								this.props.showInMissonPool ?
									<button className={addButtonLineStyle} onClick={this.addBtnClick}>
										Добавить в расписание
								</button> :
									<button className={addButtonLineStyle} onClick={this.removeBtnClick}>
										Убрать из расписания
								</button> 
								: null }
						</div>
					: null}
				</section>)
		}

		return [itemStr]
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		addToSchedule: (guid, date) => {
			dispatch( {
				type: actionType.ADD_MISSION_TO_SCHEDULE,
				payload: {
					date,
					guid
				}
			})
		},

		removeFromSchedule: (guid, date) => {
			dispatch( {
				type: actionType.REMOVE_MISSION_FROM_SCHEDULE,
				payload: {
					date,
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
			
		},
		// syncMissionRate: actionType.syncMissionRate
		syncMissionRate: (guid, rate) => {
			actionType.syncMissionRate(dispatch, {guid, rate})
		},

		setCurrentSchedureDate: (date) => {
			dispatch({
				type: actionType.SET_CURRENT_SCHEDULE_DATE,
				payload: {
					date
				}
			})
		}
	}
}

const mapStateToProps = (store) => {
	return {
		user: store.user,
		currentScheduleDate: store.currentScheduleDate,
		schedule: store.schedule
	}
}

export default connect(mapStateToProps ,mapDispatchToProps)(Item);