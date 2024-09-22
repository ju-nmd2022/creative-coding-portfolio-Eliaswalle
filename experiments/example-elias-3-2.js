let squareSize = 80;
let squareCenterY = innerHeight / 2;
let squareCenterX = innerWidth / 2;

class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.lastPosition = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.color = color(random(255), random(255), random(255), 100);
  }
// Orbit to make agents move around the "black square", got help from chat and internet to make something orbit
  orbit(squareCenterX, squareCenterY) {
    let dir = p5.Vector.sub(
      createVector(squareCenterX, squareCenterY),
      this.position
    );
    dir.normalize();
    let perpendicular = createVector(-dir.y, dir.x);
    perpendicular.mult(this.maxSpeed);
    let steer = p5.Vector.sub(perpendicular, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.lastPosition = this.position.copy();
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  draw() {
    push();
    stroke(this.color);
    strokeWeight(5);
    line(
      this.lastPosition.x,
      this.lastPosition.y,
      this.position.x,
      this.position.y
    );
    pop();
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(255, 255, 255);
  generateAgents();
}

function generateAgents() {
  for (let i = 0; i < 2000; i++) {
    let x, y;
    let halfSize = squareSize / 2;
    do {
      x = Math.random() * innerWidth;
      y = Math.random() * innerHeight;
    } while (
      x > squareCenterX * halfSize &&
      x < squareCenterX * halfSize &&
      y > squareCenterY * halfSize &&
      y < squareCenterY * halfSize
    );
    let agent = new Agent(x, y, 5, 1.5);
    agents.push(agent);
  }
}

let agents = [];

function draw() {
  background(0);
  fill(0);
  rectMode(CENTER);
  rect(squareCenterX, squareCenterY, squareSize, squareSize);

  for (let agent of agents) {
    agent.orbit(squareCenterX, squareCenterY);
    agent.update();
    agent.draw();
  }
}
