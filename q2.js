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
    showLoadedTSP();
    setInterval(showNextCity, 1000);
  }
}

function loadTSP(filename) {
  loadStrings(filename, function(lines) {
    if (lines.length === 0) {
      console.error('Failed to load TSP file:', filename);
      return;
    }
    let i = lines.findIndex(line => line.includes('NODE_COORD_SECTION'));
    if (i === -1) {
      console.error('NODE_COORD_SECTION not found in', filename);
      return;
    }
    i++;

    for (; i < lines.length && !lines[i].includes('EOF'); i++) {
      let vals = lines[i].trim().split(/\s+/);
      if (vals.length === 3) {
        cities.push({id: int(vals[0]), x: float(vals[1]), y: float(vals[2])});
      }
    }

    problemName = filename.split('/').pop().split('.')[0];
    dataLoaded = true;
    if (solutionLoaded) setup();  // Call setup if both data and solution are loaded
  });
}

function loadSolution(filename) {
  loadStrings(filename, function(lines) {
    if (lines.length < 3) {
      console.error('Solution file is too short or corrupt:', filename);
      return;
    }
    solutionFilename = lines[0];
    tourLength = parseFloat(lines[1]);
    for (let i = 2; i < lines.length; i++) {
      tourOrder.push(parseInt(lines[i]));
    }

    solutionLoaded = true;
    if (dataLoaded) setup();  // Call setup if both data and solution are loaded
  });
}

function showLoadedTSP() {
  background(255);
  minX = Math.min(...cities.map(city => city.x));
  maxX = Math.max(...cities.map(city => city.x));
  minY = Math.min(...cities.map(city => city.y));
  maxY = Math.max(...cities.map(city => city.y));
  scaleFactor = min(width / (maxX - minX), height / (maxY - minY)) * 0.9;

  let offsetX = (width - (maxX - minX) * scaleFactor) / 2;
  let offsetY = (height - (maxY - minY) * scaleFactor) / 2;

  cities.forEach(city => {
    let x = (city.x - minX) * scaleFactor + offsetX;
    let y = (city.y - minY) * scaleFactor + offsetY;
    ellipse(x, y, 5, 5);
  });
}

function showNextCity() {
  if (currentCityIndex >= tourOrder.length) {
    currentCityIndex = 0;
    clear();
    showLoadedTSP();
  }

  let cityIndex = tourOrder[currentCityIndex] - 1;
  let city = cities[cityIndex];
  let x = (city.x - minX) * scaleFactor + offsetX;
  let y = (city.y - minY) * scaleFactor + offsetY;

  if (currentCityIndex > 0) {
    let prevCityIndex = tourOrder[currentCityIndex - 1] - 1;
    let prevCity = cities[prevCityIndex];
    let prevX = (prevCity.x - minX) * scaleFactor + offsetX;
    let prevY = (prevCity.y - minY) * scaleFactor + offsetY;
    stroke(255, 0, 0);
    strokeWeight(2);
    line(prevX, prevY, x, y);
  }

  currentCityIndex++;
}
