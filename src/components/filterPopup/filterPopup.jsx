import React from "react";
import { connect } from "react-redux";
import style from "./filterPopup.module.scss";
import * as actionType from "~s/actions.js";

class FilterPopup extends React.Component {

	constructor(props) {
		super(props);
		
		this.defState = {
         filterString: ''
		}

		this.state = Object.assign({}, this.defState);	
	}

	onBackgroundClick = (e) => {
		e.stopPropagation();
	}

	applyFilter = () => {
      this.props.filterMissions({ filterString: this.state.filterString });
      this.props.hide();
   }
   
	defaultFilter = () => {
      this.props.filterMissions({ filterString: '' });
      this.props.hide();
	}
	
   render() { 
      const { filterString } = this.state;

		return (
			<div className={style.screen} onClick={this.onBackgroundClick}>
				<div className={style.wrapper}>
					<header className={style.itemHeader}>Применить фильтр</header>
					
					<hr className={style.horisontalLine} />

					<section className={style.itemWrapper}>
						<input id="filter" size="10" className={style.itemInput} value={filterString}
                     onChange={(e) => {
                     this.setState({filterString: e.target.value})
                     }}
                     onBlur={(e) => {
                        this.setState({filterString: e.target.value.trim()})
                     }}
                     type="text"
                     placeholder="Фильтр"
                     style={ {borderRadius: '3px'}}   
                  />
               </section>
               
               <section className={style.checkBoxGroupWrapper}>
                  <div className={style.checkBoxWrapper}>
                     <input id="archiveCheckbox" size="10" className={style.itemInput} value={filterString}
                        type="checkbox"
                        placeholder="Фильтр"
                        style={ {borderRadius: '3px'}}   
                     />
                     <label htmlFor="archiveCheckbox">Актуальная</label>
                  </div>
               </section>

               <section className={style.checkBoxGroupWrapper}>
                  <div className={style.checkBoxWrapper}>
                     <input id="archiveCheckbox" size="10" className={style.itemInput} value={filterString}
                     type="checkbox"
                     placeholder="Фильтр"
                     style={ {borderRadius: '3px'}}   
                     />
                     <label htmlFor="archiveCheckbox">Пехотная</label>
                  </div>

                  <div className={style.checkBoxWrapper}>
                     <input id="archiveCheckbox" size="10" className={style.itemInput} value={filterString}
                     type="checkbox"
                     placeholder="Фильтр"
                     style={ {borderRadius: '3px'}}   
                     />
                     <label htmlFor="archiveCheckbox">Легкая техника</label>
                  </div>

                  <div className={style.checkBoxWrapper}>
                     <input id="archiveCheckbox" size="10" className={style.itemInput} value={filterString}
                     type="checkbox"
                     placeholder="Фильтр"
                     style={ {borderRadius: '3px'}}   
                     />
                     <label htmlFor="archiveCheckbox">Тяжелая техника</label>
                  </div>

                  <div className={style.checkBoxWrapper}>
                     <input id="archiveCheckbox" size="10" className={style.itemInput} value={filterString}
                     type="checkbox"
                     placeholder="Фильтр"
                     style={ {borderRadius: '3px'}}   
                     />
                     <label htmlFor="archiveCheckbox">Вертолеты</label>
                  </div>

                  <div className={style.checkBoxWrapper}>
                     <input id="archiveCheckbox" size="10" className={style.itemInput} value={filterString}
                     type="checkbox"
                     placeholder="Фильтр"
                     style={ {borderRadius: '3px'}}   
                     />
                     <label htmlFor="archiveCheckbox">Самолеты</label>
                  </div>
               </section>

					<hr className={style.horisontalLine} />	
					<section className={style.itemWrapper}>
						<div className={style.buttonBlock}>
							<button className={style.itemButton} onClick={this.applyFilter}>Применить</button>
						</div>
						<button className={style.itemButton} onClick={this.defaultFilter}>Сбросить</button>
					</section>
				</div>
			</div>
		)    
	}
};

FilterPopup.defaultProps = {
	closeCallBack: () => { }
}


const mapStateToProps = (state) => {
	return {

	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		filterMissions: (filter) => {
			dispatch({
				type: actionType.FILTER_MISSIONS,
				payload: {filterString: filter.filterString}
			})
		},

		hide: () => {
			dispatch({
				type: actionType.SHOW_FILTER_MISSION_POPUP_TOGGLE
			})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPopup);
