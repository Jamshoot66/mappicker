import React from "react";
import PropTypes from 'prop-types';
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
 *          - maxWidth     - css style max-width 
 *          - maxHeight    - css style max-height
 * 
 * 
 * @usage
 *      <Spinner spinnerState="ERROR" maxWidth="30px" maxHeight="30px"/>
 * 
 */
class Spinner extends React.Component {
    
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
            "max-width": this.props.maxWidth,
            "max-height": this.props.maxHeight,
        }}>{spinnerStr}</div>
    }
};

Spinner.propTypes = {
    spinnerState: PropTypes.string.isRequired,
    maxWidth: PropTypes.string.isRequired,
    maxHeight: PropTypes.string.isRequired,
}

export default Spinner;
