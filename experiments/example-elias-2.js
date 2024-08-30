function setup() {
  createCanvas(600, 600);
  //help from Jim on what i needed to have random colors
  färg = [
    color(255, 0, 0), // Red
    color(255, 165, 0), // Orange
    color(255, 255, 0), // Yellow
    color(0, 255, 0), // Green
    color(0, 0, 255), // Blue
    color(75, 0, 130), // Indigo
    color(238, 130, 238), // Violet (Purple)
  ];
}
let färg;
const size = 100;
const layers = 30;

function getRandomValue(pos, variance) {
  return pos + map(Math.random(), 0, 1, -variance, variance);
}

function drawLayers(x, y, size, layers) {
  const variance = size / 2.6;
  noFill();

  //got help from Chat to get how to use the vertex to get "all over the place lines" and not squares
  beginShape(); // Start drawing the continuous line
  for (let i = 0; i < layers; i++) {
    if (Math.random() > 1.0) {
      continue;
    }

    let randomColor = random(färg);
    stroke(randomColor);
    const x1 = getRandomValue(x, variance);
    const y1 = getRandomValue(y, variance);

    vertex(x1, y1);
  }
  endShape();
}

function draw() {
  background(0, 0, 0);

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      drawLayers(size / 2 + x * size, size / 2 + y * size, size, layers);
    }
  }

  noLoop();
}
