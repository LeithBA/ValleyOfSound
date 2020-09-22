let time = 0;
let speed = 0.08;

let w, h;

let cols, rows;

let scale = 32;
let roughness = 0.05;
let amount = 750;

let mouseMoveX = 0;
let mouseMoveY = 0;

let amplitude;
let smoothVol = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 1400);
  fill(0);
  w = width - 100;
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
  smoothVol = lerp(smoothVol, amplitude.volNorm, 0.05);
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
  for (var y = 0; y <= rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x <= cols + 1; x++) {
      let n = noise(x * roughness, y * roughness - time);
      let xPos = x * scale;
      let yPos = y * scale;

      let col = pow(map(y, 0, rows - 1, 3, 7) * map(n, 0, 1, 0.5, 1), 3);
      stroke(col);
      strokeWeight(1 + 2 * y / rows);
      vertex(xPos, yPos, n * amount * smoothVol);
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
  stroke(smoothVol * 200);
  sphere(100, floor(8 * smoothVol, 0), floor(8 * smoothVol, 0));
}

function playSoundOnInput() {
  let dur = deltaTime / 60;
  let time = 0;
  let vel = 0.5;
  if (keyIsPressed === true) {
    let note = '';
    switch (keyCode) {
      case 49: note = 'A3'; break;
      case 50: note = 'B3'; break;
      case 51: note = 'C3'; break;
      case 52: note = 'D3'; break;
      case 53: note = 'E3'; break;
      case 54: note = 'F3'; break;
      case 55: note = 'G3'; break;
      case 56: note = 'A4'; break;
      case 57: note = 'B4'; break;
      case 48: note = 'C4'; break;
      default: break;
    }

    polySynth.play(note, vel, 0, dur)


    // polySynth.play('C3', vel, time += 1 / 3, dur);
    // polySynth.play('G3', vel, time += 1 / 3, dur);
  }
}