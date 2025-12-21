let canvasWidth = 400;
let canvasHeight = 600;
let paddleWidth = 90;
let paddleHeight = 12;
let paddleX = 0;
let paddleY = 0;
let ball = {};
let blocks = [];
let particles = [];
let rows = 6;
let cols = 7;
let blockW = 52;
let blockH = 20;
let blockGap = 6;
let topOffset = 60;
let score = 0;
let gameOver = false;
let rowColors = [];
let prevBallX = 0;
let prevBallY = 0;
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  paddleY = height - 40;
  paddleX = width / 2;
  ball.x = width / 2;
  ball.y = paddleY - 6 - 1;
  ball.r = 6;
  ball.vx = 4;
  ball.vy = -5;
  for (let i = 0; i < rows; i++) {
    if (i === 0) {
      rowColors[i] = color(255, 80, 80);
    } else if (i === 1) {
      rowColors[i] = color(255, 160, 80);
    } else if (i === 2) {
      rowColors[i] = color(255, 220, 80);
    } else if (i === 3) {
      rowColors[i] = color(120, 200, 120);
    } else if (i === 4) {
      rowColors[i] = color(100, 160, 240);
    } else {
      rowColors[i] = color(180, 120, 220);
    }
  }
  let totalBlockAreaW = cols * blockW + (cols - 1) * blockGap;
  let startX = Math.floor((width - totalBlockAreaW) / 2);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let bx = startX + c * (blockW + blockGap);
      let by = topOffset + r * (blockH + 6);
      let b = {
        x: bx,
        y: by,
        w: blockW,
        h: blockH,
        col: rowColors[r]
      };
      blocks.push(b);
    }
  }
  textAlign(LEFT, TOP);
  textSize(16);
}
function draw() {
  background(30);
  fill(255);
  noStroke();
  text('Score: ' + score, 8, 8);
  for (let i = 0; i < blocks.length; i++) {
    fill(blocks[i].col);
    rect(blocks[i].x, blocks[i].y, blocks[i].w, blocks[i].h, 4);
  }
  paddleX = constrain(mouseX, paddleWidth / 2, width - paddleWidth / 2);
  fill(200);
  rectMode(CENTER);
  rect(paddleX, paddleY, paddleWidth, paddleHeight, 6);
  rectMode(CORNER);
  fill(255);
  ellipse(ball.x, ball.y, ball.r * 2, ball.r * 2);
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    let alpha = map(p.life, 0, 15, 0, 255);
    alpha = constrain(alpha, 0, 255);
    fill(255, alpha);
    noStroke();
    ellipse(p.x, p.y, 4, 4);
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  if (!gameOver) {
    prevBallX = ball.x;
    prevBallY = ball.y;
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x - ball.r <= 0) {
      ball.x = ball.r;
      ball.vx = abs(ball.vx);
    } else if (ball.x + ball.r >= width) {
      ball.x = width - ball.r;
      ball.vx = -abs(ball.vx);
    }
    if (ball.y - ball.r <= 0) {
      ball.y = ball.r;
      ball.vy = abs(ball.vy);
    }
    if (ball.y - ball.r > height) {
      gameOver = true;
    }
    if (ball.vy > 0) {
      let closestX = constrain(ball.x, paddleX - paddleWidth / 2, paddleX + paddleWidth / 2);
      let closestY = constrain(ball.y, paddleY - paddleHeight / 2, paddleY + paddleHeight / 2);
      let dx = ball.x - closestX;
      let dy = ball.y - closestY;
      if (dx * dx + dy * dy <= ball.r * ball.r) {
        let rel = (ball.x - paddleX) / (paddleWidth / 2);
        rel = constrain(rel, -1, 1);
        let angle = rel * (PI / 3);
        let speed = sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        ball.vx = speed * sin(angle);
        ball.vy = -abs(speed * cos(angle));
        ball.y = paddleY - paddleHeight / 2 - ball.r - 0.1;
      }
    }
    for (let i = blocks.length - 1; i >= 0; i--) {
      let b = blocks[i];
      let closestX = constrain(ball.x, b.x, b.x + b.w);
      let closestY = constrain(ball.y, b.y, b.y + b.h);
      let dx = ball.x - closestX;
      let dy = ball.y - closestY;
      if (dx * dx + dy * dy <= ball.r * ball.r) {
        score += 10;
        for (let k = 0; k < 3; k++) {
          let p = {
            x: ball.x,
            y: ball.y,
            vx: random(-2, 2),
            vy: random(-2, 2),
            life: 15
          };
          particles.push(p);
        }
        let collidedVertically = false;
        if (prevBallY + ball.r <= b.y) {
          collidedVertically = true;
        } else if (prevBallY - ball.r >= b.y + b.h) {
          collidedVertically = true;
        }
        if (collidedVertically) {
          ball.vy = -ball.vy;
        } else {
          ball.vx = -ball.vx;
        }
        blocks.splice(i, 1);
        break;
      }
    }
  } else {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255, 200, 200);
    text('GAME OVER', width / 2, height / 2 - 20);
    textSize(16);
    fill(220);
    text('Final Score: ' + score, width / 2, height / 2 + 18);
    textAlign(LEFT, TOP);
  }
}
