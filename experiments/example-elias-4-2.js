let squareSize = 100; // Size of the square (100x100 pixels)
let squareCenterY; // Y-coordinate of the square's center
let squareCenterX; // X-coordinate of the square's center

let numAgents = 15; // Number of agents
let soundCooldown = 5; // Cooldown for sound

let agents = []; // Array to store all the agents
let soundCooldownCounter = 0; // Counter to manage sound cooldown

// Agent class representing objects that can move, follow a direction, and interact with borders.
class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.lastPosition = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.hasCollided = false;

    // Randomly select a shape type for each agent
    this.shapeType = Math.floor(Math.random() * 5); // 0 = circle, 1 = square, 2 = triangle
    this.size = Math.random() * 10 + 5; // Random size between 5 and 20
    this.color = color(
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    ); // Random color with transparency
  }

  // Apply a force to the agent, adding it to the current acceleration
  applyForce(force) {
    this.acceleration.add(force); // Adjust the agent's acceleration by the force vector
  }

  // Simulate gravitational pull towards the square
  gravitationalPull(squareCenterX, squareCenterY) {
    let force = createVector(squareCenterX, squareCenterY); // Vector pointing to the square's center
    force.sub(this.position); // Get the vector from the agent to the square

    let distance = force.mag(); // Calculate the distance between agent and square
    distance = constrain(distance, 5, 100); // Limit distance to a range (5 to 100) to avoid extreme forces

    let strength = (this.maxSpeed * 100) / (distance * distance); // Gravitational force decreases with distance
    force.setMag(strength); // Set the magnitude of the force based on the strength

    this.applyForce(force); // Apply the calculated force to the agent
  }

  // Update the agent's position and velocity based on applied forces
  update() {
    this.lastPosition = this.position.copy(); // Store the current position as the last position
    this.velocity.add(this.acceleration); // Update the velocity based on the current acceleration
    this.velocity.limit(this.maxSpeed); // Limit the velocity to the agent's max speed
    this.position.add(this.velocity); // Update the position based on the velocity
    this.acceleration.mult(0); // Reset acceleration for the next frame
  }

  // Check if the agent goes off screen and wrap around to the other side
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

  // Check if the agent has collided with the square
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

  // Draw the agent
  draw() {
    push(); // Save the current drawing state

    // Draw the trail (optional)
    stroke(0, 0, 0, 40); // Faint black trail
    strokeWeight(2);
    line(
      this.lastPosition.x,
      this.lastPosition.y,
      this.position.x,
      this.position.y
    );

    noStroke(); // No outline for the shapes
    fill(this.color); // Set the random color for the shape

    // Draw a random shape based on shapeType
    switch (this.shapeType) {
      case 0:
        ellipse(this.position.x, this.position.y, this.size, this.size); // Draw a circle
        break;
      case 1:
        rectMode(CENTER);
        rect(this.position.x, this.position.y, this.size, this.size); // Draw a square
        break;
      case 2:
        let halfSize = this.size / 2;
        triangle(
          this.position.x, this.position.y - halfSize, // Top vertex
          this.position.x - halfSize, this.position.y + halfSize, // Bottom-left vertex
          this.position.x + halfSize, this.position.y + halfSize // Bottom-right vertex
        ); // Draw a triangle
        break;
      default:
        ellipse(this.position.x, this.position.y, this.size, this.size); // Fallback, draw a circle
    }

    pop(); // Restore the original drawing state
  }
}

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

  // Draw the square
  fill(0); // Set the fill color to black for the square
  rectMode(CENTER); // Set rectangle mode to center, so it draws from the center
  rect(squareCenterX, squareCenterY, squareSize, squareSize); // Draw the square

  // Loop through all the agents
  for (let agent of agents) {
    agent.gravitationalPull(squareCenterX, squareCenterY); // Apply gravitational pull towards the square
    agent.checkSquareCollision(squareCenterX, squareCenterY, squareSize); // Check if the agent collides with the square
    agent.update(); // Update the agent's position
    agent.checkBorders(); // Check if the agent has gone off-screen
    agent.draw(); // Draw the agent's trail
  }

  // Reduce cooldown counter every frame
  if (soundCooldownCounter > 0) {
    soundCooldownCounter--; // Reduce cooldown every frame
  }
}

// Function to play a sound on collision
function playCollisionSound() {
  if (soundCooldownCounter === 0) {
    // Check if sound can be played (no active cooldown)
    if (!Tone.context.state.startsWith("running")) {
      Tone.context.resume(); // Resume audio context to enable sound
    }

    const synth = new Tone.FMSynth().toDestination(); // Create a new synthesizer
    const randomNote = ["E1", "G2", "A1", "B2"][Math.floor(Math.random() * 4)]; // Select a random note from this array
    synth.triggerAttackRelease(randomNote, "8n"); // Play the selected note for a short duration

    soundCooldownCounter = soundCooldown; // Reset the cooldown timer
  }
}
