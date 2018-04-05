import {Piano} from './Device.js';


let piano = new Piano(window);

piano.connect();
piano.detectSpeed();
piano.on('speed', console.log)
