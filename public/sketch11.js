// This is the Client, it send messages to the server but also receives shit
// let socket = io();
/*
Close Specific Port:
sudo lsof -i :57121

//List all UDP and TCP ports
listports

netstat -anvp tcp | awk 'NR<3 || /LISTEN/'
sudo lsof -PiTCP -sTCP:LISTEN
*/

let width = 720;
let height = 400;
let x;
let color = 0;
let y;

let snowflakes1 = [];
let snowflakes2 = [];

function convertRange(value, low, high) { 
  return ( value - low )  * ( high - low );
}

function setup() {
  createCanvas(1000, 600, WEBGL);
  stroke(255);
  //noLoop();
  y = 0;
  socket = io.connect("http://localhost:3000");
  socket.on("receiveOSC", inMessage); 
}

function draw() {
  background(0);
  
  let t = frameCount / 150; 
  for (let flake1 of snowflakes1) {
    flake1.update(t); 
    flake1.display(); 
  }
  for (let flake2 of snowflakes2) {
    flake2.update(t); 
    flake2.display(); 
  }
}

function inMessage(oscMessage) {
  if (Object.values(oscMessage).indexOf(`/thread1`) > -1) {
    const {args} = oscMessage;
    thread_1(args[0]);
  }
  if (Object.values(oscMessage).indexOf(`/thread2`) > -1) {
    const {args} = oscMessage;
    thread_2(args[0]);
  };
}
//Colour
function thread_1 (t1) {
  console.log(`Thread 1 Value: ${t1}`)
  //y += 9;
  //line(-500 + y, t1, -490 + y, t1)
  // stroke(150, t1, 130);
  //strokeWeight(6)
  for (let i = 0; i < random(5); i++) {
    snowflakes1.push(new snowflake1(t1)); 
  }
}

function thread_2 (t2) {
  console.log(`Thread 2 Value: ${t2}`)
  for (let i = 0; i < random(50); i++) {
    snowflakes2.push(new snowflake2(t2)); 
  }

}
//Melody
function snowflake1(t1) {
  this.posX = 300;
  this.posY = random(-250, 200);
  this.initialangle = random(0, 2 * PI);
  this.size = random(2, 5);
  this.radius = sqrt(random(pow(width / 0.5, 2)));

  this.update = function(time) {
    let w = 0.2; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);

    this.posY += pow(this.size, 0.5);
    if (this.posY > height) {
      let index = snowflakes1.indexOf(this);
      snowflakes1.splice(index, 1);
    }
  };
  
  this.display = function() {
    ellipse(this.posX, this.posY, this.size);
    stroke(150, 20, t1);
  };
}
//Bass
function snowflake2(t2) {
  this.posX = 300 ;
  this.posY = random(-250, -200);
  this.initialangle = random(0, 2 * PI);
  this.size = random(1.5, 5);
  this.radius = sqrt(random(pow(width / 0.5, 2)));

  this.update = function(time) {
    let w = 0.6; 
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);
    this.posY += pow(this.size, 0.5);
    if (this.posY > height / 0.5) {
      let index = snowflakes2.indexOf(this);
      snowflakes2.splice(index, 1);
    }
  };
  
  this.display = function() {
    ellipse(this.posX, this.posY, this.size * map(t2, 0, 255, 1.5, 4));
    stroke(100, 180, t2);
    fill(100, t2, 180);
  };
}
