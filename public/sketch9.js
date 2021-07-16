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

function convertRange(value, low, high) { 
  return ( value - low )  * ( high - low );
}

function setup() {
  createCanvas(1000, 800, WEBGL);
  stroke(255);
  noLoop();
  // frameRate(25);
  y = height; // * 0.5;
  socket = io.connect("http://localhost:3000");
  socket.on("receiveOSC", inMessage);
}

function draw() {
  background(255);
}

function inMessage(oscMessage) {
  //Practice Destructuring
  if (Object.values(oscMessage).indexOf(`/thread1`) > -1) {
    const {args} = oscMessage;
    
    thread_1(args[0]);
  }
  if (Object.values(oscMessage).indexOf(`/thread2`) > -1) {
    const {args} = oscMessage;
    // console.log(`Thread 2 Value 1: ${args[0]}`)
    thread_2(args[0]);
  };

  // if (Object.values(oscMessage).indexOf(`/thread1`) > -1) {
  //   for (let i of Object.keys(oscMessage)) {
  //     let t1 = oscMessage[i];
  //     thread_1(t1);
  //     console.log(t1)
  //     continue;
  //   } 
  // }  

  // if (Object.values(oscMessage).indexOf(`/thread2`) > -1) {
  //   for (let i of Object.keys(oscMessage)) {
  //     let t2 = oscMessage[i]
  //     thread_2(t2);
  //     continue;
  // }}
}


function thread_1 (t1) {
  console.log(`Thread 1 Value: ${t1}`)
  let t1conv = ( t1[0] - 0 )  * ( 200 - 0 );
  // background(conv2, oscValues[0] *  120, 90);
  y = y - 15;
  // line(-500, y+t1conv, 400, -100 + y);
  line(-500, t1, 400, -100 + y);
  stroke(150, t1, 130);
  strokeWeight(2)
}

function thread_2 (t2) {
  console.log(`Thread 2 Value: ${t2}`)
  y = y - 15;
  // line(50, y+t2conv, 400, -100 + y);
  //line(-300, y-t2conv, 400, 100 - y);
  line(-700, y-400, 100, 100 - y);
  stroke(map(t2, 0, 255, 50, 100), map(t2, 0, 255, 90, 150), map(t2, 0, 255, 20, 80))
  //stroke(t2, t2, t2);
  strokeWeight(2)


  // let r = random(-50, 50);
  // ellipse(15 *  r, 5 * r + t2 , 10, 10);
  // console.log(t2)
  // line(300, 200+t2, 400, 200+t2);
}