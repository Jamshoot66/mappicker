import React from "react";
import style from "./loaderFiller.module.scss";
import preloadingSpriteList from "./preloading-spritelist.png";

class LoaderFiller extends React.Component {
	render() {
		return (
			<div className={`${style.screen} ${this.props.customClass}`}>
				<div className={style.wrapper} >
					<img src={preloadingSpriteList} alt="filler" className={style.spritelist} />
				</div>
			</div>
		)
	}
}

export default LoaderFiller;