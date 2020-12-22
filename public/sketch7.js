// This is the Client, it send messages to the server but also receives shit
// let socket = io();

let width = 720;
let height = 400;
let x = 0;
let color = 0;
let y;

function convertRange(value, low, high) { 
  return ( value - low )  * ( high - low );
}

function setup() {
  createCanvas(600, 400);
  stroke(255);
  noLoop();
  // frameRate(25);
  y = height; // * 0.5;
  socket = io.connect("http://localhost:3000");
  socket.on("receiveOSC", inMessage);
}


function draw() {
  background(0);
}

function inMessage(oscMessage) {
  if (Object.values(oscMessage).indexOf(`/thread1`) > -1) {
    for (let i of Object.keys(oscMessage)) {
      let t1 = oscMessage[i];
      thread_1(t1);
      continue;
      // console.log(`Thread 1 Value: ${thread1}`)
    } 
  }  

  if (Object.values(oscMessage).indexOf(`/thread2`) > -1) {
    for (let i of Object.keys(oscMessage)) {
      let t2 = oscMessage[i]
      // console.log(`Thread 2 Value: ${thread2}`)
      thread_2(t2);
      continue;
  }}
}


function thread_1 (t1) {
  // console.log(t1);
  // const conv1 = convertRange(t1[0], 0, 100);
  // const conv2 = convertRange(t1[0], 0, 255);
  let t1conv = ( t1[0] - 0 )  * ( 200 - 0 );
  // background(conv2, oscValues[0] *  120, 90);
  y = y - 15;
  line(50, y+t1conv, 400, -100 + y);
  // ellipse(15, 15, 40, + y);
  strokeWeight(2)
}

function thread_2 (t2) {
  // console.log(t2[0]);
  let t2conv = ( t2[0] - 0 )  * ( 50 - 0 );
  // console.log(typeof t2conv)

  // const conv1 = convertRange(t2[0], 0, 200);
  // ellipse(conv1 + 200, t2[0]+200, 15, 15);
  // y = y - 8;
  // t2conv = t2conv - 10;
  let r = random(-50, 50);
  ellipse(15 *  r, 5 * r + t2conv , 10, 10);
  // console.log(t2conv)
  // line(300, 200+t2conv, 400, 200+t2conv);
}
