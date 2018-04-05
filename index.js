import {Piano} from './Device.js';


let piano = new Piano(window);

piano.connect();

piano.on('press', console.log)
