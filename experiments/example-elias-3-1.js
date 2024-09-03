let particles = [];
let maxParticles = 1000;  // Set the maximum number of particles before resetting

function setup() {
  createCanvas(600, 600);
  blendMode(ADD);
  frameRate(20);
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
const layers = 1;

function getRandomValue(pos, variance) {
  return pos + map(Math.random(), 0, 1, -variance, variance);
}

function drawLayers(x, y, size, layers) {
  const variance = size / 2.4;
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
    const a = Math.random() * Math.PI * 1;
    const v = 1.1 + Math.random();
    this.velocity = createVector(Math.cos(a) * v, Math.sin(a) * v);
    this.lifespan = 120;  // 20 seconds lifespan at 60 FPS
  }

  update() {
    this.velocity.mult(0.99);
    this.position.add(this.velocity);
    this.lifespan--;  // Decrease the lifespan each frame
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    noStroke();
    fill(200, 0, 0, map(this.lifespan, 0, 120, 0, 255));  // Adjusted the map range to 0-120
    rect(0, 0, 1);
    pop();
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

function draw() {
  background(0, 0, 0);


  // Generate and draw particles in a grid pattern
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      drawLayers(size / 2 + x * size, size / 2 + y * size, size, layers);
    }
  }

  // Update and draw all particles
  for (let particle of particles) {
    particle.update();
    particle.draw();
    
  }

  // Remove dead particles
  particles = particles.filter((p) => !p.isDead());

  // Check if the number of particles exceeds the maximum
  if (particles.length >= maxParticles) {
    particles = [];  // Reset the particles array
  }
}