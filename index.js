// import 'Device.js';

let no_device_alert = null;
navigator.requestMIDIAccess()
    .then(function(access) {
        // Get lists of available MIDI controllers
        const inputs = access.inputs.values();
        const outputs = access.outputs.values();
        let device = [...inputs][0];

        access.onstatechange = function(e) {
            // Print information about the (dis)connected MIDI controller
            if(e.port instanceof MIDIInput && e.port.state == 'connected'){
                deviceConnected(e.port)
            }
            if(e.port.state == 'disconnected'){
                if([...access.inputs.values()].length == 0){
                    no_device_alert = swal("No device found", "Waiting for connection...", "info");
                }
            }
        };
        if(device){
            deviceConnected(device);
        }else{
            no_device_alert = swal("No device found", "Waiting for connection...", "info");
        }
    });

function deviceConnected(device){
    console.log(`connected`, device);
    swal.close();

    device.onmidimessage = function(message){
        console.log(message);
    }

    
}