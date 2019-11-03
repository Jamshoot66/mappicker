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

        if (!this.props.user.auth) {
            menuItemsStr = <div onClick={this.props.login} key="userMenu3">Логин через GooglePlus</div>
        } else {
            menuItemsStr = [
                <div key="userMenu1">{this.props.user.name}</div>,
                <hr key="userMenu2"/>,
                <div key="userMenu4">
                    {this.props.user.unit !== "[NULL]" ? `Представитель отряда ${this.props.user.unit}` : `Без отряда`}
                    
                </div>,
                <hr key="userMenu5"/>,
                <button onClick={this.props.logout}
                    className={style.logoutBtn}
                    key="userMenu6">
                    Выйти
                </button>
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



