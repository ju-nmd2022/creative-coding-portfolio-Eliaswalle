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
  const size = 60;
  const layers = 8;
  
  function getRandomValue(pos, variance) {
    return pos + map(Math.random(), 0, 1, -variance, variance);
  }
  
  function drawLayers(x, y, size, layers) {
    // const half = size / 2;
    const variance = size / 20;
    noFill();
    // rectMode(CENTER);
    for (let i = 0; i < layers; i++) {
      if (Math.random() > 0.8) {
        continue;
      }
      const s = (size / layers) * i;
      const half = s / 2;
      beginShape();
      vertex(
        getRandomValue(x - half, variance),
        getRandomValue(y - half, variance)
      );
      vertex(
        getRandomValue(x + half, variance),
        getRandomValue(y - half, variance)
      );
      vertex(
        getRandomValue(x + half, variance),
        getRandomValue(y + half, variance)
      );
      vertex(
        getRandomValue(x - half, variance),
        getRandomValue(y + half, variance)
      );
      endShape(CLOSE);
      let randomColor = random(färg);
      stroke(randomColor);
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