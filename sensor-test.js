const sensorLib = require('node-dht-sensor');
const http = require('http')
const teo = "prova";

// Setup sensor, exit if failed
var sensorType = 11; // 11 for DHT11, 22 for DHT22 and AM2302
var sensorPin  = 4;  // The GPIO pin number for sensor signal
if (!sensorLib.initialize(sensorType, sensorPin)) {
    console.warn('Failed to initialize sensor');
    process.exit(1);
}

// Automatically update sensor value every 2 seconds
setInterval(function() {
    var readout = sensorLib.read();
    console.log('Temperature:', readout.temperature.toFixed(1) + 'C');
    console.log('Humidity:   ', readout.humidity.toFixed(1)    + '%');

    var temperature = readout.temperature.toFixed(1);
    const data = JSON.stringify({
        "sensor":"ID1",
        "timestamp": 123456789,
        "temperature":20
    })

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/temperature',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', d => {
            process.stdout.write(d)
        });
        req.on('error', error => {
            console.error(error)
        });

    })

    req.write(data)
    req.end()
}, 2000);
