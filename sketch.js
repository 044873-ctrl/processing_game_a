const CANVAS_W = 400;
const CANVAS_H = 600;
const PADDLE_W = 90;
const PADDLE_H = 12;
const PADDLE_Y = CANVAS_H - 40;
const BALL_R = 6;
const ROWS = 12;
const COLS = 7;
const BLOCK_GAP = 6;
const BLOCK_MARGIN = 20;
const BLOCK_H = 18;
let blockW;
let blocks = [];
let particles = [];
let paddleX = CANVAS_W / 2;
let ballX;
let ballY;
let ballVX;
let ballVY;
let score = 0;
let gameOver = false;
let rowColors = [
  "#ff4d4d",
  "#ff944d",
  "#ffd24d",
  "#ffe36b",
  "#d6ff4d",
  "#8dff4d",
  "#4dff88",
  "#4dd2ff",
  "#4d88ff",
  "#7b4dff",
  
