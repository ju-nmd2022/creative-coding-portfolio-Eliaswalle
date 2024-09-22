squareSize = 100; // size of the square
squareCenterY = innerHeight / 2;
squareCenterX = innerWidth / 2;

class Agent { //class for the agents speed, position and so on.
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.lastPosition = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
  }
//the desired direction
  follow(desiredDirection) {
    desiredDirection = desiredDirection.copy();
    desiredDirection.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desiredDirection, this.velocity);
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
// check if there is a collision 
  checkBorders() {
    if (this.position.x < 0) {
      this.checkSquareCollision.x = innerWidth;
      this.checkSquareCollision.x = innerHeight;
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
      if (
        Math.abs(this.position.x - squareCenterX) >
        Math.abs(this.position.y - squareCenterY)
      ) {
        this.velocity.x *= -10;
      } else {
        this.velocity.y *= -10;
      }
    }
  }

  draw() {
    push();
    stroke(0, 0, 0, 40);
    strokeWeight(random(0, 2));
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
  field = generateField();
  generateAgents();
}

function generateField() {
  let field = [];
  noiseSeed(Math.random() * 100);
  for (let x = 0; x < maxCols; x++) {
    field.push([]);
    for (let y = 0; y < maxRows; y++) {
      const value = noise(x / divider, y / divider) * Math.PI * 2;
      field[x].push(p5.Vector.fromAngle(value));
    }
  }
  return field;
}

function generateAgents() {
  for (let i = 0; i < 1000; i++) {
    let agent = new Agent(
      Math.random() * innerWidth,
      Math.random() * innerHeight,
      4,
      0.1
    );
    agents.push(agent);
  }
}

const fieldSize = 100;
const maxCols = Math.ceil(innerWidth / fieldSize);
const maxRows = Math.ceil(innerHeight / fieldSize);
const divider = 4;
let field;
let agents = [];

function draw() {
  fill(0);
  rectMode(CENTER);
  rect(squareCenterX, squareCenterY, squareSize, squareSize);

  for (let agent of agents) {
    const x = Math.floor(agent.position.x / fieldSize);
    const y = Math.floor(agent.position.y / fieldSize);
    const desiredDirection = field[x][y];

    agent.checkSquareCollision(squareCenterX, squareCenterY, squareSize);
    agent.follow(desiredDirection);
    agent.update();
    agent.checkBorders();
    agent.draw();
  }
}
// Had help from chat to get a step by step on how to get the square function done