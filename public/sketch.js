let time = 0;
let speed = 0.05;

let cols, rows;

let scale = 64;
let roughness = 0.05;
let amount = 600;

let mouseMoveX = 0;
let mouseMoveY = 0;

let amplitude;
let smoothVol = 0;
let type = 0;

let osc = [];
let startNote = 130.81;

let recorder;
let soundFile;
let recording = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  ortho(-width / 2 - 20, width / 2 + 40, -height / 2, height / 2, 0, 5000);
  fill(0);
  cols = width / scale;
  rows = height / scale;
  cursor(CROSS);

  amplitude = new p5.Amplitude();

  createOscillators();
  tuneOscillators();

  recorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();
  recorder.record(soundFile);
}

function createOscillators() {
  for (let i = 0; i < 7; i++) {
    osc[i] = new p5.Oscillator('sine');
    osc[i].amp(0);
    osc[i].start();
  }
}

function tuneOscillators() {
  for (let i = 0; i < 7; i++) {
    osc[i].freq(startNote * pow(2, i / 12));
  }
}

function tune(value) {
  startNote = startNote * pow(2, value / 12);
  tuneOscillators();
}

function changeType() {
  type = (type + 1) % 4
  osc.forEach(osci => osci.setType(getType()));

  //console.log(getType());
}

function startRecording(duration) {
  if (recording) { endRecording(); return; }
  recording = true;
  console.log("Recording!");
  recorder.record(soundFile, duration, endRecording);
}

function endRecording() {
  recording = false;
  console.log("Done Recording!");
  recorder.stop();
  sendToServer();
}

function sendToServer() {
  var file = soundFile.getBlob()
  var date = day() + '/' + month() + '/' + year() + ' ' + hour() + ':' + minute() + ':' + second();
  var title = 'Valley Of Sound : ' + date;

  const formData = new FormData()
  formData.append('title', title)
  formData.append('experiment', file, 'valley_' + date + '.wav')

  fetch('/experiment', {
    method: 'POST',
    body: formData,
  }).then(res => console.log(res.text()))
}

function getType() {
  switch (type) {
    case 0: return "sine";
    case 1: return "triangle";
    case 2: return "square";
    case 3: return "sawtooth";
  }
}

function draw() {
  background(0);
  smoothVol = lerp(smoothVol, amplitude.volNorm, 0.05) + 0.002;
  time += speed * smoothVol;

  setupCamera();
  drawTerrain();
  drawArtefacts();
}

function setupCamera() {
  translate(0, 250);
  rotateX(PI / 3);
  translate(-width / 2, -height / 2, 0);
}

function drawTerrain() {
  fill(0);
  for (var y = 0; y <= rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols + 1; x++) {
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

function drawArtefacts() {
  for (let i = 0; i < 7; i++) {
    push();
    translate(width / 2 - 300 * 3 + (300 * i), height / 2, 600 + sin(time + i) * 50);
    rotateX(time + i);
    rotateY(time + i);
    rotateZ(time + i);
    stroke(osc[i].getAmp() * 255);
    sphere(100 * osc[i].getAmp(), floor(8 * osc[i].getAmp(), 0), floor(8 * osc[i].getAmp(), 0));
    pop();
  }
}


function keyPressed() {
  let timeToStart = 0.2;
  //console.log("pressed: " + keyCode);
  switch (keyCode) {
    case 49: osc[0].amp(1, timeToStart); break;
    case 50: osc[1].amp(1, timeToStart); break;
    case 51: osc[2].amp(1, timeToStart); break;
    case 52: osc[3].amp(1, timeToStart); break;
    case 53: osc[4].amp(1, timeToStart); break;
    case 54: osc[5].amp(1, timeToStart); break;
    case 55: osc[6].amp(1, timeToStart); break;

    case 13: startRecording(10); break;
    case 84: changeType(); break;
    case 107: tune(7); break;
    case 109: tune(-7); break;

    default: break;
  }
}

function keyReleased() {
  let timeToStop = 0.8;
  //console.log("released: " + keyCode);
  switch (keyCode) {
    case 49: osc[0].amp(0, timeToStop); break;
    case 50: osc[1].amp(0, timeToStop); break;
    case 51: osc[2].amp(0, timeToStop); break;
    case 52: osc[3].amp(0, timeToStop); break;
    case 53: osc[4].amp(0, timeToStop); break;
    case 54: osc[5].amp(0, timeToStop); break;
    case 55: osc[6].amp(0, timeToStop); break;
    default: break;
  }
}

function windowResized() {
  setup();
}