import React from "react";
import style from "./loaderFiller.module.scss";
import preloadingSpriteList from "./preloading-spritelist.png";

/**
 * @description Filler screen for loading/preloading purposes
 * 
 * @property fadein - fadein effect 
 * @property fadeout - fadeout effect
 * 
 * @usage <LoaderFiller fadein />
 */
class LoaderFiller extends React.Component {
    render() {
        let screenStyle = style.screen;
        let itemStyle = `${style.item} ${style.spritelist}`;
        if (this.props.fadein) {
            screenStyle +=` ${style.fadein}`;
        }
        
        if (this.props.fadeout) {
            screenStyle += ` ${style.fadeout}`;
            itemStyle = style.item;
        } 

		return (			
			<div className={screenStyle}>
				<div className={style.wrapper} >
					<img src={preloadingSpriteList} alt="filler" className={itemStyle} />
				</div>
			</div>
		)
	}
}

export default LoaderFiller;