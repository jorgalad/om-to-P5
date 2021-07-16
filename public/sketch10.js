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

function setup() {
  createCanvas(1000, 600, WEBGL);
  stroke(255);
  noLoop();
  y = 0;
  socket = io.connect("http://localhost:3000");
  socket.on("receiveOSC", inMessage);
}

function draw() {
  background(0);
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

function thread_1 (t1) {
  console.log(`Thread 1 Value: ${t1}`)
  y += 9;
  line(-500 + y, t1, -490 + y, t1)
  stroke(150, t1, 130);
  strokeWeight(6)
}

function thread_2 (t2) {
  console.log(`Thread 2 Value: ${t2}`)
  y += 9;
  line (-500 + y, 300 - t2/2, -500 + y, 280 - t2/2)
  stroke(map(t2, 0, 255, 50, 100), map(t2, 0, 255, 90, 150), map(t2, 0, 255, 160, 200))
  strokeWeight(6)
}

