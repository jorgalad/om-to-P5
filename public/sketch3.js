// This is the Client, it send messages to the server but also receives shit
// let socket = io();

let width = 720;
let height = 400;
let x = 0;
let color = 0;
let ball;
let y;

function setup() {
  createCanvas(720, 400);
  stroke(255);
  noLoop();
  y = height; // * 0.5;
  socket = io.connect("http://localhost:3000");
  socket.on("receiveOSC", inMessage);
  // ball = new Ball();
}

function draw() {
  background(0);
  // y = y - 4;
  // if (y < 0) {
  //   y = height;
  // }
  // line(0, y, width, y);
}



function inMessage(oscMessage) {
  // console.log(`sketch.js:`, oscMessage);
  //Now Extract Data from OSC message
  // console.log(typeof oscMessage);
  // const {args}
  for (let data1 of Object.keys(oscMessage)) {
    var data2 = oscMessage[data1];
    // console.log(data2);
  }
  const oscValues = data2;
  oscToBall(oscValues);
  // console.log(oscValues);
  // return oscValues;
}

function oscToBall(oscValues) {
  // console.log(oscValues);
  // console.log(oscValues[0]);
  //Everytime a message is being received, redraw the image
  //Actual values are not being used yet
  background(0);
  changeColor(oscValues);
  // redraw();
}

function changeColor(oscValues) {
  background(oscValues[0] * 190, oscValues[0] *  120, 90);
  y = y - 8;
  // if (y < 0) {
  //   y = height * oscValues[0];
  //   console.log(y);
  // }
  line(0, y, 200, y);
  
  console.log(oscValues[0]);
}