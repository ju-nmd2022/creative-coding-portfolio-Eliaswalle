class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    // Initialize the agent's position as a vector (x, y)
    this.position = createVector(x, y);
    // Store the last position of the agent for drawing purposes
    this.lastPosition = createVector(x, y);
    // Initialize the acceleration vector with (0, 0)
    this.acceleration = createVector(0, 0);
    // Initialize the velocity vector with (0, 0)
    this.velocity = createVector(0, 0);
    // Set the maximum speed the agent can reach
    this.maxSpeed = maxSpeed;
    // Set the maximum force the agent can apply to itself
    this.maxForce = maxForce;
  }

  follow(desiredDirection) {
    // Create a copy of the desired direction vector to avoid altering the original
    desiredDirection = desiredDirection.copy();
    // Scale the desired direction to the maximum speed
    desiredDirection.mult(this.maxSpeed);
    // Calculate the steering force as the difference between desired direction and current velocity
    let steer = p5.Vector.sub(desiredDirection, this.velocity);
    // Limit the steering force to the maximum force
    steer.limit(this.maxForce);
    // Apply the steering force to the agent
    this.applyForce(steer);
  }

  applyForce(force) {
    // Add the given force to the agent's acceleration
    this.acceleration.add(force);
  }

  update() {
    // Update the last position to the current position before moving
    this.lastPosition = this.position.copy();

    // Update velocity based on current acceleration
    this.velocity.add(this.acceleration);
    // Limit the velocity to the maximum speed
    this.velocity.limit(this.maxSpeed);
    // Update the position based on the velocity
    this.position.add(this.velocity);
    // Reset the acceleration to 0 (clear forces for the next frame)
    this.acceleration.mult(0);
  }

  checkBorders() {
    // Check if the agent has moved off the screen horizontally
    if (this.position.x < 0) {
      // If off the left side, move to the right side of the screen
      this.position.x = innerWidth;
      this.lastPosition.x = innerWidth;
    } else if (this.position.x > innerWidth) {
      // If off the right side, move to the left side of the screen
      this.position.x = 0;
      this.lastPosition.x = 0;
    }
    // Check if the agent has moved off the screen vertically
    if (this.position.y < 0) {
      // If off the top side, move to the bottom side of the screen
      this.position.y = innerHeight;
      this.lastPosition.y = innerHeight;
    } else if (this.position.y > innerHeight) {
      // If off the bottom side, move to the top side of the screen
      this.position.y = 0;
      this.lastPosition.y = 0;
    }
  }

  draw() {
    // Prepare to draw without affecting other drawing styles
    push();
    // Set stroke color to black with 20 alpha (transparent)
    stroke(0, 0, 0, 20);
    // Set stroke weight to 1 pixel
    strokeWeight(1);
    // Draw a line from the last position to the current position
    line(
      this.lastPosition.x,
      this.lastPosition.y,
      this.position.x,
      this.position.y
    );
    // Restore original drawing styles
    pop();
  }
}

function setup() {
  // Create a canvas that covers the full window
  createCanvas(innerWidth, innerHeight);
  // Set the background color to white
  background(255, 255, 255);
  // Generate a vector field for the agents to follow
  field = generateField();
  // Create the agents
  generateAgents();
}

function generateField() {
  let field = [];
  // Set a random seed for noise function to get different results each time
  noiseSeed(Math.random() * 100);
  // Loop through columns
  for (let x = 0; x < maxCols; x++) {
    // Initialize a new column in the field
    field.push([]);
    // Loop through rows
    for (let y = 0; y < maxRows; y++) {
      // Generate a noise value based on the current position
      const value = noise(x / divider, y / divider) * Math.PI * 2;
      // Create a vector from the noise value as an angle
      field[x].push(p5.Vector.fromAngle(value));
    }
  }
  // Return the generated field
  return field;
}

function generateAgents() {
  // Create 200 agents
  for (let i = 0; i < 200; i++) {
    let agent = new Agent(
      Math.random() * innerWidth,  // Random x position
      Math.random() * innerHeight, // Random y position
      4,                           // Maximum speed
      0.1                          // Maximum force
    );
    // Add the agent to the agents array
    agents.push(agent);
  }
}

// Size of each cell in the vector field
const fieldSize = 50;
// Number of columns in the field
const maxCols = Math.ceil(innerWidth / fieldSize);
// Number of rows in the field
const maxRows = Math.ceil(innerHeight / fieldSize);
// Controls the granularity of the noise function
const divider = 4;
let field;  // Will hold the vector field
let agents = [];  // Array to hold all agents

function draw() {
  // Loop through each agent
  for (let agent of agents) {
    // Determine the agent's position in the vector field grid
    const x = Math.floor(agent.position.x / fieldSize);
    const y = Math.floor(agent.position.y / fieldSize);
    // Get the desired direction from the vector field at the agent's position
    const desiredDirection = field[x][y];
    // Make the agent follow the desired direction
    agent.follow(desiredDirection);
    // Update the agent's position and velocity
    agent.update();
    // Check if the agent needs to wrap around the screen borders
    agent.checkBorders();
    // Draw the agent's path
    agent.draw();
  }
}
