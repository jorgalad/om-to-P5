//Import Express and set to variable (which is also a function call)
var express = require("express");
// Create the App
var app = express();
// Listen to port 3000
var server = app.listen(3000);
// Use the public folder

app.use(express.static("public"));
var socket = require("socket.io");
var io = socket(server);
io.sockets.on("connection", sendToSketch);

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

//This is new
udpPort.on("message", function (socket, oscMessage) {
  sendToSketch(socket, oscMessage);
});

udpPort.on("error", function (err) {
  console.log(err);
});

udpPort.open();

function sendToSketch(socket) {
  // console.log(socket);
  // console.log(oscMessage); //undefined
  let bla = "Test String";
  console.log(`This gets triggered`);
  // console.log(socket.emit);
  socket.broadcast.emit("connection", bla);
  // socket.broadcast.emit("fromOM", oscMessage);
  // console.log(data);
}

function sendData() {
  socket.emit("func1", ball.y);
  socket.emit("func2", ball.x);
  //   console.log(ball.x); //Check in browser console
}
// OM Sends to Server
// Server Receives the Message and Launches a function
// Function sends the Message to Sketch (socket.emit)
function newConnection(socket) {
  console.log("new connection ID: " + socket.id);
  //If there's a message called 'mouse', trigger the mouseMsg function
  // socket.on("mouse", mouseMsg);
  socket.on("test", oscMessage);

  function oscMessage(data) {
    //broadcast.emit sends the message back out
    // socket.broadcast.emit("mouse", data);
    // socket.broadcast.emit("test", oscMessage);
    //The io.sockets refers to everything, so it will also send the message back to the sender
    //io.sockets.emit('mouse', data);
    console.log(data);
  }
}
