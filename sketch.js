let time = 0;
let speed = 0.05;

let w, h;

let cols, rows;

let scale = 64;
let roughness = 0.05;
let amount = 650;

let mouseMoveX = 0;
let mouseMoveY = 0;

let amplitude;
let smoothVol = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 1400);
  fill(0);
  w = width;
  h = height;
  cols = w / scale;
  rows = h / scale;
  cursor(CROSS);

  polySynth = new p5.PolySynth();
  userStartAudio();

  amplitude = new p5.Amplitude();
}

function draw() {
  background(0);
  smoothVol = lerp(smoothVol, amplitude.volNorm, 0.05) + 0.002;
  time += speed * smoothVol;

  setupCamera();
  drawTerrain();
  drawArtefact();
  playSoundOnInput();
}

function setupCamera() {
  translate(0, 250);
  rotateX(PI / 3);


  //mouseMoveX = lerp(mouseMoveX, (width / 2 - mouseX) * 0.2, 0.2);
  //mouseMoveY = lerp(mouseMoveY, (height / 2 - mouseY) * 0.1, 0.1);


  translate(-w / 2, -h / 2, 0);
}

function drawTerrain() {
  fill(0);
  for (var y = 0; y <= rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x <= cols + 1; x++) {
      let n = noise(x * roughness, y * roughness - time);
      let xPos = x * scale;
      let yPos = y * scale;

      let col = pow(map(y, 0, rows - 1, 3, 7) * map(n, 0, 1, 0.5, 1), 3);
      stroke(col);
      strokeWeight(1 + 2 * y / rows);
      vertex(xPos, yPos, n * amount * smoothVol + 0.15);
      vertex(xPos, (y + 1) * scale, noise(x * roughness, (y + 1) * roughness - time) * amount * smoothVol);

    }
    endShape();
  }
}

function drawArtefact() {
  translate(width / 2, height / 2, 500 + sin(time) * 20);
  rotateX(time);
  rotateY(time);
  rotateZ(time);
  stroke(smoothVol * 255);
  sphere(100 * smoothVol, floor(8 * smoothVol, 0), floor(8 * smoothVol, 0));
}

function playSoundOnInput() {
  let dur = deltaTime / 60;
  let vel = 1.0;
  if (keyIsPressed === true) {
    let note = '';

    if (keyCode == 49)
      polySynth.play("A3", vel, 0, dur);
    if (keyCode == 50)
      polySynth.play("B3", vel, 0, dur);
    if (keyCode == 51)
      polySynth.play("C3", vel, 0, dur);
    if (keyCode == 52)
      polySynth.play("D3", vel, 0, dur);
    if (keyCode == 53)
      polySynth.play("E3", vel, 0, dur);
    if (keyCode == 54)
      polySynth.play("F3", vel, 0, dur);
    if (keyCode == 55)
      polySynth.play("G3", vel, 0, dur);
    if (keyCode == 56)
      polySynth.play("A4", vel, 0, dur);
    if (keyCode == 57)
      polySynth.play("B4", vel, 0, dur);
    if (keyCode == 48)
      polySynth.play("C4", vel, 0, dur);


  }
}