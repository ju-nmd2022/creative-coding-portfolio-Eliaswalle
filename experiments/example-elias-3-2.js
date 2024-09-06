let squareSize = 80; // Set the size of the square (width and height).
let squareCenterY = innerHeight / 2; // Calculate the Y-coordinate of the square's center (halfway down the window).
let squareCenterX = innerWidth / 2; // Calculate the X-coordinate of the square's center (halfway across the window).

// The Agent class represents an object that can move, follow a direction, and orbit around the square.
class Agent {
  // Constructor initializes the agent with position, velocity, and other properties.
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y); // Current position of the agent as a vector.
    this.lastPosition = createVector(x, y); // Save the agent's previous position (used for drawing a line).
    this.acceleration = createVector(0, 0); // Acceleration, which affects the velocity, starts at zero.
    this.velocity = createVector(0, 0); // Initial velocity of the agent (starts at zero).
    this.maxSpeed = maxSpeed; // Set the maximum speed for the agent.
    this.maxForce = maxForce; // Set the maximum force that can be applied to the agent to change its velocity.
    this.color = color(random(255), random(255), random(255), 100); // Assign a random color with some transparency to the agent.
  }

  // The orbit method adjusts the agent's velocity to make it orbit around the square.
  orbit(squareCenterX, squareCenterY) {
    let dir = p5.Vector.sub(createVector(squareCenterX, squareCenterY), this.position); // Get the direction vector from the agent to the square center.
    dir.normalize(); // Normalize the direction vector to make its length 1.

    // Create a perpendicular force to make the agent move in a circular orbit.
    let perpendicular = createVector(-dir.y, dir.x); // Perpendicular vector to the direction (for circular movement).
    
    perpendicular.mult(this.maxSpeed); // Scale the perpendicular vector by the maximum speed (control the speed of orbit).
    let steer = p5.Vector.sub(perpendicular, this.velocity); // Calculate the steering force needed to move towards the perpendicular direction.
    steer.limit(this.maxForce); // Limit the steering force to the maximum allowed force.
    this.applyForce(steer); // Apply the steering force to the agent's acceleration.
  }

  // The applyForce method adds the given force to the agent's acceleration.
  applyForce(force) {
    this.acceleration.add(force); // Add the provided force to the agent's current acceleration.
  }

  // The update method updates the agent's position and velocity based on the current acceleration.
  update() {
    this.lastPosition = this.position.copy(); // Save the current position to use when drawing the agent's trail.
    
    this.velocity.add(this.acceleration); // Update the velocity by adding the acceleration.
    this.velocity.limit(this.maxSpeed); // Ensure that the velocity does not exceed the maximum speed.
    this.position.add(this.velocity); // Update the position by adding the velocity.
    this.acceleration.mult(0); // Reset the acceleration to 0 after each frame.
  }

  // The draw method draws the agent's path as a line from the last position to the current position.
  draw() {
    push(); // Save the current drawing style (color, stroke, etc.).
    stroke(this.color); // Set the stroke color to the agent's color.
    strokeWeight(random(5)); // Set the stroke weight (thickness) to a random value.
    line(this.lastPosition.x, this.lastPosition.y, this.position.x, this.position.y); // Draw a line from the last position to the current position.
    pop(); // Restore the previous drawing style.
  }
}

// The setup function initializes the canvas and creates agents.
function setup() {
  createCanvas(innerWidth, innerHeight); // Create a canvas that fills the window.
  background(255, 255, 255); // Set the background color to white.
  generateAgents(); // Call the function to generate agents that will move around the canvas.
}

// The generateAgents function creates a number of agents at random positions on the canvas, ensuring they don't spawn inside the square.
function generateAgents() {
  for (let i = 0; i < 2000; i++) { // Loop 2000 times to create 2000 agents.
    let x, y; // Variables to store the random x and y positions.
    let halfSize = squareSize / 2; // Half of the square size, used to calculate boundaries.

    // Generate random positions until they are outside the square's boundaries.
    do {
      x = Math.random() * innerWidth; // Generate a random x position within the canvas width.
      y = Math.random() * innerHeight; // Generate a random y position within the canvas height.
    } while (
      x > squareCenterX - halfSize && x < squareCenterX + halfSize && // Ensure the x position is outside the square.
      y > squareCenterY - halfSize && y < squareCenterY + halfSize // Ensure the y position is outside the square.
    );

    let agent = new Agent(x, y, 4, 0.1); // Create a new agent at the random position with a max speed of 4 and max force of 0.1.
    agents.push(agent); // Add the newly created agent to the array of agents.
  }
}

let agents = []; // Initialize an empty array to hold all the agents.

function draw() {
  background(0); // Clear the canvas with a black background at the start of each frame.

  // Draw the square once per frame
  fill(0); // Set the fill color of the square to black.
  rectMode(CENTER); // Draw the square from its center.
  rect(squareCenterX, squareCenterY, squareSize, squareSize); // Draw the square at the calculated center with the specified size.

  // Loop through all agents
  for (let agent of agents) {
    agent.orbit(squareCenterX, squareCenterY); // Make each agent orbit around the square.
    agent.update(); // Update each agent's position based on its current velocity and acceleration.
    agent.draw(); // Draw each agent's trail as a line.
  }
}
