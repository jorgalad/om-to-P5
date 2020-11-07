// var socket = require("socket.io");
// Use import vs. Require

var socket = io();
let width = 600;
let height = 400;

//Write Function that receives Messages

function setup() {
  createCanvas(width, height);
  // stroke(255);
  frameRate(30);
  socket = io.connect("http://localhost:3000");
  socket.on("connection", simpleFunction);

  ball = new Ball();
}

function simpleFunction(bla) {
  console.log(`Something received in Sketch`);
}

let y = 100;
let x = 0;
let color = 0;

let ball;

function draw() {
  background(0);
  ball.move();
  ball.bounce();
  ball.show();

  // sendData();
}

//Probably don't need this ( I just need to receive messages (data), not send)
function sendData() {
  socket.emit("func1", ball.y);
  socket.emit("func2", ball.x);
  //   console.log(ball.x); //Check in browser console
}

// console.log(oscMessage);

class Ball {
  constructor() {
    this.x = 300;
    this.y = 200;
    this.xspeed = 4;
    this.yspeed = -3;
  }
  move() {
    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
  }
  bounce() {
    if (this.x > width || this.x < 0) {
      this.xspeed = this.xspeed * -1;
    }
    if (this.y > height || this.y < 0) {
      this.yspeed = this.yspeed * -1;
    }
  }
  show() {
    stroke(255);
    strokeWeight(5);
    noFill();
    ellipse(this.x, this.y, 24, 24);
  }
}
