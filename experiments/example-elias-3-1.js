let particles = [];
let färg;
const size = 100;
const layers = 2;
const maxParticles = 700;  // Maximum number of particles
let lastParticleTime = 0;
let particleInterval = 10;  // Interval between particle generation

function setup() {
  createCanvas(700, 800);
  background(255, 255, 255);  // White background
  colorMode(HSB);  // Use HSB color mode
  färg = [
    color(255, 0, 0), // Red
    color(255, 165, 0), // Orange
    color(255, 255, 0), // Yellow
    color(0, 255, 0), // Green
    color(0, 0, 255), // Blue
    color(75, 0, 130), // Indigo
    color(238, 130, 238), // Violet (Purple)
  ];

  createParticles(width / 2, height / 2, 0);
}

function getRandomValue(pos, variance) {
  return pos + map(Math.random(), 0, 1, -variance, variance);
}

function drawLayers(x, y, size, layers) {
  const variance = size / 3.9;
  noFill();
 
  beginShape(); 
  for (let i = 0; i < layers; i++) {
    const x1 = getRandomValue(x, variance);
    const y1 = getRandomValue(y, variance);

    vertex(x1, y1);
    // Generate particle only if total particles are below maxParticles
    if (particles.length < maxParticles) {
      generateParticle(x1, y1);
    }
  }
  endShape();
}

class Particle {
  constructor(x, y, degree, r, g, b, generation) {
    this.x = x;
    this.y = y;
    this.lastX = x;
    this.lastY = y;
    this.degree = degree;
    this.maxLife = 1 + Math.floor(Math.random() * 25);
    this.r = r;
    this.g = g;
    this.b = b;
    this.life = 0;
    this.generation = generation;
  }

  move() {
    this.b = 50 + (0.5 * this.maxLife) / this.life;
    this.lastX = this.x;
    this.lastY = this.y;
    this.x += Math.cos((this.degree / 180) * Math.PI) * Math.random() * 20;
    this.y += Math.sin((this.degree / 180) * Math.PI) * Math.random() * 20;
    this.life++;
    this.degree++;
  }

  draw() {
    push();
    stroke(this.r, this.g, this.b, 0.1);
    line(this.lastX, this.lastY, this.x, this.y);
    pop();
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}

function createParticles(x, y, generation) {
  let r = Math.random() * 360; // Random hue
  let g = Math.random() * 100; // Random saturation
  let b = Math.random() * 100; // Random brightness
  let maxDegrees = 180;
  let offset = 0;
  for (let i = offset; i < offset + maxDegrees; i++) {
    let particle = new Particle(x, y, i * 2, r, g, b, generation);
    particles.push(particle);
  }
}

function generateParticle(x, y) {
  const particle = new Particle(x, y, Math.random() * 360, Math.random() * 360, Math.random() * 100, Math.random() * 100, 0);
  particles.push(particle);
}

function draw() {
  background(255, 50, 255); // White background

  // Control particle generation rate
  if (frameCount - lastParticleTime > particleInterval) {
    lastParticleTime = frameCount;  // Update last generation time

    // Generate and draw particles in a grid pattern
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        drawLayers(size / 2 + x * size, size / 2 + y * size, size, layers);
      }
    }
  }

  // Update and draw all particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.draw();
    particle.move();

    if (particle.isDead()) {
      particles.splice(i, 1); // Remove dead particles
      if (particle.generation < 1) {
        createParticles(particle.x, particle.y, particle.generation + 1);
      }
    }
  }
}
