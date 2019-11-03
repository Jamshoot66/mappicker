import React from "react";
import style from "./spinner.module.scss";
import pending from "./pending.gif";
import error from "./error.svg";

const PENDING = "PENDING";
const DONE = "DONE";
const ERROR = "ERROR";

/** spinner component
 *  - props
 *      required
 *          - spinnerState - string PENDING / DONE / ERROR
 *          - width     - css style max-width 
 *          - height    - css style max-height
 * 
 * 
 * @usage
 *      <Spinner spinnerState="ERROR" width="30px" height="30px"/>
 * 
 */
class Spinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = { preloadContent: true };
    }

    componentDidMount() {
        this.setState({ preloadContent: false });
    }

    render() { 
        let spinnerStr;
        switch (this.props.spinnerState) {
            case PENDING:
                spinnerStr = <img className={style.wrapper} src={pending} alt=""/>
                break;
            case DONE:
                spinnerStr = <div className={style.wrapper}></div>
                break;
            case ERROR:
                spinnerStr = <img className={style.wrapper} src={error} alt="" />
                break;
            default:
                spinnerStr = <div className={style.wrapper}></div>
                break;
        }

        return <div style={{
            "width": this.props.width,
            "height": this.props.height
        }}>{spinnerStr}
            {this.state.preloadContent ? <div className={style.preload}>
                <img src={pending} alt="" />
                <img src={error} alt="" />
            </div> : false}
            
        </div>
    }
};

export default Spinner;
