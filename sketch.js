const CANVAS_W = 600
const CANVAS_H = 400
const PLAYER_W = 60
const PLAYER_H = 16
const PLAYER_SPEED = 6
const SPAWN_INTERVAL_MIN = 600
const SPAWN_INTERVAL_MAX = 1100
const OBSTACLE_MIN_R = 8
const OBSTACLE_MAX_R = 28
const OBSTACLE_SPEED_MIN = 2
const OBSTACLE_SPEED_MAX = 6
let player = null
let obstacles = null
let spawnTimer = 0
let nextSpawn = 0
let score = 0
let isGameOver = false
function initGame() {
  player = {
    x: CANVAS_W / 2,
    y: CANVAS_H - PLAYER_H - 8,
    w: PLAYER_W,
    h: PLAYER_H,
    speed: PLAYER_SPEED
  }
  obstacles = []
  spawnTimer = 0
  nextSpawn = randomInt(SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_MAX)
  score = 0
  isGameOver = false
  frameRate(60)
}
function randomInt(a, b) {
  const amin = Math.ceil(a)
  const bmax = Math.floor(b)
  return Math.floor(Math.random() * (bmax - amin + 1)) + amin
}
function spawnObstacle() {
  const r = random(OBSTACLE_MIN_R, OBSTACLE_MAX_R)
  const x = random(r, CANVAS_W - r)
  const y = -r
  const vy = random(OBSTACLE_SPEED_MIN, OBSTACLE_SPEED_MAX)
  const ob = { x: x, y: y, r: r, vy: vy }
  obstacles.push(ob)
}
function clamp(v, a, b) {
  if (v < a) {
    return a
  }
  if (v > b) {
    return b
  }
  return v
}
function circleRectCollide(cx, cy, cr, rx, ry, rw, rh) {
  const closestX = clamp(cx, rx, rx + rw)
  const closestY = clamp(cy, ry, ry + rh)
  const dx = cx - closestX
  const dy = cy - closestY
  const distSq = dx * dx + dy * dy
  return distSq <= cr * cr
}
function updatePlayer() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.x -= player.speed
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.x += player.speed
  }
  const halfW = player.w / 2
  if (player.x - halfW < 0) {
    player.x = halfW
  }
  if (player.x + halfW > CANVAS_W) {
    player.x = CANVAS_W - halfW
  }
}
function updateObstacles(dt) {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const ob = obstacles[i]
    ob.y += ob.vy * (dt / (1000 / 60))
    if (ob.y - ob.r > CANVAS_H) {
      obstacles.splice(i, 1)
      continue
    }
    const rx = player.x - player.w / 2
    const ry = player.y
    const collided = circleRectCollide(ob.x, ob.y, ob.r, rx, ry, player.w, player.h)
    if (collided) {
      isGameOver = true
    }
  }
}
function drawPlayer() {
  const px = player.x
  const py = player.y
  const pw = player.w
  const ph = player.h
  fill(30, 144, 255)
  noStroke()
  rect(px - pw / 2, py, pw, ph, 4)
}
function drawObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    const ob = obstacles[i]
    fill(220, 50, 50)
    noStroke()
    ellipse(ob.x, ob.y, ob.r * 2, ob.r * 2)
  }
}
function drawHUD() {
  fill(255)
  textSize(16)
  textAlign(LEFT, TOP)
  text("Score: " + floor(score), 8, 8)
  if (isGameOver) {
    fill(0, 180)
    rect(0, 0, CANVAS_W, CANVAS_H)
    fill(255)
    textSize(28)
    textAlign(CENTER, CENTER)
    text("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 20)
    textSize(16)
    text("Press R to restart", CANVAS_W / 2, CANVAS_H / 2 + 16)
  }
}
function setup() {
  createCanvas(CANVAS_W, CANVAS_H)
  initGame()
}
function draw() {
  background(34)
  const dt = deltaTime
  if (!isGameOver) {
    updatePlayer()
    spawnTimer += dt
    if (spawnTimer >= nextSpawn) {
      spawnTimer = 0
      nextSpawn = randomInt(SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_MAX)
      spawnObstacle()
    }
    updateObstacles(dt)
    score += dt / 1000
  } else {
    if (keyIsDown(82)) {
      initGame()
    }
  }
  drawPlayer()
  drawObstacles()
  drawHUD()
}
