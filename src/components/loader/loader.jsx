
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
   
    let singleton = Symbol.for(files.join());
    if (singleton in window) return;

    let promises = [];

    window[singleton] = true;
    files.map(item => {
        console.log("starting fetch item ", item)
        promises.push(new Promise(resolve => {
            let img = new Image();
            img.onload = () => {
                resolve()
            };
            img.src = item;
        }))
        return true;
    })

    if (delay > 0) {
        promises.push(new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, delay);
        }));
    }

    Promise.all(promises).then(() => {
        delete window[singleton];
        onLoadedCallback();
    });     
}