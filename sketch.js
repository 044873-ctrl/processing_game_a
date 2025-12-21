let canvasWidth = 400;
let canvasHeight = 600;
let player = {};
let playerSpeed = 5;
let playerR = 12;
let bullets = [];
let bulletR = 4;
let bulletSpeed = 8;
let enemies = [];
let enemyR = 12;
let enemySpeed = 2;
let explosions = [];
let explosionCountPerKill = 5;
let explosionR = 3;
let explosionLife = 20;
let stars = [];
let starCount = 30;
let score = 0;
let gameOver = false;
let shootCooldown = 0;
function setup(){
  createCanvas(canvasWidth, canvasHeight);
  player.x = canvasWidth/2;
  player.y = canvasHeight - 40;
  for(let i=0;i<starCount;i++){
    let s = {x:random(0,canvasWidth), y:random(0,canvasHeight), vy:random(0.5,1.5), r:random(1,2)};
    stars.push(s);
  }
  textSize(20);
  textAlign(LEFT, TOP);
}
function draw(){
  background(0);
  for(let i=stars.length-1;i>=0;i--){
    let s = stars[i];
    s.y += s.vy;
    fill(200);
    noStroke();
    ellipse(s.x, s.y, s.r*2, s.r*2);
    if(s.y > height){
      s.y = -s.r;
      s.x = random(0, width);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= playerSpeed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += playerSpeed;
    }
    player.x = constrain(player.x, playerR, width - playerR);
    if(shootCooldown > 0){
      shootCooldown--;
    }
    if(keyIsDown(32) && shootCooldown <= 0){
      let b = {x:player.x, y:player.y - playerR - bulletR, r:bulletR, vy:-bulletSpeed};
      bullets.push(b);
      shootCooldown = 10;
    }
    if(frameCount % 60 === 0){
      let ex = random(enemyR, width - enemyR);
      let e = {x:ex, y:-enemyR, r:enemyR, vy:enemySpeed};
      enemies.push(e);
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += e.vy;
      if(e.y - e.r > height){
        enemies.splice(i,1);
      }
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y += b.vy;
      if(b.y + b.r < 0){
        bullets.splice(i,1);
      }
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      for(let j=enemies.length-1;j>=0;j--){
        let e = enemies[j];
        let d = dist(b.x, b.y, e.x, e.y);
        if(d <= b.r + e.r){
          bullets.splice(i,1);
          enemies.splice(j,1);
          score += 10;
          for(let k=0;k<explosionCountPerKill;k++){
            let angle = random(0, TWO_PI);
            let speed = random(1,3);
            let p = {x:e.x, y:e.y, vx:cos(angle)*speed, vy:sin(angle)*speed, r:explosionR, life:explosionLife};
            explosions.push(p);
          }
          break;
        }
      }
    }
    for(let i=explosions.length-1;i>=0;i--){
      let p = explosions[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if(p.life <= 0){
        explosions.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      let d = dist(player.x, player.y, e.x, e.y);
      if(d <= playerR + e.r){
        gameOver = true;
        break;
      }
    }
  }
  fill(0,150,255);
  noStroke();
  ellipse(player.x, player.y, playerR*2, playerR*2);
  fill(255,255,0);
  for(let i=0;i<bullets.length;i++){
    let b = bullets[i];
    ellipse(b.x, b.y, b.r*2, b.r*2);
  }
  fill(255,0,0);
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    ellipse(e.x, e.y, e.r*2, e.r*2);
  }
  fill(255,150,0,200);
  for(let i=0;i<explosions.length;i++){
    let p = explosions[i];
    let alpha = map(p.life,0,explosionLife,0,255);
    fill(255,150,0,alpha);
    ellipse(p.x, p.y, p.r*2, p.r*2);
  }
  fill(255);
  noStroke();
  text("Score: "+score, 10, 10);
  if(gameOver){
    textSize(36);
    textAlign(CENTER, CENTER);
    fill(255,0,0);
    text("GAME OVER", width/2, height/2 - 20);
    textSize(20);
    fill(255);
    text("Score: "+score, width/2, height/2 + 20);
    textAlign(LEFT, TOP);
    textSize(20);
  }
}
