let canvasW = 400;
let canvasH = 600;
let paddleW = 90;
let paddleH = 12;
let paddleY;
let ball = {};
let cols = 7;
let rows = 12;
let blocks = [];
let blockGap = 4;
let blockOffsetLeft = 10;
let blockOffsetTop = 40;
let blockW = 0;
let blockH = 16;
let colorsByRow = [];
let particles = [];
let score = 0;
let gameOver = false;
function setup() {
  createCanvas(canvasW, canvasH);
  rectMode(CORNER);
  ellipseMode(RADIUS);
  textAlign(LEFT, TOP);
  paddleY = height - 40;
  blockW = (width - blockOffsetLeft * 2 - (cols - 1) * blockGap) / cols;
  for (let r = 0; r < rows; r++) {
    let hue = map(r, 0, rows - 1, 0, 360);
    colorsByRow[r] = color(hue, 80, 90);
  }
  colorMode(HSB, 360, 100, 100, 1);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let bx = blockOffsetLeft + c * (blockW + blockGap);
      let by = blockOffsetTop + r * (blockH + blockGap);
      let b = { x: bx, y: by, w: blockW, h: blockH, row: r };
      blocks.push(b);
    }
  }
  ball.x = width / 2;
  ball.y = paddleY - 20;
  ball.r = 6;
  ball.vx = 4;
  ball.vy = -5;
  score = 0;
  gameOver = false;
  particles = [];
}
function draw() {
  background(0);
  drawBlocks();
  updateAndDrawParticles();
  let paddleX = constrain(mouseX, paddleW / 2, width - paddleW / 2);
  fill(200, 10, 95);
  noStroke();
  rect(paddleX - paddleW / 2, paddleY, paddleW, paddleH, 2);
  if (!gameOver) {
    updateBall(paddleX);
  }
  fill(0, 0, 100);
  ellipse(ball.x, ball.y, ball.r, ball.r);
  fill(0, 0, 100);
  textSize(18);
  textAlign(LEFT, TOP);
  text("Score: " + score, 8, 8);
  if (gameOver) {
    textSize(36);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2 - 20);
    textSize(18);
    text("Score: " + score, width / 2, height / 2 + 20);
  }
}
function drawBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    let b = blocks[i];
    fill(colorsByRow[b.row]);
    rect(b.x, b.y, b.w, b.h);
  }
}
function updateBall(paddleX) {
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.x - ball.r <= 0) {
    ball.x = ball.r;
    ball.vx = abs(ball.vx);
  }
  if (ball.x + ball.r >= width) {
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
  handlePaddleCollision(paddleX);
  handleBlockCollisions();
}
function handlePaddleCollision(paddleX) {
  let px = paddleX - paddleW / 2;
  let py = paddleY;
  if (ball.x + ball.r >= px && ball.x - ball.r <= px + paddleW && ball.y + ball.r >= py && ball.y - ball.r <= py + paddleH && ball.vy > 0) {
    let paddleCenter = px + paddleW / 2;
    let relative = (ball.x - paddleCenter) / (paddleW / 2);
    if (relative < -1) {
      relative = -1;
    } else if (relative > 1) {
      relative = 1;
    }
    let maxAngle = PI / 3;
    let angle = relative * maxAngle;
    let speed = sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    ball.vx = speed * sin(angle);
    ball.vy = -abs(speed * cos(angle));
    ball.y = py - ball.r - 0.1;
  }
}
function handleBlockCollisions() {
  for (let i = blocks.length - 1; i >= 0; i--) {
    let b = blocks[i];
    let closestX = clamp(ball.x, b.x, b.x + b.w);
    let closestY = clamp(ball.y, b.y, b.y + b.h);
    let dx = ball.x - closestX;
    let dy = ball.y - closestY;
    let dist2 = dx * dx + dy * dy;
    if (dist2 <= ball.r * ball.r) {
      if (abs(dx) > abs(dy)) {
        if (dx > 0) {
          ball.x = closestX + ball.r + 0.1;
          ball.vx = abs(ball.vx);
        } else {
          ball.x = closestX - ball.r - 0.1;
          ball.vx = -abs(ball.vx);
        }
      } else {
        if (dy > 0) {
          ball.y = closestY + ball.r + 0.1;
          ball.vy = abs(ball.vy);
        } else {
          ball.y = closestY - ball.r - 0.1;
          ball.vy = -abs(ball.vy);
        }
      }
      spawnParticles(b.x + b.w / 2, b.y + b.h / 2, colorsByRow[b.row]);
      blocks.splice(i, 1);
      score += 10;
    }
  }
}
function spawnParticles(x, y, col) {
  for (let i = 0; i < 3; i++) {
    let angle = random(0, TWO_PI);
    let speed = random(1, 3);
    let p = {
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      life: 15,
      color: col
    };
    particles.push(p);
  }
}
function updateAndDrawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    let alpha = p.life / 15;
    if (alpha < 0) {
      alpha = 0;
    }
    fill(hue(p.color), saturation(p.color), brightness(p.color), alpha);
    noStroke();
    ellipse(p.x, p.y, 3, 3);
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}
function clamp(v, a, b) {
  if (v < a) {
    return a;
  }
  if (v > b) {
    return b;
  }
  return v;
}
