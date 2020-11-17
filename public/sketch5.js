// This is the Client, it send messages to the server but also receives shit
// let socket = io();

let width = 720;
let height = 400;

// let bubbles = [100, 25, 46, 72];
let bubbles = [];

function setup() {
  createCanvas(720, 400);
  socket = io.connect("http://localhost:3000");
  socket.on("receiveOSC", inMessage);
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(10, 5);
    bubbles[i] = new Bubble(x, y, r)
  }
}


function draw() {
  background(0);
  for (let bubble of bubbles) {
    bubble.show()
    bubble.move()
    
  }
  // for (let i = 0; i < bubbles.length; i++){
    // bubbles[i].show()
    // bubbles[i].move()
  // }

  // bubble1.move()
  // bubble1.show()
}

function mousePressed() {
  //Use for testing
  let r = random(10, 50);
  let b = new Bubble(mouseX, mouseY, r);
  // bubbles[0] = b;
  //Push something to the end of the array
  bubbles.push(b)
  
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





