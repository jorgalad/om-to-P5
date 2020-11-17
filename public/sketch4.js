// This is the Client, it send messages to the server but also receives shit
// let socket = io();

let width = 720;
let height = 400;
let x = 0;
let color = 0;
let ball;
let y;
let systems;

function setup() {
  createCanvas(720, 400);
  frameRate(15);
  systems = [];
  // stroke(255);
  // noLoop();
  y = height * 0.5;
  socket = io.connect("http://localhost:3000");
  socket.on("receiveOSC", inMessage);
  // ball = new Ball();
}

function draw() {
  background(51);
  background(0);
    for (i = 0; i < systems.length; i++) {
    systems[i].run();
    systems[i].addParticle();
  }
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

  this.p = new ParticleSystem(createVector(700 * oscValues[0], 600 * oscValues[0]));
  systems.push(p);

}

function changeColor(oscValues) {
  // background(oscValues[0] * 190, oscValues[0] *  120, 90);
  y = y - 8;
  if (y < 0) {
    y = height;
  }
  line(0, y, width, y);
  
  console.log(oscValues[0]);
}


function mousePressed() {
  this.p = new ParticleSystem(createVector(mouseX, mouseY));
  systems.push(p);
}





// A simple Particle class
let Particle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 200.0; //255.0
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 5;
};

// Method to display
Particle.prototype.display = function () {
  stroke(300, this.lifespan);
  strokeWeight(2);
  fill(12, this.lifespan);
  ellipse(this.position.x, this.position.y, 12, 12); //12, 12
};

// Is the particle still useful?
Particle.prototype.isDead = function () {
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

let ParticleSystem = function (position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function () {
  // Add either a Particle or CrazyParticle to the system
  if (int(random(0, 1)) == 0) {
    p = new Particle(this.origin);
  }
  else {
    p = new CrazyParticle(this.origin);
  }
  this.particles.push(p);
};

ParticleSystem.prototype.run = function () {
  for (let i =  this.particles.length - 1; i >= 0; i--) { //this.particles.length
    // console.log(this.particles.length);
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};

// A subclass of Particle

function CrazyParticle(origin) {
  // Call the parent constructor, making sure (using Function#call)
  // that "this" is set correctly during the call
  Particle.call(this, origin);

  // Initialize our added properties
  this.theta = 0.0;
};

// Create a Crazy.prototype object that inherits from Particle.prototype.
// Note: A common error here is to use "new Particle()" to create the
// Crazy.prototype. That's incorrect for several reasons, not least
// that we don't have anything to give Particle for the "origin"
// argument. The correct place to call Particle is above, where we call
// it from Crazy.
CrazyParticle.prototype = Object.create(Particle.prototype); // See note below

// Set the "constructor" property to refer to CrazyParticle
CrazyParticle.prototype.constructor = CrazyParticle;

// Notice we don't have the method run() here; it is inherited from Particle

// This update() method overrides the parent class update() method
CrazyParticle.prototype.update=function() {
  Particle.prototype.update.call(this);
  // Increment rotation based on horizontal velocity
  this.theta += (this.velocity.x * this.velocity.mag()) / 5.0;
}

// This display() method overrides the parent class display() method
CrazyParticle.prototype.display=function() {
  // Render the ellipse just like in a regular particle
  Particle.prototype.display.call(this);
  // Then add a rotating line
  // push();
  translate(this.position.x, this.position.y);
  rotate(this.theta);
  stroke(255, this.lifespan);
  line(0, 0, 25, 25);
  pop();
}

