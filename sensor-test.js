const sensorLib = require('node-dht-sensor');
const axios = require('axios');


// Setup sensor, exit if failed
var sensorType = 11; // 11 for DHT11, 22 for DHT22 and AM2302
var sensorPin = 4;  // The GPIO pin number for sensor signal

if (!sensorLib.initialize(sensorType, sensorPin)) {
    console.warn('Failed to initialize sensor');
    process.exit(1);
}
else{
    console.log('sensor ok');
}

// Automatically update sensor value every 2 seconds
setInterval(function () {
    var readout = sensorLib.read();
    console.log('Temperature:', readout.temperature.toFixed(1) + 'C');
    console.log('Humidity:   ', readout.humidity.toFixed(1) + '%');

    const data = JSON.stringify({
        "sensor": "ID1",
        "timestamp": "0",
        "temperature": readout.temperature.toFixed(1),
    });

    axios
        .post('http://192.168.1.100/temperature', data)
        .then(res => {
            console.log(`statusCode: ${res.status}`)
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        });

});
