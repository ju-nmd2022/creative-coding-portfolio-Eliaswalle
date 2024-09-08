// The Agent class represents an object that can move, follow a direction, and interact with borders.
class Agent {
  // Constructor initializes the agent with position, velocity, and other properties.
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y); // Current position of the agent.
    this.lastPosition = createVector(x, y); // Position of the agent in the previous frame (used for drawing lines).
    this.acceleration = createVector(0, 0); // Acceleration, which affects the velocity.
    this.velocity = createVector(0, 0); // Current velocity of the agent.
    this.maxSpeed = maxSpeed; // Maximum speed the agent can reach.
    this.maxForce = maxForce; // Maximum steering force applied to change velocity.
  }

  // The follow method adjusts the agent's velocity to follow a desired direction.
  follow(desiredDirection) {
    desiredDirection = desiredDirection.copy(); // Copy the desired direction to avoid modifying the original vector.
    desiredDirection.mult(this.maxSpeed); // Scale the desired direction to match the maximum speed.
    let steer = p5.Vector.sub(desiredDirection, this.velocity); // Calculate the steering force needed to adjust the velocity.
    steer.limit(this.maxForce); // Limit the steering force to the maximum allowed force.
    this.applyForce(steer); // Apply the steering force to the agent's acceleration.
  }

  // The applyForce method adds the given force to the agent's acceleration.
  applyForce(force) {
    this.acceleration.add(force); // Add the force to the current acceleration.
  }

  // The update method updates the agent's position and velocity based on its acceleration.
  update() {
    this.lastPosition = this.position.copy(); // Save the current position as the last position (for drawing).

    this.velocity.add(this.acceleration); // Update velocity by adding acceleration.
    this.velocity.limit(this.maxSpeed); // Ensure the velocity does not exceed the maximum speed.
    this.position.add(this.velocity); // Update position by adding velocity.
    this.acceleration.mult(0); // Reset acceleration to 0 (forces are only applied within a single frame).
  }

  // The checkBorders method ensures the agent wraps around the screen borders.
  checkBorders() {
    if (this.position.x < 0) {
      // If the agent crosses the left border...
      this.position.x = innerWidth; // ...wrap it to the right side of the screen.
      this.lastPosition.x = innerWidth; // Update last position accordingly.
    } else if (this.position.x > innerWidth) {
      // If the agent crosses the right border...
      this.position.y = 0; // ...wrap it to the left side.
      this.lastPosition.y = 0; // Update last position accordingly.
    }
    if (this.position.y < 0) {
      // If the agent crosses the top border...
      this.position.y = innerHeight; // ...wrap it to the bottom.
      this.lastPosition.y = innerHeight; // Update last position accordingly.
    } else if (this.position.y > innerHeight) {
      // If the agent crosses the bottom border...
      this.position.y = 0; // ...wrap it to the top.
      this.lastPosition.y = 0; // Update last position accordingly.
    }
  }

  // The draw method draws the agent's path as a line from the last position to the current position.
  draw() {
    push(); // Save the current drawing style settings.
    stroke(0, 0, 0, 40); // Set the stroke color to black with some transparency.
    strokeWeight(1); // Set the stroke weight to 1 pixel.
    line(
      // Draw a line from the last position to the current position.
      this.lastPosition.x,
      this.lastPosition.y,
      this.position.x,
      this.position.x * 2
    );
    pop(); // Restore the previous drawing style settings.
  }
}

// The setup function initializes the canvas and creates agents and the flow field.
function setup() {
  createCanvas(innerWidth, innerHeight); // Create a canvas that fills the window.
  background(255, 255, 255); // Set the background color to white.
  field = generateField(); // Generate the flow field, which is a grid of directions.
  generateAgents(); // Generate the agents that will move around the canvas.
}

// The generateField function creates a grid of vectors representing the flow field directions.
function generateField() {
  let field = [];
  noiseSeed(Math.random() * 10); // Seed the Perlin noise function for randomness.
  for (let x = 0; x < maxCols; x++) {
    // Loop through columns of the grid.
    field.push([]); // Add a new row to the field.
    for (let y = 0; y < maxRows; y++) {
      // Loop through rows of the grid.
      const value = noise(x / divider, y / divider) * Math.PI * 2; // Generate an angle from Perlin noise.
      field[x].push(p5.Vector.fromAngle(value)); // Create a vector from the angle and add it to the grid.
    }
  }
  return field; // Return the generated flow field.
}

// The generateAgents function creates a number of agents at random positions on the canvas.
function generateAgents() {
  for (let i = 0; i < 10; i++) {
    // Create 10 agents.
    let agent = new Agent(
      Math.random() * innerWidth, // Random x position.
      Math.random() * innerHeight, // Random y position.
      2, // Maximum speed.
      0.1 // Maximum force.
    );
    agents.push(agent); // Add the agent to the list of agents.
  }
}

// Constants and variables for the field and agents.
const fieldSize = 50; // Size of each cell in the flow field grid.
const maxCols = Math.ceil(innerWidth / fieldSize); // Number of columns in the grid.
const maxRows = Math.ceil(innerHeight / fieldSize); // Number of rows in the grid.
const divider = 4; // Divider used to scale the noise function for the flow field.
let field; // Variable to hold the flow field.
let agents = []; // Array to hold all the agents.

// The draw function is called continuously to animate the agents.
function draw() {
  for (let agent of agents) {
    // Loop through each agent.
    const x = Math.floor(agent.position.x / fieldSize); // Determine the agent's current column in the field.
    const y = Math.floor(agent.position.y / fieldSize); // Determine the agent's current row in the field.
    const desiredDirection = field[x][y]; // Get the desired direction from the flow field.
    agent.follow(desiredDirection); // Make the agent follow the desired direction.
    agent.update(); // Update the agent's position and velocity.
    agent.checkBorders(); // Check if the agent has crossed the screen borders.
    agent.draw(); // Draw the agent's path on the canvas.
  }
}
