let time = 0;
let speed = 0.04;

let w, h;

let cols, rows;

let scale = 20;
let roughness = 0.05;
let amount = 550;

let mouseMoveX = 0;
let mouseMoveY = 0;


function setup() {
  createCanvas(windowWidth - 10, windowHeight - 10, WEBGL);
  fill(0);
  w = width;
  h = height;
  cols = w / scale;
  rows = h / scale;
  noCursor();
  
  polySynth = new p5.PolySynth();
  userStartAudio();
}

function draw() {
  background(0);
  time += speed;

  controlCamera();
  drawTerrain();
  playSoundOnInput();
}

function controlCamera() {
  translate(0, 250);
  rotateX(PI / 3);
  mouseMoveX = lerp(mouseMoveX, (width / 2 - mouseX) * 0.2, 0.2);
  mouseMoveY = lerp(mouseMoveY, (height / 2 - mouseY) * 0.1, 0.1);
  translate(-w / 2 + mouseMoveX, -h / 2, -mouseMoveY);
}

function drawTerrain() {
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      let n = noise(x * roughness, y * roughness - time);
      let xPos = x * scale;
      let yPos = y * scale;

      let col = pow(map(y, 0, rows - 1, 1, 6) * map(n, 0, 1, 0.5, 1), 3);
      stroke(col);
      strokeWeight(1 + 2 * y / rows);
      vertex(xPos, yPos, n * amount);
      vertex(xPos, (y + 1) * scale, noise(x * roughness, (y + 1) * roughness - time) * amount);

    }
    endShape();
  }
}

function playSoundOnInput()
{
  if (keyIsPressed === true) {
     let dur = 1.5;

  // time from now (in seconds)
  let time = 0;

  // velocity (volume, from 0 to 1)
  let vel = 0.1;

  // notes can overlap with each other
  polySynth.play('G2', vel, 0, dur);
  polySynth.play('C3', vel, time += 1/3, dur);
  polySynth.play('G3', vel, time += 1/3, dur);
  }
}