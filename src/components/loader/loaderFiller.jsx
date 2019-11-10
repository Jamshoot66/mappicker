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
    constructor(props) {
        super(props);
        this.wrapperRef = React.createRef();
        this.state = { size: 300 };
    }

    onResize = () => {
        let size;
        if (document.documentElement.clientWidth < this.wrapperRef.current.clientWidth || 
            document.documentElement.clientHeight < this.wrapperRef.current.clientHeight) {
            size = Math.min( this.wrapperRef.current.clientHeight, this.wrapperRef.current.clientWidth)
        } else {
            size = Math.min( document.documentElement.clientWidth, document.documentElement.clientHeight)
        }

        if (size > 300) { size = 300 };

        this.setState({ size })
    }

    componentDidMount() {
        window.addEventListener("resize", this.onResize)
        this.onResize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

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
                <div className={style.wrapper} ref={this.wrapperRef} style={ {maxWidth: this.state.size, maxHeight: this.state.size}}>
                    <img src={preloadingSpriteList} alt="filler" className={itemStyle} />
                </div>
			</div>
		)
	}
}

export default LoaderFiller;