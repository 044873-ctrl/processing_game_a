class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 28;
    this.speed = 5;
  }
  update() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.x += this.speed;
    }
    this.x = Math.max(this.size / 2, Math.min(width - this.size / 2, this.x));
  }
  draw() {
    noStroke();
    fill(20, 160, 220);
    ellipse(this.x, this.y, this.size, this.size);
    fill(255);
    triangle(this.x - 6, this.y + 4, this.x + 6, this.y + 4, this.x, this.y - 8);
  }
}
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 5;
    this.vy = -9;
  }
  update() {
    this.y += this.vy;
  }
  draw() {
    noStroke();
    fill(255, 240, 80);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}
class Enemy {
  constructor(x, y, speed, size) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = size;
  }
  update() {
    this.y += this.speed;
  }
  draw() {
    noStroke();
    fill(220, 60, 60);
    ellipse(this.x, this.y, this.size, this.size);
    fill(0);
    rect(this.x - this.size * 0.15, this.y - 2, this.size * 0.3, 4);
  }
}
let player;
let bullets = [];
let enemies = [];
let spawnTimer;
let spawnMin = 30;
let spawnMax = 80;
let score = 0;
let lives = 3;
let gameOver = false;
let shootCooldown = 0;
let shootDelay = 12;
function setup() {
  createCanvas(480, 640);
  player = new Player(width / 2, height - 40);
  bullets = [];
  enemies = [];
  spawnTimer = Math.floor(Math.random() * (spawnMax - spawnMin + 1)) + spawnMin;
  score = 0;
  lives = 3;
  gameOver = false;
  shootCooldown = 0;
  textFont('sans-serif');
  textAlign(LEFT, TOP);
}
function draw() {
  background(18, 24, 30);
  if (!gameOver) {
    player.update();
    if (shootCooldown > 0) {
      shootCooldown--;
    }
    if (spawnTimer <= 0) {
      let ex = Math.random() * (width - 30) + 15;
      let baseSpeed = 1.2 + Math.min(3.5, score * 0.05);
      let esize = Math.floor(Math.random() * 18) + 20;
      let enemy = new Enemy(ex, -esize, baseSpeed + Math.random() * 1.2, esize);
      enemies.push(enemy);
      spawnTimer = Math.floor(Math.random() * (spawnMax - spawnMin + 1)) + spawnMin;
    } else {
      spawnTimer--;
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      b.update();
      if (b.y + b.r < 0) {
        bullets.splice(i, 1);
      }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      e.update();
      if (e.y - e.size / 2 > height) {
        enemies.splice(i, 1);
        lives = Math.max(0, lives - 1);
        if (lives <= 0) {
          gameOver = true;
        }
      }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      for (let j = bullets.length - 1; j >= 0; j--) {
        let b = bullets[j];
        let dx = e.x - b.x;
        let dy = e.y - b.y;
        let rsum = e.size / 2 + b.r;
        if (dx * dx + dy * dy <= rsum * rsum) {
          enemies.splice(i, 1);
          bullets.splice(j, 1);
          score += 1;
          break;
        }
      }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      let dx = e.x - player.x;
      let dy = e.y - player.y;
      let pr = player.size / 2;
      let er = e.size / 2;
      if (dx * dx + dy * dy <= (pr + er) * (pr + er)) {
        enemies.splice(i, 1);
        lives = Math.max(0, lives - 1);
        if (lives <= 0) {
          gameOver = true;
        }
      }
    }
  }
  player.draw();
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].draw();
  }
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].draw();
  }
  fill(255);
  textSize(18);
  text(
