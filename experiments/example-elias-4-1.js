let squareSize = 100; // SIZE OF THE SQUARE
let squareCenterY;
let squareCenterX;

let numAgents = 20; // NUMBER of DOTS running around
let soundCooldown = 5;

// The Agent class represents an object that can move, follow a direction, and interact with borders.
class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.lastPosition = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.hasCollided = false;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  // Using the lesson and chat to get gravitational pull towards square
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
          this.velocity.x *= -2; // Reverse horizontal way
        } else {
          this.velocity.y *= -2; // Reverse vertical way
        }

        playCollisionSound();
        this.hasCollided = true;
      }
    } else {
      this.hasCollided = false;
    }
  }

  draw() {
    push();
    stroke(0, 0, 0, 400);
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
  background(255, 255, 255, 40); // Clear background with slight transparency, creating a fading effect

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
    soundCooldownCounter--;
  }
}

// Function to play a sound on collision
function playCollisionSound() {
  if (soundCooldownCounter === 0) {
    if (!Tone.context.state.startsWith("running")) {
      Tone.context.resume(); // Resume audio context to enable sound
    }

    const synth = new Tone.FMSynth().toDestination(); // the synthesizer
    const randomNote = ["E1", "G2", "A1", "B2"][Math.floor(Math.random() * 4)]; // play a random note
    synth.triggerAttackRelease(randomNote, "8n"); // Play the selected note for a short duration

    soundCooldownCounter = soundCooldown;
  }
}
