var express = require("express");
var app = express();
var server = app.listen(3000);
app.use(express.static("public"));
var socket = require("socket.io");
var io = socket(server);

console.log("============ Server Running ============");

var osc = require("osc");
// Instantiate a new OSC Serial Port.
var serialPort = new osc.SerialPort({
  devicePath: process.argv[2] || "/dev/tty.usbmodem221361",
});

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
  localPort: 57121,
});

udpPort.on("ready", function () {
  var ipAddresses = getIPAddresses();

  console.log("Listening for OSC over UDP.");
  ipAddresses.forEach(function (address) {
    //Here we see the address from Opusmodus
    console.log(" Host:", address + ", Port:", udpPort.options.localPort);
  });
});

udpPort.on("message", function (oscMessage) {
  console.log(`server.js: `, oscMessage);
  io.sockets.emit("receiveOSC", oscMessage);
});

udpPort.on("error", function (err) {
  console.log(err);
});

udpPort.open();
