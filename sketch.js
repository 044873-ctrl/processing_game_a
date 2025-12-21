let playerX;
let playerY;
let playerSpeed;
let playerRadius;
let bullets;
let enemies;
let particles;
let stars;
let score;
let frameCounter;
let spawnInterval;
let shootCooldown;
let shootTimer;
let gameOver;
function setup(){
  createCanvas(400,600);
  playerX = width / 2;
  playerY = height - 40;
  playerSpeed = 5;
  playerRadius = 16;
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  frameCounter = 0;
  spawnInterval = 60;
  shootCooldown = 10;
  shootTimer = 0;
  gameOver = false;
  for(let i=0;i<30;i++){
    let s = {
      x: random(0,width),
      y: random(0,height),
      speed: random(0.5,2),
      size: random(1,3)
    };
    stars.push(s);
  }
  noStroke();
}
function draw(){
  background(0);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    fill(200);
    circle(s.x,s.y,s.size);
    s.y += s.speed;
    if(s.y > height){
      s.y = 0;
      s.x = random(0,width);
      s.speed = random(0.5,2);
      s.size = random(1,3);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      playerX -= playerSpeed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      playerX += playerSpeed;
    }
    if(playerX < playerRadius){
      playerX = playerRadius;
    }
    if(playerX > width - playerRadius){
      playerX = width - playerRadius;
    }
    if(shootTimer > 0){
      shootTimer--;
    }
    if(keyIsDown(32) && shootTimer <= 0){
      let b = {
        x: playerX,
        y: playerY - playerRadius,
        r: 4,
        speed: 8
      };
      bullets.push(b);
      shootTimer = shootCooldown;
    }
    frameCounter++;
    if(frameCounter % spawnInterval === 0){
      let e = {
        x: random(12,width-12),
        y: -12,
        r: 12,
        speed: 2
      };
      enemies.push(e);
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y -= b.speed;
      fill(255,255,0);
      circle(b.x,b.y,b.r*2);
      if(b.y < -b.r){
        bullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += e.speed;
      fill(255,0,0);
      circle(e.x,e.y,e.r*2);
      if(e.y > height + e.r){
        enemies.splice(i,1);
        continue;
      }
      let dPlayer = dist(e.x,e.y,playerX,playerY);
      if(dPlayer <= e.r + playerRadius){
        gameOver = true;
      }
      for(let j=bullets.length-1;j>=0;j--){
        let b = bullets[j];
        let d = dist(e.x,e.y,b.x,b.y);
        if(d <= e.r + b.r){
          bullets.splice(j,1);
          enemies.splice(i,1);
          score += 1;
          for(let k=0;k<5;k++){
            let angle = random(0,Math.PI*2);
            let speed = random(1,3);
            let p = {
              x: e.x,
              y: e.y,
              vx: Math.cos(angle)*speed,
              vy: Math.sin(angle)*speed,
              r: 3,
              life: 20
            };
            particles.push(p);
          }
          break;
        }
      }
    }
  }
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    let alpha = map(p.life,0,20,0,255);
    fill(255,150,0,alpha);
    circle(p.x,p.y,p.r*2);
    if(p.life <= 0){
      particles.splice(i,1);
    }
  }
  if(!gameOver){
    fill(0,150,255);
    circle(playerX,playerY,playerRadius*2);
    fill(255);
    textSize(16);
    textAlign(LEFT,TOP);
    text("SCORE: " + score,10,10);
  } else {
    fill(200);
    textSize(24);
    textAlign(CENTER,CENTER);
    text("GAME OVER",width/2,height/2-20);
    textSize(16);
    text("SCORE: " + score,width/2,height/2+10);
  }
}
