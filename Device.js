import './libraries/eventemitter2.js';
// import './libraries/heap.js';

export class Piano extends EventEmitter2{
    constructor(win, speed_dectection_duration = 5000){
        super();
        this.window = win ? win : window;
        this.no_device_alert = null;
        this.pressing = new Set();
        // Speed
        this.speed = 0;
        this.speed_dectection_duration = speed_dectection_duration;
    }
    connect(){
        this.window.navigator.requestMIDIAccess()
        .then((access) =>{
            // Get lists of available MIDI controllers
            const inputs = access.inputs.values();
            const outputs = access.outputs.values();
            let device = [...inputs][0];

            access.onstatechange = (e) => {
                // Print information about the (dis)connected MIDI controller
                if(e.port instanceof MIDIInput && e.port.state == 'connected'){
                    this.deviceConnected(e.port);
                }
                if(e.port.state == 'disconnected'){
                    if([...access.inputs.values()].length == 0){
                        this.no_device_alert = swal("No device found", "Waiting for connection...", "info");
                    }
                }
            };
            if(device){
                this.deviceConnected(device);
            }else{
                this.no_device_alert = swal("No device found", "Waiting for connection...", "info");
            }
        });
    }
    deviceConnected(device){
        console.log(`connected`, device);
        if(this.no_device_alert){
            swal.close();
        }
        
        device.onmidimessage = this.onmidimessage.bind(this);
    }
    onmidimessage(message){
        let key = message.data[1];
        switch (message.data[0]) {
            case 144:
                this.pressing.add(key);
                this.emit('key.press', key);
                
                break;
            case 128:
                this.pressing.delete(key);
                this.emit('key.release', key);
                break;
            default:
                break;
        }
    }
    detectSpeed(speed_dectection_duration = null){
        let timeout = speed_dectection_duration ? speed_dectection_duration : this.speed_dectection_duration;

        let increment = ()=>{
            this.speed += 1;
            this.window.setTimeout(() => {
                this.speed -= 1;
                this.emit('speed', this.speed);
            }, timeout);
            this.emit('speed', this.speed);
        }
        this.on('key.press', increment);
        this.on('key.release', increment);
    }
    detectPitch(){
        let calculate_pitch = ()=>{
            if(this.pressing.size >= 5){
                let heap = [];
                let wantSize = this.pressing.size - 3;
                this.pressing.forEach(v => Heap.push(heap, v));

                // console.log("size", this.pressing.size);
                // console.log("nlargest", Heap.nlargest(heap, wantSize));
                this.emit('pitch-right', average(Heap.nlargest(heap, wantSize)));
            }else if(this.pressing.size > 0){
                this.emit('pitch-right', Math.max(...this.pressing));
            }
            // console.log(this.pressing.size);
        };
        this.on('key.press', calculate_pitch);
        this.on('key.release', calculate_pitch);
    }
}

const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
