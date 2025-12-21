const COLS = 10;
const ROWS = 20;
const CELL = 30;
let board = [];
let pieceShapes = [];
let colors = [];
let current = null;
let dropTimer = 0;
let dropInterval = 30;
let score = 0;
let gameOver = false;
function createEmptyBoard() {
  let b = [];
  for (let y = 0; y < ROWS; y++) {
    let row = [];
    for (let x = 0; x < COLS; x++) {
      row.push(0);
    }
    b.push(row);
  }
  return b;
}
function deepCopyShape(s) {
  let out = [];
  for (let y = 0; y < 4; y++) {
    let row = [];
    for (let x = 0; x < 4; x++) {
      row.push(s[y][x]);
    }
    out.push(row);
  }
  return out;
}
function rotateMatrix(m) {
  let r = [];
  for (let y = 0; y < 4; y++) {
    let row = [];
    for (let x = 0; x < 4; x++) {
      row.push(0);
    }
    r.push(row);
  }
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      r[x][3 - y] = m[y][x];
    }
  }
  return r;
}
function collide(shape, px, py) {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (shape[y][x] === 1) {
        let bx = px + x;
        let by = py + y;
        if (bx < 0 || bx >= COLS) {
          return true;
        }
        if (by >= ROWS) {
          return true;
        }
        if (by >= 0) {
          if (board[by][bx] !== 0) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
function spawnPiece() {
  let idx = Math.floor(Math.random() * pieceShapes.length);
  let shape = deepCopyShape(pieceShapes[idx]);
  let px = Math.floor(COLS / 2) - 2;
  let py = 0;
  let col = idx + 1;
  current = { shape: shape, x: px, y: py, col: col };
  if (collide(current.shape, current.x, current.y)) {
    gameOver = true;
  }
}
function fixPiece() {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (current.shape[y][x] === 1) {
        let bx = current.x + x;
        let by = current.y + y;
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
          board[by][bx] = current.col;
        }
      }
    }
  }
  let linesCleared = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    let full = true;
    for (let x = 0; x < COLS; x++) {
      if (board[y][x] === 0) {
        full = false;
        break;
      }
    }
    if (full) {
      board.splice(y, 1);
      let newRow = [];
      for (let x = 0; x < COLS; x++) {
        newRow.push(0);
      }
      board.unshift(newRow);
      linesCleared++;
      y++;
    }
  }
  if (linesCleared > 0) {
    score += linesCleared * 100;
  }
}
function movePiece(dx) {
  if (current === null) {
    return;
  }
  let nx = current.x + dx;
  if (!collide(current.shape, nx, current.y)) {
    current.x = nx;
  }
}
function rotatePiece() {
  if (current === null) {
    return;
  }
  let newShape = rotateMatrix(current.shape);
  let kicks = [0, -1, 1, -2, 2];
  for (let i = 0; i < kicks.length; i++) {
    let ox = kicks[i];
    if (!collide(newShape, current.x + ox, current.y)) {
      current.shape = newShape;
      current.x += ox;
      return;
    }
  }
}
function tryDrop() {
  if (current === null) {
    return;
  }
  if (!collide(current.shape, current.x, current.y + 1)) {
    current.y += 1;
    return;
  } else {
    fixPiece();
    spawnPiece();
  }
}
function setupPiecesAndColors() {
  pieceShapes = [];
  pieceShapes.push([[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]]);
  pieceShapes.push([[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]);
  pieceShapes.push([[0,0,0,0],[1,1,1,0],[0,1,0,0],[0,0,0,0]]);
  pieceShapes.push([[0,0,0,0],[1,1,1,0],[1,0,0,0],[0,0,0,0]]);
  pieceShapes.push([[0,0,0,0],[1,1,1,0],[0,0,1,0],[0,0,0,0]]);
  pieceShapes.push([[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]]);
  pieceShapes.push([[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]]);
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
  createCanvas(COLS * CELL, ROWS * CELL);
  board = createEmptyBoard();
  setupPiecesAndColors();
  score = 0;
  gameOver = false;
  dropTimer = 0;
  spawnPiece();
  textSize(16);
  textAlign(LEFT, TOP);
  noStroke();
}
function draw() {
  background(30);
  fill(50);
  rect(0, 0, width, height);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      let v = board[y][x];
      if (v !== 0) {
        let c = colors[v];
        fill(c[0], c[1], c[2]);
        rect(x * CELL, y * CELL, CELL, CELL);
      } else {
        fill(40);
        rect(x * CELL, y * CELL, CELL, CELL);
      }
      stroke(20);
      strokeWeight(1);
      noFill();
      rect(x * CELL, y * CELL, CELL, CELL);
      noStroke();
    }
  }
  if (current !== null) {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (current.shape[y][x] === 1) {
          let bx = current.x + x;
          let by = current.y + y;
          if (by >= 0) {
            let c = colors[current.col];
            fill(c[0], c[1], c[2]);
            rect(bx * CELL, by * CELL, CELL, CELL);
            noStroke();
            stroke(20);
            strokeWeight(1);
            noFill();
            rect(bx * CELL, by * CELL, CELL, CELL);
            noStroke();
          }
        }
      }
    }
  }
  fill(255);
  text("Score: " + score, 5, 5);
  if (!gameOver) {
    dropTimer++;
    let interval = dropInterval;
    if (keyIsDown(DOWN_ARROW)) {
      interval = 2;
    }
    if (dropTimer >= interval) {
      dropTimer = 0;
      tryDrop();
    }
  } else {
    fill(255, 50, 50);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("GAME OVER", width / 2, height / 2 - 20);
    textSize(16);
    text("Score: " + score, width / 2, height / 2 + 20);
    textAlign(LEFT, TOP);
    textSize(16);
  }
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    movePiece(-1);
  } else if (keyCode === RIGHT_ARROW) {
    movePiece(1);
  } else if (keyCode === UP_ARROW) {
    rotatePiece();
  } else if (keyCode === DOWN_ARROW) {
    tryDrop();
  }
}
