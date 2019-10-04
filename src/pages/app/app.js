import React from 'react';
import style from './app.module.scss';

import Header from "~c/header/header";
import Menu from "~c/menu/menu";

function App() {
	return (
		<main className={style.wrapper}>
			<header className={style.row}>
				<Header/>
			</header>
			<nav className={style.row}>
				<Menu/>
			</nav>
			
		</main>
	);
}

export default App;
