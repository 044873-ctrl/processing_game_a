let player;
let bullets;
let enemies;
let particles;
let stars;
let score;
let gameOver;
let fireCooldown;
let bulletRadius;
let bulletSpeed;
let enemyRadius;
let enemySpeed;
let particleRadius;
let particleLife;
function setup() {
  createCanvas(400, 600);
  player = { x: width / 2, y: height - 30, r: 16, speed: 5 };
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  fireCooldown = 0;
  bulletRadius = 4;
  bulletSpeed = 13;
  enemyRadius = 12;
  enemySpeed = 2;
  particleRadius = 3;
  particleLife = 20;
  for (let i = 0; i < 30; i++) {
    let s = {
      x: random(0, width),
      y: random(0, height),
      r: random(1, 3),
      speed: random(0.5, 2)
    };
    stars.push(s);
  }
  textAlign(LEFT, TOP);
  textSize(16);
}
function draw() {
  background(0);
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    fill(255);
    noStroke();
    circle(s.x, s.y, s.r);
    s.y += s.speed;
    if (s.y > height) {
      s.y = 0;
      s.x = random(0, width);
    }
  }
  if (!gameOver) {
    if (keyIsDown(LEFT_ARROW)) {
      player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.x += player.speed;
    }
    player.x = constrain(player.x, player.r, width - player.r);
    if (fireCooldown > 0) {
      fireCooldown--;
    }
    if (keyIsDown(32) && fireCooldown <= 0) {
      createBullet(player.x, player.y - player.r);
      fireCooldown = 6;
    }
    if (frameCount % 60 === 0) {
      createEnemy();
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      b.y -= b.speed;
      if (b.y + b.r < 0) {
        bullets.splice(i, 1);
        continue;
      }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      e.y += e.speed;
      if (e.y - e.r > height) {
        enemies.splice(i, 1);
        continue;
      }
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      let hit = false;
      for (let j = enemies.length - 1; j >= 0; j--) {
        let e = enemies[j];
        let dx = b.x - e.x;
        let dy = b.y - e.y;
        let distSq = dx * dx + dy * dy;
        let minDist = b.r + e.r;
        if (distSq <= minDist * minDist) {
          createParticles(e.x, e.y);
          bullets.splice(i, 1);
          enemies.splice(j, 1);
          score += 1;
          hit = true;
          break;
        }
      }
      if (hit) {
        continue;
      }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      let dx = player.x - e.x;
      let dy = player.y - e.y;
      let distSq = dx * dx + dy * dy;
      let minDist = player.r + e.r;
      if (distSq <= minDist * minDist) {
        gameOver = true;
        break;
      }
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
  }
  fill(0, 150, 255);
  noStroke();
  circle(player.x, player.y, player.r * 2);
  for (let i = 0; i < bullets.length; i++) {
    let b = bullets[i];
    fill(255, 255, 0);
    noStroke();
    circle(b.x, b.y, b.r * 2);
  }
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    fill(255, 0, 0);
    noStroke();
    circle(e.x, e.y, e.r * 2);
  }
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let alpha = map(p.life, 0, particleLife, 0, 255);
    fill(255, 200, 0, alpha);
    noStroke();
    circle(p.x, p.y, p.r * 2);
  }
  fill(255);
  noStroke();
  text("Score: " + score, 8, 8);
  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Game Over", width / 2, height / 2);
    textSize(16);
    textAlign(LEFT, TOP);
  }
}
function createBullet(x, y) {
  let b = { x: x, y: y, r: bulletRadius, speed: bulletSpeed };
  bullets.push(b);
}
function createEnemy() {
  let ex = random(enemyRadius, width - enemyRadius);
  let ey = -enemyRadius;
  let e = { x: ex, y: ey, r: enemyRadius, speed: enemySpeed };
  enemies.push(e);
}
function createParticles(x, y) {
  for (let i = 0; i < 5; i++) {
    let angle = random(0, Math.PI * 2);
    let speed = random(1, 3);
    let vx = cos(angle) * speed;
    let vy = sin(angle) * speed;
    let p = { x: x, y: y, vx: vx, vy: vy, r: particleRadius, life: particleLife };
    particles.push(p);
  }
}
