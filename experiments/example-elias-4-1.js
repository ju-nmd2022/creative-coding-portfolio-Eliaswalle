let squareSize = 100;
let squareCenterY;
let squareCenterX;

let numAgents = 50; // Further reduced number of agents to improve performance
let soundCooldown = 10; // Cooldown for sound to avoid triggering too frequently

// The Agent class represents an object that can move, follow a direction, and interact with borders.
class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.lastPosition = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.hasCollided = false; // To track if a collision occurred recently
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  gravitationalPull(squareCenterX, squareCenterY) {
    let force = createVector(squareCenterX, squareCenterY);
    force.sub(this.position);

    let distance = force.mag();
    distance = constrain(distance, 5, 100);

    let strength = (this.maxSpeed * 100) / (distance * distance);
    force.setMag(strength);

    this.applyForce(force);
  }

  update() {
    this.lastPosition = this.position.copy();
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  checkBorders() {
    if (this.position.x < 0) {
      this.position.x = innerWidth;
      this.lastPosition.x = innerWidth;
    } else if (this.position.x > innerWidth) {
      this.position.x = 0;
      this.lastPosition.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = innerHeight;
      this.lastPosition.y = innerHeight;
    } else if (this.position.y > innerHeight) {
      this.position.y = 0;
      this.lastPosition.y = 0;
    }
  }

  checkSquareCollision(squareCenterX, squareCenterY, squareSize) {
    const halfSize = squareSize / 2;

    if (
      this.position.x > squareCenterX - halfSize &&
      this.position.x < squareCenterX + halfSize &&
      this.position.y > squareCenterY - halfSize &&
      this.position.y < squareCenterY + halfSize
    ) {
      if (!this.hasCollided) {
        if (
          Math.abs(this.position.x - squareCenterX) >
          Math.abs(this.position.y - squareCenterY)
        ) {
          this.velocity.x *= -1;
        } else {
          this.velocity.y *= -1;
        }

        // Trigger sound once per collision
        playCollisionSound();
        this.hasCollided = true; // Mark as collided
      }
    } else {
      this.hasCollided = false; // Reset collision state once agent moves away
    }
  }

  draw() {
    push();
    stroke(0, 0, 0, 40);
    strokeWeight(2);
    line(
      this.lastPosition.x,
      this.lastPosition.y,
      this.position.x,
      this.position.y
    );
    pop();
  }
}

let agents = [];
let soundCooldownCounter = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  squareCenterY = height / 2;
  squareCenterX = width / 2;

  generateAgents();
}

function generateAgents() {
  for (let i = 0; i < numAgents; i++) {
    let agent = new Agent(
      Math.random() * width,
      Math.random() * height,
      4,
      0.1
    );
    agents.push(agent);
  }
}

function draw() {
  background(255, 255, 255, 40); // Clear background with a little transparency

  fill(0);
  rectMode(CENTER);
  rect(squareCenterX, squareCenterY, squareSize, squareSize);

  for (let agent of agents) {
    agent.gravitationalPull(squareCenterX, squareCenterY);
    agent.checkSquareCollision(squareCenterX, squareCenterY, squareSize);
    agent.update();
    agent.checkBorders();
    agent.draw();
  }

  if (soundCooldownCounter > 0) {
    soundCooldownCounter--; // Reduce cooldown every frame
  }
}

function playCollisionSound() {
  if (soundCooldownCounter === 0) {
    if (!Tone.context.state.startsWith("running")) {
      Tone.context.resume(); // Resume audio context for browsers that block autoplay
    }

    const synth = new Tone.Synth().toDestination();
    const randomNote = ["C4", "E4", "G4", "A4", "B4"][
      Math.floor(Math.random() * 5)
    ];
    synth.triggerAttackRelease(randomNote, "8n");

    soundCooldownCounter = soundCooldown; // Reset cooldown after playing sound
  }
}
