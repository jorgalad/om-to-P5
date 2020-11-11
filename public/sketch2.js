// This is the Client, it send messages to the server but also receives shit
let socket = io();

let width = 600;
let height = 400;
let y = 100;
let x = 0;
let color = 0;
let ball;

let oscValues = 0;

function setup() {
  createCanvas(width, height);
  // stroke(255);
  frameRate(30);
  socket = io.connect("http://localhost:3000");
  socket.on("receiveOSC", inMessage);
  ball = new Ball();
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
  console.log(oscValues);
  ball.bounce(25);
  // ball = new Ball(oscValues);
  // ball.move();
  // ball.bounce();
  // ball.show();
  // noStroke();
  // fill(255, 0, 100);
}
let oscValue = 0;
function draw() {
  background(0);

  ball.move();
  ball.bounce(0);
  ball.show();
  noStroke();
  fill(255, 0, 100);
}

class Ball {
  constructor() {
    // console.log(osc1);
    this.x = 200;
    this.y = 200;
    this.xspeed = 4;
    this.yspeed = -3;
  }
  move() {
    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
  }
  bounce(arg1) {
    if (this.x > width || this.x < 0) {
      this.xspeed = this.xspeed * -1;
    }
    if (this.y > height || this.y < 0) {
      this.yspeed = this.yspeed * -1;
    }
  }
  show() {
    stroke(255);
    strokeWeight(4);
    noFill();
    ellipse(this.x, this.y, 24, 24);
  }
}
