import React from "react";
import style from "./loader.module.scss";

export default function loader(files, onLoadedCallback = () => { }, delay = 0) {
	let onLoaded = (files) => {
		resolves.get(files)();
	}

	let promises = [];
    let resolves = new Map();
    if (files != null) {
       files.forEach(item => {
		if (resolves.get(item) === undefined) {
                promises.push(new Promise((resolve) => {
                    resolves.set(item, resolve)
                }));
            };
        }); 
    }
	
	if (delay > 0) {
		promises.push(new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, delay);
		}));
	}

    Promise.all(promises).then(() => {
        console.log("all done");
		onLoadedCallback();
	})

    if (files != null) {
        return files.map((item, index) => {
            return <img className={style.wrapper} src={item} key={index} alt="" onLoad={onLoaded.bind(this, item)} />
        });
    }
}