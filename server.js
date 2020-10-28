
//Import Express and set to variable (which is also a function call)
var express = require('express');
// Create the App
var app = express();
var osc = require("osc");

// Listen to port 3000
var server = app.listen(3000);

// Use the public folder 
app.use(express.static('public'));

console.log('============ Server Running ============');

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);

//This function gets triggered when there's a new socket connection from the client
function newConnection(socket) {
    console.log('new connection' + socket.id);

}

/// NOW RECEIVE FROM OM
var osc = require("osc");
// Instantiate a new OSC Serial Port.
var serialPort = new osc.SerialPort({
    devicePath: process.argv[2] || "/dev/tty.usbmodem221361"
});

serialPort.on("message", function (oscMessage) {
    console.log(oscMessage);
});

// Open the port.
serialPort.open();


/****************
 * OSC Over UDP *
 ****************/

var getIPAddresses = function () {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121
});

udpPort.on("ready", function () {
    var ipAddresses = getIPAddresses();

    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udpPort.options.localPort);
    });
});

udpPort.on("message", function (oscMessage) {
    var globalVar = { oscMessage };
    console.log(oscMessage);
});

udpPort.on("error", function (err) {
    console.log(err);
});

udpPort.open();

