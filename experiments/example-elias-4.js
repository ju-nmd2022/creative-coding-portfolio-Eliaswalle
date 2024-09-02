let particles = [];

function setup() {
  createCanvas(600, 600);
  blendMode(ADD);
}

const size = 100;
const layers = 20;

function getRandomValue(pos, variance) {
  return pos + map(Math.random(), 0, 1, -variance, variance);
}

function drawLayers(x, y, size, layers) {
  const variance = size / 2.9;
  noFill();

  beginShape(); 
  for (let i = 0; i < layers; i++) {
    const x1 = getRandomValue(x, variance);
    const y1 = getRandomValue(y, variance);

    vertex(x1, y1);
    generateParticle(x1, y1);
  }
  endShape();
}

function generateParticle(x, y) {
  const particle = new Particle(x, y);
  particles.push(particle);
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    const a = Math.random() * Math.PI * 2;
    const v = 0.2 + Math.random();
    this.velocity = createVector(Math.cos(a) * v, Math.sin(a) * v);
    this.lifespan = 10 + Math.random() * 10;
  }

  update() {
    this.lifespan--;
    this.velocity.mult(0.99);
    this.position.add(this.velocity);
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    noStroke();
    fill(200, 0, 0, map(this.lifespan, 0, 200, 11, 255));
    rect(0, 0, 1);
    pop();
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

function draw() {
  background(0, 0, 0);

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      drawLayers(size / 2 + x * size, size / 2 + y * size, size, layers);
    }
  }

  for (let particle of particles) {
    particle.update();
    particle.draw();
  }

  particles = particles.filter((p) => !p.isDead());

}
