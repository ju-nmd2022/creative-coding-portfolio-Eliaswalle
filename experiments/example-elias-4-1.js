let squareSize = 100; // Size of the square (100x100 pixels)
let squareCenterY; // Variable to store the Y-coordinate of the square's center
let squareCenterX; // Variable to store the X-coordinate of the square's center

let numAgents = 20; // Number of agents, reduced to improve performance
let soundCooldown = 5; // Cooldown for sound, so it doesn't trigger too frequently

// The Agent class represents an object that can move, follow a direction, and interact with borders.
class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y); // Agent's current position
    this.lastPosition = createVector(x, y); // Previous position, for drawing trails
    this.acceleration = createVector(0, 0); // Initial acceleration (no movement initially)
    this.velocity = createVector(0, 0); // Initial velocity (agent starts at rest)
    this.maxSpeed = maxSpeed; // Maximum speed the agent can move
    this.maxForce = maxForce; // Maximum force that can be applied to the agent
    this.hasCollided = false; // Flag to track if the agent has collided with the square
  }

  // Method to apply a force to the agent, adding it to the current acceleration
  applyForce(force) {
    this.acceleration.add(force); // Adjust the agent's acceleration by the force vector
  }

  // Method to simulate gravitational pull towards the square
  gravitationalPull(squareCenterX, squareCenterY) {
    let force = createVector(squareCenterX, squareCenterY); // Vector pointing to the square's center
    force.sub(this.position); // Get the vector from the agent to the square

    let distance = force.mag(); // Calculate the distance between agent and square
    distance = constrain(distance, 5, 100); // Limit distance to a range (5 to 100) to avoid extreme forces

    let strength = (this.maxSpeed * 100) / (distance * distance); // Gravitational force decreases with distance
    force.setMag(strength); // Set the magnitude of the force based on the strength

    this.applyForce(force); // Apply the calculated force to the agent
  }

  // Method to update the agent's position and velocity based on applied forces
  update() {
    this.lastPosition = this.position.copy(); // Store the current position as the last position
    this.velocity.add(this.acceleration); // Update the velocity based on the current acceleration
    this.velocity.limit(this.maxSpeed); // Limit the velocity to the agent's max speed
    this.position.add(this.velocity); // Update the position based on the velocity
    this.acceleration.mult(0); // Reset acceleration for the next frame
  }

  // Method to check if the agent goes off screen and wrap around to the other side
  checkBorders() {
    if (this.position.x < 0) {
      // If the agent goes past the left edge
      this.position.x = innerWidth; // Move it to the right edge
      this.lastPosition.x = innerWidth; // Sync last position
    } else if (this.position.x > innerWidth) {
      // If it goes past the right edge
      this.position.x = 0; // Move it to the left edge
      this.lastPosition.x = 0; // Sync last position
    }
    if (this.position.y < 0) {
      // If the agent goes past the top edge
      this.position.y = innerHeight; // Move it to the bottom edge
      this.lastPosition.y = innerHeight; // Sync last position
    } else if (this.position.y > innerHeight) {
      // If it goes past the bottom edge
      this.position.y = 0; // Move it to the top edge
      this.lastPosition.y = 0; // Sync last position
    }
  }

  // Method to check if the agent has collided with the square
  checkSquareCollision(squareCenterX, squareCenterY, squareSize) {
    const halfSize = squareSize / 2; // Half the size of the square, to make collision detection easier

    // Check if the agent is within the bounds of the square
    if (
      this.position.x > squareCenterX - halfSize &&
      this.position.x < squareCenterX + halfSize &&
      this.position.y > squareCenterY - halfSize &&
      this.position.y < squareCenterY + halfSize
    ) {
      if (!this.hasCollided) {
        // If the agent hasn't already collided
        // Determine which axis to invert velocity based on the agent's position relative to the square
        if (
          Math.abs(this.position.x - squareCenterX) >
          Math.abs(this.position.y - squareCenterY)
        ) {
          this.velocity.x *= -2; // Reverse horizontal direction
        } else {
          this.velocity.y *= -2; // Reverse vertical direction
        }

        playCollisionSound(); // Play collision sound
        this.hasCollided = true; // Mark that the agent has collided
      }
    } else {
      this.hasCollided = false; // Reset collision state when agent moves away from the square
    }
  }

  // Method to draw the agent
  draw() {
    push(); // Save the current drawing state
    stroke(0, 0, 0, 40); // Set a faint black color for the trail
    strokeWeight(2); // Set the thickness of the trail
    line(
      this.lastPosition.x,
      this.lastPosition.y,
      this.position.x,
      this.position.y
    ); // Draw a line from the agent's last position to its current position
    pop(); // Restore the original drawing state
  }
}

let agents = []; // Array to store all the agents
let soundCooldownCounter = 0; // Counter to manage sound cooldown

// Setup function runs once when the program starts
function setup() {
  createCanvas(windowWidth, windowHeight); // Create a canvas that spans the entire window
  background(255); // Set the background to white

  squareCenterY = height / 2; // Set the Y-coordinate of the square's center
  squareCenterX = width / 2; // Set the X-coordinate of the square's center

  generateAgents(); // Generate the agents on the canvas
}

// Function to create all the agents
function generateAgents() {
  for (let i = 0; i < numAgents; i++) {
    // Loop to create the specified number of agents
    let agent = new Agent(
      Math.random() * width, // Random starting X-coordinate
      Math.random() * height, // Random starting Y-coordinate
      4, // Maximum speed of the agent
      0.1 // Maximum force the agent can apply
    );
    agents.push(agent); // Add the agent to the agents array
  }
}

// Main draw loop, runs continuously
function draw() {
  background(255, 255, 255, 40); // Clear background with slight transparency, creating a fading effect

  fill(0); // Set the fill color to black for the square
  rectMode(CENTER); // Set rectangle mode to center, so it draws from the center
  rect(squareCenterX, squareCenterY, squareSize, squareSize); // Draw the square

  for (let agent of agents) {
    // Loop through all the agents
    agent.gravitationalPull(squareCenterX, squareCenterY); // Apply gravitational pull towards the square
    agent.checkSquareCollision(squareCenterX, squareCenterY, squareSize); // Check if the agent collides with the square
    agent.update(); // Update the agent's position
    agent.checkBorders(); // Check if the agent has gone off-screen
    agent.draw(); // Draw the agent's trail
  }

  if (soundCooldownCounter > 0) {
    // If the sound cooldown is active
    soundCooldownCounter--; // Reduce cooldown every frame
  }
}

// Function to play a sound on collision
function playCollisionSound() {
  if (soundCooldownCounter === 0) {
    // Check if sound can be played (no active cooldown)
    if (!Tone.context.state.startsWith("running")) {
      // If the audio context is blocked by the browser
      Tone.context.resume(); // Resume audio context to enable sound
    }

    const synth = new Tone.Synth().toDestination(); // Create a new synthesizer
    const randomNote = ["C4", "E4", "G4", "A4", "B4"][ // Select a random note from this array
      Math.floor(Math.random() * 5)
    ];
    synth.triggerAttackRelease(randomNote, "8n"); // Play the selected note for a short duration

    soundCooldownCounter = soundCooldown; // Reset the cooldown timer
  }
}
