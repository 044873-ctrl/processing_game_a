const W = 400;
const H = 600;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 300 / 60;
const ENEMY_SPEED = 39 / 60;
const BULLET_RADIUS = 2;
const ENEMY_RADIUS = 12;
const PARTICLE_RADIUS = 3;
const PARTICLE_LIFE = 20;
const STAR_COUNT = 30;
let player;
let stars = [];
let bullets = [];
let enemies = [];
let particles = [];
let score = 0;
let gameOver = false;
function setup() {
  createCanvas(W, H);
  player = { x: W / 2, y: H - 30, r: 12 };
  for (let i = 0; i < STAR_COUNT; i++) {
    let s = {
      x: random(0, W),
      y: random(0, H),
      speed: random(0.5, 2),
      size: random(1, 3)
    };
    stars.push(s);
  }
  bullets = [];
  enemies = [];
  particles = [];
  score = 0;
  gameOver = false;
}
function draw() {
  background(0);
  updateAndDrawStars();
  if (!gameOver) {
    handlePlayerInput();
  }
  drawPlayer();
  if (!gameOver) {
    spawnEnemies();
    updateBullets();
    updateEnemies();
    handleCollisions();
  } else {
    noLoop();
  }
  updateParticles();
  drawUI();
}
function updateAndDrawStars() {
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    s.y += s.speed;
    if (s.y > H) {
      s.y = random(-H, 0);
      s.x = random(0, W);
      s.speed = random(0.5, 2);
      s.size = random(1, 3);
    }
    noStroke();
    fill(255);
    ellipse(s.x, s.y, s.size, s.size);
  }
}
function handlePlayerInput() {
  if (keyIsDown(LEFT_ARROW)) {
    player.x -= PLAYER_SPEED;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.x += PLAYER_SPEED;
  }
  player.x = constrain(player.x, player.r, W - player.r);
}
function drawPlayer() {
  noStroke();
  fill(0, 200, 255);
  ellipse(player.x, player.y, player.r * 2, player.r * 2);
}
function spawnEnemies() {
  if (frameCount % 60 === 0) {
    let ex = random(ENEMY_RADIUS, W - ENEMY_RADIUS);
    let e = { x: ex, y: -ENEMY_RADIUS, r: ENEMY_RADIUS, speed: ENEMY_SPEED, alive: true };
    enemies.push(e);
  }
}
function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let b = bullets[i];
    b.y += b.vy;
    if (b.y < -BULLET_RADIUS) {
      b.alive = false;
    }
    noStroke();
    fill(255, 255, 0);
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
  }
  bullets = bullets.filter(function(b) {
    return b.alive === true;
  });
}
function updateEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    e.y += e.speed;
    if (e.y > H + e.r) {
      e.alive = false;
    }
    noStroke();
    fill(255, 80, 80);
    ellipse(e.x, e.y, e.r * 2, e.r * 2);
    if (!gameOver) {
      let dx = e.x - player.x;
      let dy = e.y - player.y;
      let dist2 = dx * dx + dy * dy;
      let minDist = e.r + player.r;
      if (dist2 <= minDist * minDist) {
        gameOver = true;
      }
    }
  }
  enemies = enemies.filter(function(e) {
    return e.alive === true;
  });
}
function handleCollisions() {
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    if (!e.alive) {
      continue;
    }
    for (let j = 0; j < bullets.length; j++) {
      let b = bullets[j];
      if (!b.alive) {
        continue;
      }
      let dx = e.x - b.x;
      let dy = e.y - b.y;
      let dist2 = dx * dx + dy * dy;
      let minDist = e.r + b.r;
      if (dist2 <= minDist * minDist) {
        e.alive = false;
        b.alive = false;
        score += 1;
        createParticles(e.x, e.y);
        break;
      }
    }
  }
  enemies = enemies.filter(function(e) {
    return e.alive === true;
  });
  bullets = bullets.filter(function(b) {
    return b.alive === true;
  });
}
function createParticles(x, y) {
  for (let i = 0; i < 5; i++) {
    let angle = random(0, Math.PI * 2);
    let speed = random(1, 4);
    let p = {
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: PARTICLE_RADIUS,
      life: PARTICLE_LIFE
    };
    particles.push(p);
  }
}
function updateParticles() {
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    let alpha = map(p.life, 0, PARTICLE_LIFE, 0, 255);
    noStroke();
    fill(255, 180, 0, alpha);
    ellipse(p.x, p.y, p.r * 2, p.r * 2);
  }
  particles = particles.filter(function(p) {
    return p.life > 0;
  });
}
function drawUI() {
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10);
  if (gameOver) {
    fill(255, 0, 0);
    textSize(36);
    textAlign(CENTER, CENTER);
    text('GAME OVER', W / 2, H / 2);
    textSize(16);
    text('Press R to restart', W / 2, H / 2 + 40);
  }
}
function keyPressed() {
  if (keyCode === 32 && !gameOver) {
    let b = { x: player.x, y: player.y - player.r, r: BULLET_RADIUS, vy: -BULLET_SPEED, alive: true };
    bullets.push(b);
  }
  if ((key === 'r' || key === 'R') && gameOver) {
    resetGame();
    loop();
  }
}
function resetGame() {
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    let s = {
      x: random(0, W),
      y: random(0, H),
      speed: random(0.5, 2),
      size: random(1, 3)
    };
    stars.push(s);
  }
  player.x = W / 2;
  player.y = H - 30;
  score = 0;
  gameOver = false;
}
