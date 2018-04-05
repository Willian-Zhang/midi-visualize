import './libraries/eventemitter2.js';

export class Piano extends EventEmitter2{
    constructor(win){
        super();
        this.window = win ? win : window;
        this.no_device_alert = null;
    }
    connect(){
        let self = this;
        this.window.navigator.requestMIDIAccess()
        .then(function(access) {
            // Get lists of available MIDI controllers
            const inputs = access.inputs.values();
            const outputs = access.outputs.values();
            let device = [...inputs][0];

            access.onstatechange = function(e) {
                // Print information about the (dis)connected MIDI controller
                if(e.port instanceof MIDIInput && e.port.state == 'connected'){
                    self.deviceConnected(e.port)
                }
                if(e.port.state == 'disconnected'){
                    if([...access.inputs.values()].length == 0){
                        self.no_device_alert = swal("No device found", "Waiting for connection...", "info");
                    }
                }
            };
            if(device){
                self.deviceConnected(device);
            }else{
                self.no_device_alert = swal("No device found", "Waiting for connection...", "info");
            }
        });
    }
    deviceConnected(device){
        console.log(`connected`, device);
        if(this.no_device_alert){
            swal.close();
        }
        
        let self = this;
        device.onmidimessage = function(message){
            switch (message.data[0]) {
                case 144:
                    self.emit('press', message.data[1]);
                    break;
                case 128:
                    self.emit('release', message.data[1]);
                    break;
                default:
                    break;
            }
        }
        
    }
}