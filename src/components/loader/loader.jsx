import React from "react";

/** 
 * @description content loader. Only files used for <img .../> tag source can be loaded
 * 
 * @returns react element
 * 
 * @property files - array of file names. 
 * @property onLoadedCallback - callback, what will be called, thed done 
 * @property delay - minimal delay in ms, untill onLoadedCallback invoked
 * 
 * 
 *  
 * @usage 
 *  // inside component
 *  render() { 
 *      return (
 *          ...
 *          { isNeedToLoadSomething ? loader( [ "./file1.jpg", ...], myCallBack, 1000) : null }
 *          ...
 *      );
 *  }
 */

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
		onLoadedCallback();
	})

    if (files != null) {
        return files.map((item, index) => {
            return <img style={{position:"absolute", display:"none"}} src={item} key={index} alt="" onLoad={onLoaded.bind(this, item)} />
        });
    }
}