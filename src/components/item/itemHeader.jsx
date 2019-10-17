import React from "react";
import style from "./item.module.scss";
import {connect} from "react-redux";
import * as actionType from "~s/actions.js";


class ItemHeader extends React.Component {

	/* mission item template 
let missionItem = {
			guid: 1,
			name:"Операция «Магистраль»",
			island: "Altis",
			players: 200,
			autor: "Aventador",
			rateAvg: 3,
			rates:[1,2,3,4],
			lastPlayed: 01.02.2019,
			probability: 0.25,
			minimal: true
		}
*/

	//TODO: check test func duble click
	sortByName = (first, second) => {
		return (first.name >= second.name) ? 1 : -1;
	}

	sortByMods = (first, second) => {
		return (first.mods >= second.mods) ? 1 : -1;
	}

	sortByLastPlayed = (first, second) => {
		return (first.lastPlayed >= second.lastPlayed) ? 1 : -1;
	}

	sortByPlayers = (first, second) => {
		return (first.players >= second.players) ? 1 : -1;
	}

	sortByIsland = (first, second) => {
		return (first.island >= second.island) ? 1 : -1;
	}

	sortByAutor = (first, second) => {
		return (first.autor >= second.autor) ? 1 : -1;
	}

	sortByRateAvg = (first, second) => {
		return (first.rateAvg <= second.rateAvg) ? 1 : -1;
	}

	sortByProbability = (first, second) => {
		return (first.probability <= second.probability) ? 1 : -1;
	}

	sort = (sortFunc) => {
		let pool = this.props.missionPool.slice(0);
		pool.sort(sortFunc);
		this.props.updateMissionPool(pool);
	}

	render() {
		return (
			<section className={style.wrapper}>
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

				<div className={style.autor} onClick={ () => {this.sort(this.sortByAutor)}}> 
					Автор
				</div>

				<div className={style.rateAvg} onClick={ () => {this.sort(this.sortByRateAvg)}}>  
					Рейтинг
				</div>

				<div className={style.probability} onClick={ () => {this.sort(this.sortByProbability)}}>   
					%
				</div>

				{this.props.user.auth ? <div className={style.add}></div> : false}
				
				
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
				type: actionType.UPATE_MISSIONS_ORDER,
				payload: {missionPool}
			})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemHeader);