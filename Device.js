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
    
        device.onmidimessage = function(message){
            console.log(message.data);
            // 144 128
        }
        
    }
}