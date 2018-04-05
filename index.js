import {Piano} from './Device.js';
import {Board} from './Arduino.js';


let board = new Board();
board.connect({baudrate: 9600});

let piano = new Piano(window);

piano.connect();
piano.detectSpeed();
piano.on('speed', (speed) =>{
    board.write(`s${speed/150}\n`);
});
piano.on('')