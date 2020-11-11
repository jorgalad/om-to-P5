// This is the Client, it send messages to the server but also receives shit
var socket = io();

function setup() {
  createCanvas(600, 400);
  background(51);

  socket = io.connect("http://localhost:3000");
  socket.on("receiveOSC", newDrawing);
}

function newDrawing(oscMessage) {
  console.log(`sketch.js:`, oscMessage);
  noStroke();
  fill(255, 0, 100);
  console.log(data);
  ellipse(data.x, data.y, 12, 12);
  console.log(oscMessage);
}

function mouseDragged() {
  console.log(mouseX + "," + mouseY);

  // This is what gets send (JS Object)
  // var data = {
  //   x: mouseX,
  //   y: mouseY,
  // };
  //Now send it
  // socket.emit("mouse", data);

  noStroke();
  fill(255);
  ellipse(mouseX, mouseY, 12, 12);
}

// function draw() {}
