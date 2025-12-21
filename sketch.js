let cols = 10;
let rows = 20;
let cell = 30;
let grid = [];
let pieces = [];
let colors = [];
let currentPiece = null;
let currentX = 0;
let currentY = 0;
let framesSinceLastDrop = 0;
let baseDropInterval = 30;
let score = 0;
let gameOver = false;
function createEmptyGrid() {
  let g = [];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
    }
    g.push(row);
  }
  return g;
}
function deepCopyShape(shape) {
  let s = [];
  for (let r = 0; r < 4; r++) {
    let row = [];
    for (let c = 0; c < 4; c++) {
      row.push(shape[r][c]);
    }
    s.push(row);
  }
  return s;
}
function rotateMatrix(shape) {
  let n = 4;
  let res = [];
  for (let r = 0; r < n; r++) {
    let row = [];
    for (let c = 0; c < n; c++) {
      row.push(0);
    }
    res.push(row);
  }
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      res[r][c] = shape[n - 1 - c][r];
    }
  }
  return res;
}
function collides(shape, x, y) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (shape[r][c] === 1) {
        let gx = x + c;
        let gy = y + r;
        if (gx < 0 || gx >= cols || gy >= rows) {
          return true;
        }
        if (gy >= 0) {
          if (grid[gy][gx] !== 0) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
function spawnPiece() {
  let idx = Math.floor(Math.random() * pieces.length);
  currentPiece = deepCopyShape(pieces[idx]);
  currentX = Math.floor((cols - 4) / 2);
  currentY = -1;
  let colorIndex = idx + 1;
  currentPiece.color = colorIndex;
  if (collides(currentPiece, currentX, currentY)) {
    gameOver = true;
  }
}
function lockPiece() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (currentPiece[r][c] === 1) {
        let gx = currentX + c;
        let gy = currentY + r;
        if (gy >= 0 && gy < rows && gx >= 0 && gx < cols) {
          grid[gy][gx] = currentPiece.color;
        }
      }
    }
  }
  clearLines();
  spawnPiece();
}
function clearLines() {
  for (let r = rows - 1; r >= 0; r--) {
    let full = true;
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0) {
        full = false;
        break;
      }
    }
    if (full) {
      grid.splice(r, 1);
      let newRow = [];
      for (let c = 0; c < cols; c++) {
        newRow.push(0);
      }
      grid.unshift(newRow);
      score += 100;
      r++;
    }
  }
}
function tryMove(dx, dy) {
  let nx = currentX + dx;
  let ny = currentY + dy;
  if (!collides(currentPiece, nx, ny)) {
    currentX = nx;
    currentY = ny;
    return true;
  }
  return false;
}
function drawGrid() {
  stroke(40);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let val = grid[r][c];
      if (val === 0) {
        fill(20);
      } else {
        let colArr = colors[val];
        fill(colArr[0], colArr[1], colArr[2]);
      }
      rect(c * cell, r * cell, cell, cell);
    }
  }
}
function drawPiece() {
  if (currentPiece === null) {
    return;
  }
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (currentPiece[r][c] === 1) {
        let gx = currentX + c;
        let gy = currentY + r;
        if (gy >= 0) {
          let colArr = colors[currentPiece.color];
          fill(colArr[0], colArr[1], colArr[2]);
          rect(gx * cell, gy * cell, cell, cell);
        }
      }
    }
  }
}
function setupPiecesAndColors() {
  pieces = [];
  pieces.push([
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  pieces.push([
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  pieces.push([
    [0,1,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  pieces.push([
    [0,0,1,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  pieces.push([
    [1,0,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  pieces.push([
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  pieces.push([
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  colors = [];
  colors.push([0,0,0]);
  colors.push([0,255,255]);
  colors.push([255,255,0]);
  colors.push([128,0,128]);
  colors.push([255,165,0]);
  colors.push([0,0,255]);
  colors.push([0,255,0]);
  colors.push([255,0,0]);
}
function setup() {
  createCanvas(cols * cell, rows * cell);
  setupPiecesAndColors();
  grid = createEmptyGrid();
  spawnPiece();
  textAlign(LEFT, TOP);
  textSize(16);
  noStroke();
}
function draw() {
  background(10);
  if (!gameOver) {
    let dropInterval = baseDropInterval;
    if (keyIsDown(DOWN_ARROW)) {
      dropInterval = 2;
    }
    framesSinceLastDrop++;
    if (framesSinceLastDrop >= dropInterval) {
      framesSinceLastDrop = 0;
      if (!tryMove(0,1)) {
        lockPiece();
        if (gameOver) {
          framesSinceLastDrop = 0;
        }
      }
    }
  }
  stroke(40);
  drawGrid();
  drawPiece();
  fill(255);
  text("Score: " + score, 5, 5);
  if (gameOver) {
    fill(200, 50, 50);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
  }
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    tryMove(-1,0);
  } else if (keyCode === RIGHT_ARROW) {
    tryMove(1,0);
  } else if (keyCode === DOWN_ARROW) {
    tryMove(0,1);
  } else if (keyCode === UP_ARROW) {
    let rotated = rotateMatrix(currentPiece);
    let prev = currentPiece;
    currentPiece = rotated;
    if (collides(currentPiece, currentX, currentY)) {
      currentPiece = prev;
    }
  }
}
