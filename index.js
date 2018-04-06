import {Piano} from './Device.js';
import {Board} from './Arduino.js';


let board = new Board();
board.connect({baudrate: 9600});

let piano = new Piano(window);

piano.connect();
piano.detectSpeed();
piano.detectPitch();
piano.on('speed', (speed) =>{
    // console.log(`speed`, speed);
    board.write(`s${speed/150}\n`);
});
piano.on('pitch-right', pitch => {
    let angle = 180-(pitch-36)*180/(96-36);
    // console.log(`pitch`, pitch);
    console.log(`angle`, angle);
    board.write(`a${angle}\n`);
})

