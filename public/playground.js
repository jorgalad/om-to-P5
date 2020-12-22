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

// let circle = {
//   x: 0,
//   y: 75,
//   diameter: 50
// };

// let bgCol = 0;


// function convertRange(value, low, high) { 
//   return ( value - low )  * ( high - low );
// }

// function setup() {
//   createCanvas(600, 400, WEBGL);
// }
 
// function draw() {
//   bgCol = map(mouseX, 0, 600, 0, 255);
//   background(bgCol)
//   fill(250, 118, 200);
//   ellipse(mouseX, 0, circle.diameter, circle.diameter);
//   circle.x += 1;
// }

// ==================== 3.1 Conditional Statements ====================

// function setup() {
//   createCanvas(600, 400)
// }

// function draw() {
//   background(0);
//   stroke(255);
//   strokeWeight(4);
//   noFill();

//   if (mouseX > 300) {
//     fill(255,0,200);
// }
//   ellipse(300, 200, 100, 100);

//   if (mouseX < 300) {
//     fill(255,0,100);
//     rect(100, 200, 200, 200)
// }
// }

// ==================== 3.2 Bouncing Ball ====================
// var x = 0;
// var speed = 5;
// function setup() {
//   createCanvas(600, 400)
// }

// function draw() {
//   background(0);
//   stroke(255);
//   strokeWeight(4);
//   noFill();
 
//   ellipse(x, 200, 100, 100);
//   x = x + speed;
  
//   if (x > width) {
//     speed = -5
//     console.log("Right border Reached!")
//   }
//   if (x == 0) {
//     speed = 5;
//     console.log("Left border Reached!")
//   }
// }
// ==================== 3.3 Else, if and else if ====================
// var x = 0;
// var speed = 5;
// function setup() {
//   createCanvas(600, 400)
// }

// function draw() {
//   background(0);
//   if (mouseX > 300 && mouseX < 400){
//     background(150, 50, 90);
//   }
//   stroke(255);
//   strokeWeight(4);
//   noFill();
  
//   if (mouseX > 250) {
//     ellipse(300, 200, 100, 100);
//   } else if (mouseX > 150) {
//     rect(300, 200, 100, 100);
//   } else if (mouseX > 50) {
//     line(300, 200, width, height);
//   } else {
//     point(300, 200)
//   }
// }
// ==================== 4.1 While and For loops ====================

// function setup() {
//   createCanvas(600, 400)
//   frameRate(30);
// }

// function draw() {
//   background(0);
//   strokeWeight(2);
//   stroke(255);
//   let x = 0;
//   let y  = 0;
//   while (y <= width) {
//     fill(100, 29, 50);
//     rect(y, 100, 25, 25)
    
//     y += 50;
//   }

//   for (i = 0; i < width; i++){
//     fill(20, 129, 50);
//     ellipse(x, 200, 25, 25);
//     x += 50
//   }
// }

// ==================== 4.2 Nested loops ====================
// function setup() {
//   createCanvas(600, 400)
//   frameRate(30);
// }

// function draw() {
//   background(0);
//   strokeWeight(2);
//   stroke(255);
  
//   for (x = 0; x <= width; x+= 50){
//     for (y = 0; y <= height; y += 50) {
//       fill(random(255), 0, random(150))
//       ellipse(x, y, 25, 25)
//     }
//   }  
// }

// ==================== 5.1 Function Basics ====================
function setup() {
  createCanvas(600, 400)
  frameRate(30);
}

function draw() {
  background(0);
  strokeWeight(2);
  stroke(255);
  
  for (x = 0; x <= width; x+= 50){
    for (y = 0; y <= height; y += 50) {
      fill(random(55), 154, random(150))
      ellipse(x, y, 25, 25)
    }
  }  
}
