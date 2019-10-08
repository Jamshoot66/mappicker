import React from 'react';
import style from './app.module.scss';

import Header from "~c/header/header.jsx";
import Menu from "~c/menu/menu.jsx";

class App extends React.Component {

	render() {
		return (
			<main className={style.wrapper}>
				<header className={style.row}>
					<Header/>
				</header>

				<Menu/>

				<div>qwe</div>
				<div>qwe</div>
				<div>qwe</div>
				<div style={{height:'10000px'}}></div>

				
			</main>
		);
	}
	
}

export default App;
