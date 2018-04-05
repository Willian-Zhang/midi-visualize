import './libraries/eventemitter2.js';

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
                    this.deviceConnected(e.port)
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
        
        device.onmidimessage = (message) => {
            let key = message.data[1];
            switch (message.data[0]) {
                case 144:
                    this.emit('press', key);
                    this.pressing.add(key);
                    break;
                case 128:
                    this.emit('release', key);
                    this.pressing.delete(key);
                    break;
                default:
                    break;
            }
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
        this.on('press', increment);
        this.on('release', increment);
    }
}