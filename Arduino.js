import './libraries/p5.js';
import './libraries/p5.serialport.js';
import './libraries/eventemitter2.js';

export class Board extends EventEmitter2{

    constructor(){
        super();
        this.serial = new p5.SerialPort();
        this.buffer = [];
    }
    connect(options){
        // serial.on('data', serialEvent);  // callback for when new data arrives
        // serial.on('error', serialError); // callback for errors
        this.serial.on('connected', event=>this.emit('connected', event));
        this.serial.on('list', (portList)=>{
            let filtered = portList.filter(name=>name.startsWith('/dev/cu.usbmodem'));
            if(filtered.length == 0){
                throw new Error('No port found!');
            }else if(filtered.length == 1){
                this.serial.open(filtered[0], options);
                return filtered[0];
            }else{
                throw new Error('Mutiple ports found:'+string(filtered));
            }
        }); 
        // this.serial.on('data', this.processData.bind(this));
        
        // I don't know why but this runs for deault 
        // this.list(); 
    }
    write(any){
        this.serial.write(any);
    }
}