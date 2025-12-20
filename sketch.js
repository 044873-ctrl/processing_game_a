let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
let lastShotFrame = -100;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height - 40, speed: 5, r: 14};
  for(let i=0;i<30;i++){
    let s = {x: random(0,width), y: random(0,height), speed: random(0.5,2), r: random(1,3)};
    stars.push(s);
  }
  textSize(16);
  textAlign(LEFT, TOP);
}
function draw(){
  background(0);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    s.y += s.speed;
    if(s.y > height){
      s.y = -random(0,height);
      s.x = random(0,width);
      s.speed = random(0.5,2);
      s.r = random(1,3);
    }
    noStroke();
    fill(255);
    ellipse(s.x, s.y, s.r, s.r);
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.speed;
    }
    player.x = constrain(player.x, player.r, width - player.r);
  }
  noStroke();
  fill(0,150,255);
  ellipse(player.x, player.y, player.r*2, player.r*2);
  if(frameCount % 60 === 0 && !gameOver){
    let ex = random(12, width-12);
    let ey = -12;
    let enemy = {x: ex, y: ey, r: 12, speed: 2};
    enemies.push(enemy);
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    if(!gameOver){
      e.y += e.speed;
    }
    fill(255,100,100);
    ellipse(e.x, e.y, e.r*2, e.r*2);
    if(!gameOver){
      let d = dist(player.x, player.y, e.x, e.y);
      if(d <= player.r + e.r){
        gameOver = true;
      }
    }
    if(e.y > height + e.r){
      enemies.splice(i,1);
    }
  }
  for(let i=bullets.length-1;i>=0;i--){
    let b = bullets[i];
    b.y -= b.speed;
    fill(255,255,0);
    ellipse(b.x, b.y, b.r*2, b.r*2);
    if(b.y < -b.r){
      bullets.splice(i,1);
      continue;
    }
    for(let j=enemies.length-1;j>=0;j--){
      let e = enemies[j];
      let d = dist(b.x, b.y, e.x, e.y);
      if(d <= b.r + e.r){
        for(let k=0;k<5;k++){
          let angle = random(0, TWO_PI);
          let sp = random(1,3);
          let p = {x: e.x, y: e.y, vx: cos(angle)*sp, vy: sin(angle)*sp, r: 3, life: 20};
          particles.push(p);
        }
        enemies.splice(j,1);
        bullets.splice(i,1);
        score += 1;
        break;
      }
    }
  }
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    let alpha = constrain(p.life * 12, 0, 255);
    fill(255,150,0, alpha);
    ellipse(p.x, p.y, p.r*2, p.r*2);
    if(p.life <= 0){
      particles.splice(i,1);
    }
  }
  fill(255);
  text(String(score), 10, 10);
  if(gameOver){
    fill(0,0,0,150);
    rect(0,0,width,height);
    fill(255,0,0,200);
    ellipse(player.x, player.y, player.r*3, player.r*3);
  }
}
function keyPressed(){
  if(keyCode === 32 && !gameOver){
    if(frameCount - lastShotFrame >= 8){
      let b = {x: player.x, y: player.y - player.r - 4, r: 4, speed: 8};
      bullets.push(b);
      lastShotFrame = frameCount;
    }
  }
}
