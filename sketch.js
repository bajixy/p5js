function setup() {
  createCanvas(600, 300);
  noLoop();
}

function draw() {
  background(255);

  const configs = [
    { bgColor: 'red', lineColor: 'blue', shape: 'circle', innerLineColor: 'yellow' },
    { bgColor: 'yellow', lineColor: 'red', shape: 'square', innerLineColor: 'blue' },
    { bgColor: 'blue', lineColor: 'yellow', shape: 'triangle', innerLineColor: 'red' },
    { bgColor: 'red', lineColor: 'yellow', shape: 'rectangle', innerLineColor: 'blue' },
    { bgColor: 'yellow', lineColor: 'blue', shape: 'trapezoid', innerLineColor: 'red' },
    { bgColor: 'blue', lineColor: 'red', shape: 'parallelogram', innerLineColor: 'yellow' }
  ];

  const partWidth = width / 3;
  const partHeight = height / 2;

  // Drawing the partitions with background and horizontal lines
  configs.forEach((config, i) => {
    const x = (i % 3) * partWidth;
    const y = Math.floor(i / 3) * partHeight;

    fill(config.bgColor);
    noStroke();
    rect(x, y, partWidth, partHeight);

    stroke(config.lineColor);
    strokeWeight(2); // Set the weight for horizontal lines
    for (let lineY = y + 5; lineY < y + partHeight; lineY += 10) {
      line(x, lineY, x + partWidth, lineY);
    }

    drawShapeWithLines(x, y, partWidth, partHeight, config);
  });
}

function drawShapeWithLines(x, y, w, h, config) {
  const centerX = x + w / 2;
  const centerY = y + h / 2;
  const size = min(w, h) / 4;

  fill(255);
  noStroke();

  // Define boundary variables
  let minY, maxY, minX, maxX;

  // Draw the shape and set vertical line constraints
  switch (config.shape) {
    case 'circle':
      ellipse(centerX, centerY, size * 2);
      minY = centerY - size;
      maxY = centerY + size;
      minX = centerX - size;
      maxX = centerX + size;
      break;
    case 'square':
      rect(centerX - size, centerY - size, size * 2, size * 2);
      minY = centerY - size;
      maxY = centerY + size;
      minX = centerX - size;
      maxX = centerX + size;
      break;
    case 'triangle':
      triangle(centerX - size, centerY + size, centerX, centerY - size, centerX + size, centerY + size);
      minY = centerY - size / 1.732; // Adjusted to match the height of an equilateral triangle
      maxY = centerY + size;
      minX = centerX - size;
      maxX = centerX + size;
      break;
    case 'rectangle':
      rect(centerX - size, centerY - size / 2, size * 2, size);
      minY = centerY - size / 2;
      maxY = centerY + size / 2;
      minX = centerX - size;
      maxX = centerX + size;
      break;
    case 'trapezoid':
      quad(centerX - size, centerY + size, centerX - size / 2, centerY - size, centerX + size / 2, centerY - size, centerX + size, centerY + size);
      minY = centerY - size;
      maxY = centerY + size;
      minX = centerX - size;
      maxX = centerX + size;
      break;
    case 'parallelogram':
      quad(centerX - size, centerY, centerX, centerY - size, centerX + size, centerY - size, centerX + size / 2, centerY);
      minY = centerY - size;
      maxY = centerY;
      minX = centerX - size;
      maxX = centerX + size / 2;
      break;
  }

  // Draw vertical lines within the shape
  stroke(config.innerLineColor);
  strokeWeight(2); // Ensure consistent line width for vertical lines within shapes
  for (let lineX = max(x, minX); lineX <= min(x + w, maxX); lineX += 5) {
    line(lineX, max(y, minY), lineX, min(y + h, maxY));
  }
}