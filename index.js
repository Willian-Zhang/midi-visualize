import {Piano} from './Device.js';
import {Board} from './Arduino.js';
import {Keybaord} from './Keyboard.js';


let board = new Board();
board.connect({baudrate: 9600});

let piano = new Piano(window);
let keyboard = new Keybaord();

piano.connect();
piano.detectSpeed();
piano.detectPitch();
piano.on('speed', (speed) =>{
    let s = speed/1.5+1;
    console.log(`speed`, s);
    board.write(`s${s}\n`);
});
piano.on('pitch-right', pitch => {
    let angle = 180-(pitch-36)*180/(96-36);
    // console.log(`pitch`, pitch);
    console.log(`angle`, angle);
    board.write(`a${angle}\n`);
})

// board.on('line', line => {
//     console.log(`line`, String.fromCharCode(...line))
// })
var enum_i=36;
const keyboardToPiano = {
    // left
    16: enum_i++,
    90: enum_i++,
    88: enum_i++,
    67: enum_i++,
    86: enum_i++,
    66: enum_i++,
    78: enum_i++,
    77: enum_i++,
    188: enum_i++,
    190: enum_i++,
    191: enum_i++,
    // right
    9: enum_i+=30,
    81: enum_i++,
    87: enum_i++,
    69: enum_i++,
    82: enum_i++,
    84: enum_i++,
    89: enum_i++,
    85: enum_i++,
    73: enum_i++,
    79: enum_i++,
    80: enum_i++,
    219: enum_i++,
    221: enum_i++,
    220: enum_i++,
}
keyboard.on('press', (e) =>{
    let key = keyboardToPiano[e.which];
    piano.onmidimessage({data: [144, key]})
});
keyboard.on('release', (e) =>{
    let key = keyboardToPiano[e.which];
    piano.onmidimessage({data: [128, key]})
});