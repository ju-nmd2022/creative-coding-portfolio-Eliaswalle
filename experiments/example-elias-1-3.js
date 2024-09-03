function setup() {
  createCanvas(1000, 1000);
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
const size = 60;
const layers = 8;

function getRandomValue(pos, variance) {
  return pos + map(Math.random(), 0, 1, -variance, variance);
}

function drawLayers(x, y, size, layers) {
  const variance = size / 20;
  noFill();

  for (let i = 0; i < layers; i++) {
    if (Math.random() > 0.8) {
      continue;
    }
    const s = (size / layers) * i;
    const half = s / 2;
    beginShape();
    let x1 = getRandomValue(x - half, variance);
    let y1 = getRandomValue(y - half, variance);
    let x2 = getRandomValue(x + half, variance);
    let y2 = getRandomValue(y - half, variance);
    let x3 = getRandomValue(x + half, variance);
    let y3 = getRandomValue(y + half, variance);
    let x4 = getRandomValue(x - half, variance);
    let y4 = getRandomValue(y + half, variance);

    vertex(x1, y1);
    vertex(x2, y2);
    vertex(x3, y3);
    vertex(x4, y4);
    endShape(CLOSE);

    let randomColor = random(färg);
    stroke(randomColor);

    // Draw ellipses at the corners
    ellipse(x1, y1, 10, 10);
    ellipse(x2, y2, 10, 10);
    ellipse(x3, y3, 10, 10);
    ellipse(x4, y4, 10, 10);
  }
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
