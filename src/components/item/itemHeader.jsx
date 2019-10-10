import React from "react";
import style from "./item.module.scss";


class ItemHeader extends React.Component {

	render() {
		return (
			<section className={style.wrapper}>
				<div className={style.name}> 
					Название миссии
				</div>

				<div className={style.lastPlayed}> 
					Отыгрыш
				</div>

				<div className={style.players}> 
					Игроков
				</div>

				<div className={style.island}> 
					Карта
				</div>

				<div className={style.autor}> 
					Автор
				</div>

				<div className={style.rateAvg}> 
					Рейтинг
				</div>

				<div className={style.probability}> 
					%
				</div>

				<div className={style.add}> 
					    
				</div>
				
			</section>
		)
	}
}

export default ItemHeader;