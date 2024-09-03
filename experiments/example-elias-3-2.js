class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.lastPosition = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
  }

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

  checkBorders() {
    const squareSize = 300;
    const squareX = (innerWidth - squareSize) / 2;
    const squareY = (innerHeight - squareSize) / 2;

    // Calculate the distance to the square's edges
    const dx = Math.max(
      squareX - this.position.x,
      0,
      this.position.x - (squareX + squareSize)
    );
    const dy = Math.max(
      squareY - this.position.y,
      0,
      this.position.y - (squareY + squareSize)
    );

    // If the agent is close to the square, apply a repulsive force
    if (dx == 0 && dy == 0) {
      // Inside the square, bounce back
      this.velocity.mult(-1);
      this.position.add(this.velocity);
    } else {
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        // Change this threshold to adjust the repulsive range
        let repulsion = p5.Vector.sub(
          this.position,
          createVector(squareX + squareSize / 2, squareY + squareSize / 2)
        );
        repulsion.setMag(this.maxForce);
        this.applyForce(repulsion);
      }
    }

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

  draw() {
    // Prevent drawing inside the square
    const squareSize = 300;
    const squareX = (innerWidth - squareSize) / 2;
    const squareY = (innerHeight - squareSize) / 2;

    if (
      this.position.x < squareX ||
      this.position.x > squareX + squareSize ||
      this.position.y < squareY ||
      this.position.y > squareY + squareSize
    ) {
      push();
      stroke(0, 0, 0, 100);

      let randomWeight = random(1);
      console.log(randomWeight);

      strokeWeight(randomWeight);

      line(
        this.lastPosition.x,
        this.lastPosition.y,
        this.position.x,
        this.position.y
      );
      pop();
    }
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
  for (let i = 0; i < 200; i++) {
    let agent = new Agent(
      Math.random() * innerWidth,
      Math.random() * innerHeight,
      4,
      0.1
    );
    agents.push(agent);
  }
}

// Add the drawSquare function here
function drawSquare() {
  const squareSize = 270;
  const squareX = (innerWidth - squareSize) / 2;
  const squareY = (innerHeight - squareSize) / 2;

  // Set the square color
  fill(0, 0, 0, 150); // Purple color with some transparency
  noStroke(); // Remove border/stroke from the square

  // Draw the square
  rect(squareX, squareY, squareSize, squareSize);
}

const fieldSize = 100;
const maxCols = Math.ceil(innerWidth / fieldSize);
const maxRows = Math.ceil(innerHeight / fieldSize);
const divider = 4;
let field;
let agents = [];

function draw() {
  // Draw the square first
  drawSquare();

  for (let agent of agents) {
    const x = Math.floor(agent.position.x / fieldSize);
    const y = Math.floor(agent.position.y / fieldSize);
    const desiredDirection = field[x][y];
    agent.follow(desiredDirection);
    agent.update();
    agent.checkBorders();
    agent.draw();
  }
}
