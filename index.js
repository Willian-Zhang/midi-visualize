navigator.requestMIDIAccess()
    .then(function(access) {
        // Get lists of available MIDI controllers
        const inputs = access.inputs.values();
        const outputs = access.outputs.values();
        let device = [...inputs][0];
        console.log(device)
        device.onmidimessage = function(message){
            console.log(message.data);
        }

        access.onstatechange = function(e) {

        // Print information about the (dis)connected MIDI controller
        console.log(e.port.name, e.port.manufacturer, e.port.state);
        };
    });