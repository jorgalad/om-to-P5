// This is the Client, it send messages to the server but also receives shit
// let socket = io();

let width = 720;
let height = 400;

// let bubbles = [100, 25, 46, 72];

function setup() {
  createCanvas(1080, 800, WEBGL);
  socket = io.connect("http://localhost:3000");
  socket.on("receiveOSC", inMessage);
  frameRate(25);

  //test range
  const xMax = 10;
  const xMin = 1;
  const yMax = 0.0001;
  const yMin = 0.6;
 
}

function convertRange( value, low, high) { 
  return ( value - low )  * ( high - low );
  // return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}


console.log(convertRange( 0.5, 0, 100 ));

// console.log(convertRange(0.344, 1, 127));


function draw() {
  background(255);
    rotateX(frameCount * 0.010);
    for (let j = 0; j < 1; j++) {
    push();
    for (let i = 0; i < 20; i++) {
      translate(
        (sin(frameCount * 0.001 + j) * 50),
       1
        // sin(frameCount * 0.001 + j) * 100,
        // sin(frameCount * 0.001 + j) * 100,
        // i * 0.1
      );
      rotateZ(frameCount * 0.00010);
      push();
      sphere(80, 16, 15);
      pop();
    }
    // pop();


}

function mouseDragged() {

  }
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
  let conv = convertRange(oscValues[0], 0, 100 );
  // background(oscValues[0] * 190, oscValues[0] *  120, 90);
  y = y - 8;
  if (y < 0) {
    y = height;
  }
  line(0, conv, width, conv);
  
  console.log(oscValues[0]);
}





