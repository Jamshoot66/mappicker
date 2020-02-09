import React from "react";
import style from "./item.module.scss";
import {connect} from "react-redux";
import * as actionType from "~s/actions.js";


class ItemHeader extends React.Component {

	sortByName = (first, second) => {
		return (first.name >= second.name) ? 1 : -1;
	}

	sortByMods = (first, second) => {

		if (first.mods > second.mods) {
			return 1;
		} else if (first.mods < second.mods) {
			return -1;
		} else if (first.probability > second.probability) {
			return -1
		} else if (first.probability < second.probability) {
			return 1;
		} else {
			return (first.name >= second.name) ? 1 : -1;;
		}
	}

	sortByLastPlayed = (first, second) => {
		if (first.lastPlayed > second.lastPlayed) {
			return 1;
		} else if (first.lastPlayed < second.lastPlayed) {
			return -1;
		} else if (first.probability > second.probability) {
			return -1
		} else if (first.probability < second.probability) {
			return 1;
		} else {
			return (first.name >= second.name) ? 1 : -1;;
		}
	}

	sortByPlayers = (first, second) => {
		if (first.players > second.players) {
			return -1;
		} else if (first.players < second.players) {
			return 1;
		} else if (first.probability > second.probability) {
			return -1
		} else if (first.probability < second.probability) {
			return 1;
		} else {
			return (first.name >= second.name) ? 1 : -1;;
		}
	}

	sortByIsland = (first, second) => {
		if (first.island > second.island) {
			return 1;
		} else if (first.island < second.island) {
			return -1;
		} else if (first.probability > second.probability) {
			return -1
		} else if (first.probability < second.probability) {
			return 1;
		} else {
			return (first.name >= second.name) ? 1 : -1;
		}
	}

	sortByAuthor = (first, second) => {
		if (first.author > second.author) {
			return 1;
		} else if (first.author < second.author) {
			return -1;
		} else if (first.probability > second.probability) {
			return -1
		} else if (first.probability < second.probability) {
			return 1;
		} else {
			return (first.name >= second.name) ? 1 : -1;;
		}
	}

	sortByRateAvg = (first, second) => {
		if (first.rateAvg > second.rateAvg) {
			return -1;
		} else if (first.rateAvg < second.rateAvg) {
			return 1;
		} else if (first.probability > second.probability) {
			return -1
		} else if (first.probability < second.probability) {
			return 1;
		} else {
			return (first.name >= second.name) ? 1 : -1;;
		}
	}

	sortByProbability = (first, second) => {
		if (first.probability > second.probability) {
			return -1;
		} else if (first.probability < second.probability) {
			return 1;
		} else {
			return (first.name >= second.name) ? 1 : -1; 
		}
	}

	sort = (sortFunc) => {
		let pool = this.props.missionPool.slice(0);
		pool.sort(sortFunc);
		this.props.updateMissionPool(pool);
	}

	render() {
		return (
			<section className={`${style.wrapper} ${style.header}`}>
				<div className={`${style.name}`} onClick={ () => {this.sort(this.sortByName)}}> 
					Название миссии
				</div>

				<div className={`${style.mods}`} onClick={ () => {this.sort(this.sortByMods)}}> 
					Моды
				</div>

				<div className={style.lastPlayed} onClick={ () => {this.sort(this.sortByLastPlayed)}}> 
					Отыгрыш
				</div>

				<div className={style.players} onClick={ () => {this.sort(this.sortByPlayers)}}> 
					Игроков
				</div>

				<div className={style.island} onClick={ () => {this.sort(this.sortByIsland)}}> 
					Карта
				</div>

				<div className={style.author} onClick={ () => {this.sort(this.sortByAuthor)}}> 
					Автор
				</div>

				{this.props.user.rights.canRate ?
					<div className={style.rateAvg} onClick={() => { this.sort(this.sortByRateAvg) }}>
						Рейтинг
					</div>
					: null}

				{this.props.user.rights.canRate ?
					<div className={style.probability} onClick={() => { this.sort(this.sortByProbability) }}>
						%
					</div>
					: null}

				{this.props.user.rights.canAdd ? <div className={style.add}></div> : null}

			</section>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		missionPool : state.missionPool
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateMissionPool: (missionPool) => {
			dispatch({
				type: actionType.UPDATE_MISSIONS_ORDER,
				payload: {missionPool}
			})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemHeader);