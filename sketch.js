const SIZE = 4;
const CELL = 100;
let grid;
let score = 0;
let gameOver = false;
function initGrid() {
  grid = [];
  for (let r = 0; r < SIZE; r++) {
    let row = [];
    for (let c = 0; c < SIZE; c++) {
      row.push(0);
    }
    grid.push(row);
  }
  addRandomTile();
  addRandomTile();
  score = 0;
  gameOver = false;
}
function addRandomTile() {
  let empties = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) {
        empties.push({ r: r, c: c });
      }
    }
  }
  if (empties.length === 0) {
    return;
  }
  let idx = Math.floor(Math.random() * empties.length);
  let cell = empties[idx];
  grid[cell.r][cell.c] = 2;
}
function copyGrid(src) {
  let out = [];
  for (let r = 0; r < SIZE; r++) {
    let row = [];
    for (let c = 0; c < SIZE; c++) {
      row.push(src[r][c]);
    }
    out.push(row);
  }
  return out;
}
function rowsEqual(a, b) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) {
        return false;
      }
    }
  }
  return true;
}
function moveLeft() {
  let moved = false;
  for (let r = 0; r < SIZE; r++) {
    let arr = [];
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] !== 0) {
        arr.push(grid[r][c]);
      }
    }
    let newRow = [];
    let i = 0;
    while (i < arr.length) {
      if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
        let merged = arr[i] * 2;
        newRow.push(merged);
        score += merged;
        i += 2;
      } else {
        newRow.push(arr[i]);
        i += 1;
      }
    }
    while (newRow.length < SIZE) {
      newRow.push(0);
    }
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] !== newRow[c]) {
        moved = true;
      }
      grid[r][c] = newRow[c];
    }
  }
  return moved;
}
function moveRight() {
  let moved = false;
  for (let r = 0; r < SIZE; r++) {
    let arr = [];
    for (let c = SIZE - 1; c >= 0; c--) {
      if (grid[r][c] !== 0) {
        arr.push(grid[r][c]);
      }
    }
    let newRow = [];
    let i = 0;
    while (i < arr.length) {
      if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
        let merged = arr[i] * 2;
        newRow.push(merged);
        score += merged;
        i += 2;
      } else {
        newRow.push(arr[i]);
        i += 1;
      }
    }
    while (newRow.length < SIZE) {
      newRow.push(0);
    }
    for (let c = 0; c < SIZE; c++) {
      let val = newRow[SIZE - 1 - c];
      if (grid[r][c] !== val) {
        moved = true;
      }
      grid[r][c] = val;
    }
  }
  return moved;
}
function moveUp() {
  let moved = false;
  for (let c = 0; c < SIZE; c++) {
    let arr = [];
    for (let r = 0; r < SIZE; r++) {
      if (grid[r][c] !== 0) {
        arr.push(grid[r][c]);
      }
    }
    let newCol = [];
    let i = 0;
    while (i < arr.length) {
      if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
        let merged = arr[i] * 2;
        newCol.push(merged);
        score += merged;
        i += 2;
      } else {
        newCol.push(arr[i]);
        i += 1;
      }
    }
    while (newCol.length < SIZE) {
      newCol.push(0);
    }
    for (let r = 0; r < SIZE; r++) {
      if (grid[r][c] !== newCol[r]) {
        moved = true;
      }
      grid[r][c] = newCol[r];
    }
  }
  return moved;
}
function moveDown() {
  let moved = false;
  for (let c = 0; c < SIZE; c++) {
    let arr = [];
    for (let r = SIZE - 1; r >= 0; r--) {
      if (grid[r][c] !== 0) {
        arr.push(grid[r][c]);
      }
    }
    let newCol = [];
    let i = 0;
    while (i < arr.length) {
      if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
        let merged = arr[i] * 2;
        newCol.push(merged);
        score += merged;
        i += 2;
      } else {
        newCol.push(arr[i]);
        i += 1;
      }
    }
    while (newCol.length < SIZE) {
      newCol.push(0);
    }
    for (let r = 0; r < SIZE; r++) {
      let val = newCol[SIZE - 1 - r];
      if (grid[r][c] !== val) {
        moved = true;
      }
      grid[r][c] = val;
    }
  }
  return moved;
}
function canMove() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) {
        return true;
      }
      if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) {
        return true;
      }
      if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) {
        return true;
      }
    }
  }
  return false;
}
function setup() {
  createCanvas(CELL * SIZE, CELL * SIZE);
  initGrid();
  textAlign(CENTER, CENTER);
  rectMode(CORNER);
  noStroke();
}
function draw() {
  background(187, 173, 160);
  drawGrid();
  drawTiles();
  drawScore();
  if (gameOver) {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    fill(255);
    textSize(32);
    text(
