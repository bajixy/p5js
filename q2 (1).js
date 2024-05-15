let cities = [];
let tourOrder = [];
let problemName, solutionFilename, tourLength;
let minX, maxX, minY, maxY, scaleFactor;
let currentCityIndex = 0;
let dataLoaded = false, solutionLoaded = false;

function preload() {
  loadTSP('tsp/berlin52.tsp');
  loadSolution('sol/berlin52.sol');
}

function setup() {
  if (dataLoaded && solutionLoaded) {
    createCanvas(600, 600);
    frameRate(60);
    displayTSP();
    setInterval(cycleThroughCities, 1000);
  }
}

function loadTSP(filename) {
  loadStrings(filename, lines => {
    if (lines.length === 0) {
      console.error(`Failed to load TSP file: ${filename}`);
      return;
    }

    let nodeSectionIndex = lines.findIndex(line => line.includes('NODE_COORD_SECTION'));
    if (nodeSectionIndex === -1) {
      console.error('NODE_COORD_SECTION not found in', filename);
      return;
    }

    processCities(lines.slice(nodeSectionIndex + 1));
  });
}

function processCities(cityLines) {
  for (const line of cityLines) {
    if (line.includes('EOF')) break;
    const [id, x, y] = line.trim().split(/\s+/).map(Number);
    cities.push({ id, x, y });
  }
  problemName = filename.split('/').pop().split('.')[0];
  dataLoaded = true;
  if (solutionLoaded) setup();
}

function loadSolution(filename) {
  loadStrings(filename, lines => {
    if (lines.length < 3) {
      console.error(`Solution file is too short or corrupt: ${filename}`);
      return;
    }

    [solutionFilename, tourLength] = [lines[0], parseFloat(lines[1])];
    tourOrder = lines.slice(2).map(Number);

    solutionLoaded = true;
    if (dataLoaded) setup();
  });
}

function displayTSP() {
  background(255);
  setScaleAndOffset();
  drawCities();
}

function setScaleAndOffset() {
  minX = Math.min(...cities.map(city => city.x));
  maxX = Math.max(...cities.map(city => city.x));
  minY = Math.min(...cities.map(city => city.y));
  maxY = Math.max(...cities.map(city => city.y));
  scaleFactor = Math.min(width / (maxX - minX), height / (maxY - minY)) * 0.9;
}

function drawCities() {
  const offsetX = (width - (maxX - minX) * scaleFactor) / 2;
  const offsetY = (height - (maxY - minY) * scaleFactor) / 2;

  cities.forEach(city => {
    const x = (city.x - minX) * scaleFactor + offsetX;
    const y = (city.y - minY) * scaleFactor + offsetY;
    ellipse(x, y, 5, 5);
  });
}

function cycleThroughCities() {
  if (currentCityIndex >= tourOrder.length) {
    resetTour();
  }
  showCurrentCity();
  currentCityIndex++;
}

function resetTour() {
  currentCityIndex = 0;
  clear();
  displayTSP();
}

function showCurrentCity() {
  const cityIndex = tourOrder[currentCityIndex] - 1;
  const { x, y } = getPosition(cities[cityIndex]);

  if (currentCityIndex > 0) {
    const { x: prevX, y: prevY } = getPosition(cities[tourOrder[currentCityIndex - 1] - 1]);
    drawLineBetweenCities(prevX, prevY, x, y);
  }
}

function getPosition(city) {
  return {
    x: (city.x - minX) * scaleFactor + offsetX,
    y: (city.y - minY) * scaleFactor + offsetY
  };
}

function drawLineBetweenCities(prevX, prevY, x, y) {
  stroke(255, 0, 0);
  strokeWeight(2);
  line(prevX, prevY, x, y);
}
