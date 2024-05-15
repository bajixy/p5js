
let tileSize = 50; // Size of each tile
let carSize = 20; // Size of the car
let trackData; // Array to store track data
let car; // Car sprite
let carImage;
 
function preload() {
  trackData = loadStrings('track.txt'); // Load track data from file
  carImage = loadImage('img/car.png');
  
}
 
function setup() {
  let canvasWidth = trackData[0].length * tileSize;
  let canvasHeight = trackData.length * tileSize;
  createCanvas(canvasWidth, canvasHeight);
 
  spawnCar(); // Spawn car on start/finish line
}
 
function draw() {
  drawTrack(); // Draw track based on track data
  // Handle car movement
  handleInput();
  // Reset car position if it leaves the track
}
 
function drawTrack() {
  for (let y = 0; y < trackData.length; y++) {
    let rowData = trackData[y].split(' '); // Split each row by space
    for (let x = 0; x < rowData.length; x++) {
      let tileType = int(rowData[x]); // Convert each tile to integer
      let xPos = x * tileSize;
      let yPos = y * tileSize;
      // Draw tile based on tileType
      if (tileType === 0) {
        // Grass tile
        fill(0, 255, 0);
      } else if (tileType === 1) {
        // Track tile
        fill(100);
      } else if (tileType === 2) {
        // Start/Finish line tile
        fill(255, 0, 0);
      }
      rect(xPos, yPos, tileSize, tileSize);
    }
  }
}
 
function spawnCar() {
  // Find start/finish line position
  for (let y = 0; y < trackData.length; y++) {
    let rowData = trackData[y].split(' '); // Split each row by space
    for (let x = 0; x < rowData.length; x++) {
      if (int(rowData[x]) === 2) {
        let xPos = x * tileSize + tileSize / 2;
        let yPos = y * tileSize + tileSize / 2;
        // Spawn car at start/finish line
        car = createSprite(xPos, yPos);
        car.addImage(carImage); // Assign car image to the sprite
        car.scale = carSize / car.width; // Scale car sprite to fit tile size
        car.rotation = 270; // Set initial rotation to point north
        return;
      }
    }
  }
}
 
function handleInput() {
  // Car controls
  let angle = car.rotation; // Get current rotation angle
 
  // Calculate velocity components based on car's angle
  let acceleration = 0.1; // Adjust this value to control the acceleration
  let deceleration = 0.1; // Adjust this value to control the deceleration
  let maxSpeed = 1; // Adjust this value to control the maximum speed
 
  // Apply friction to the car's velocity
  let friction = 0.02; // Adjust this value to control the friction
  car.velocity.x -= car.velocity.x * friction;
  car.velocity.y -= car.velocity.y * friction;
   
  if (keyIsDown(UP_ARROW)) {
    // Accelerate the car forward in the direction it's facing
    car.velocity.x += cos(angle) * acceleration;
    car.velocity.y += sin(angle) * acceleration;
 
    // Limit car speed
    let currentSpeed = car.velocity.mag();
    if (currentSpeed > maxSpeed) {
      car.velocity.setMag(maxSpeed);
    }
  } else if (keyIsDown(DOWN_ARROW)) {
    // Apply deceleration
    car.velocity.x -= car.velocity.x * deceleration;
    car.velocity.y -= car.velocity.y * deceleration;
    }
   
  if (keyIsDown(LEFT_ARROW)) {
    car.rotation -= 2; // Turn left
  } else if (keyIsDown(RIGHT_ARROW)) {
    car.rotation += 2; // Turn right
  }
 
  function carCorners(carSprite) {
    let corners = [];
    let angle = carSprite.rotation;
    let cosA = cos(angle);
    let sinA = sin(angle);
    let offsetX = (carSprite.width / 2) * cosA;
    let offsetY = (carSprite.height / 2) * sinA;
    let pX = carSprite.position.x;
    let pY = carSprite.position.y;
   
    // Calculate corner positions relative to car's center
    let cornerOffsets = [
      { x: -offsetX, y: -offsetY },
      { x: offsetX, y: -offsetY },
      { x: -offsetX, y: offsetY },
      { x: offsetX, y: offsetY }
    ];
   
    // Rotate corners around car's center
    for (let i = 0; i < cornerOffsets.length; i++) {
      let rotatedX = cornerOffsets[i].x * cosA - cornerOffsets[i].y * sinA;
      let rotatedY = cornerOffsets[i].x * sinA + cornerOffsets[i].y * cosA;
      corners.push({ x: pX + rotatedX, y: pY + rotatedY });
    }
   
    return corners;
  }
 
  // Check collision with grass (tile type 0)
  let corners = carCorners(car);
  let collided = false;
  for (let i = 0; i < corners.length; i++) {
    let corner = corners[i];
    let tileX = floor(corner.x / tileSize);
    let tileY = floor(corner.y / tileSize);
    if (tileX >= 0 && tileX < trackData[0].length && tileY >= 0 && tileY < trackData.length) {
      let tileType = int(trackData[tileY].split(' ')[tileX]);
      if (tileType === 0) {
        collided = true;
        break;
      }
    }
  }
 
  if (collided) {
    // Remove the car before respawning
    car.remove();
    // Respawn car at start/finish line
    spawnCar();
  }
}