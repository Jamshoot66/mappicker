import React from "react";
import style from "./userMenu.module.scss";
import { connect } from "react-redux";
import * as actionType from "~s/actions.js";


class UserMenu extends React.Component {

    overlayClick = (e) => {
        e.stopPropagation();
        this.props.showUserMenuToggle();
    }

    promoClick = (e) => {
        e.stopPropagation();
    }

    render() {

        let wrapperClass = this.props.visible ? `${style.wrapper} ${this.props.customWrapperStyle}` : `${style.hide}`
    
        let menuItemsStr = null;

        let unitStr = null;
        if (this.props.user.authedUnit) {
            unitStr = <div key="userMenu2-1">Представитель {this.props.user.unit}</div>
        } else {
            // unitStr = <div key="userMenu2">{this.props.user.unit}</div>
            unitStr = null;
        }
        
        if (!this.props.user.auth) {
            menuItemsStr = <div onClick={this.props.login}>Логин через GooglePlus</div>
        } else {
            menuItemsStr = [
                <div key="userMenu1">{this.props.user.name}</div>,
                <hr/>,
                unitStr,
                <div>
                    <label>Промо</label>
                    <input type="text" className={style.promoInput} onClick={this.promoClick}/>
                    <button className={style.promoBtn}>Ок</button>
                </div>,
                <hr />,
                <div onClick={this.props.logout} key="userMenu2">Выйти</div>
            ];
            
        }

        return (<section className={wrapperClass} onClick={this.overlayClick}>
           {menuItemsStr}
        </section>)
    }
};

const mapStateToProps = (state) => {
    return {
        visible: state.showUserMenu,
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showUserMenuToggle: () => {
            dispatch({
                type: actionType.SHOW_USER_MENU_TOGGLE
            });
        },

        login: () => {
			actionType.loginViaGmail(dispatch)
        },
        
        logout: () => {
			actionType.logoutFromServer(dispatch)
		}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);


