let STAR_COUNT = 30;
let PLAYER_SPEED = 5;
let BULLET_SPEED = 70;
let BULLET_RADIUS = 30;
let ENEMY_SPEED = 8;
let ENEMY_RADIUS = 12;
let PARTICLE_COUNT = 5;
let PARTICLE_RADIUS = 3;
let PARTICLE_LIFE = 20;
let PLAYER_RADIUS = 20;
let stars = [];
let bullets = [];
let enemies = [];
let particles = [];
let player = {x:0,y:0};
let score = 0;
let gameOver = false;
function spawnEnemy(){
  let ex = random(ENEMY_RADIUS, width - ENEMY_RADIUS);
  let ey = -ENEMY_RADIUS;
  enemies.push({x:ex,y:ey,r:ENEMY_RADIUS});
}
function createParticles(px,py){
  for(let i=0;i<PARTICLE_COUNT;i++){
    let angle = random(0, TWO_PI);
    let speed = random(1,4);
    let vx = cos(angle)*speed;
    let vy = sin(angle)*speed;
    particles.push({x:px,y:py,vx:vx,vy:vy,r:PARTICLE_RADIUS,life:PARTICLE_LIFE});
  }
}
function setup(){
  createCanvas(400,600);
  player.x = width/2;
  player.y = height - 40;
  for(let i=0;i<STAR_COUNT;i++){
    let sx = random(0,width);
    let sy = random(0,height);
    let ss = random(0.5,2.5);
    let sr = random(1,3);
    stars.push({x:sx,y:sy,spd:ss,r:sr});
  }
  score = 0;
  gameOver = false;
  bullets = [];
  enemies = [];
  particles = [];
}
function draw(){
  background(0);
  noStroke();
  fill(255);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    ellipse(s.x,s.y,s.r,s.r);
    s.y += s.spd;
    if(s.y > height){
      s.y = random(-height,0);
      s.x = random(0,width);
      s.spd = random(0.5,2.5);
      s.r = random(1,3);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= PLAYER_SPEED;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += PLAYER_SPEED;
    }
    player.x = constrain(player.x, PLAYER_RADIUS, width - PLAYER_RADIUS);
    if(frameCount % 60 === 0){
      spawnEnemy();
    }
    for(let i=enemies.length-1;i>=0;i--){
      enemies[i].y += ENEMY_SPEED;
      if(enemies[i].y > height + enemies[i].r){
        enemies.splice(i,1);
        continue;
      }
      let d = dist(enemies[i].x,enemies[i].y,player.x,player.y);
      if(d <= enemies[i].r + PLAYER_RADIUS){
        gameOver = true;
      }
    }
    for(let i=bullets.length-1;i>=0;i--){
      bullets[i].y -= BULLET_SPEED;
      if(bullets[i].y < -bullets[i].r){
        bullets.splice(i,1);
        continue;
      }
      let hit = false;
      for(let j=enemies.length-1;j>=0;j--){
        let dbe = dist(bullets[i].x,bullets[i].y,enemies[j].x,enemies[j].y);
        if(dbe <= bullets[i].r + enemies[j].r){
          createParticles(enemies[j].x,enemies[j].y);
          enemies.splice(j,1);
          bullets.splice(i,1);
          score += 1;
          hit = true;
          break;
        }
      }
      if(hit){
        continue;
      }
    }
  }
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.life -= 1;
    p.x += p.vx;
    p.y += p.vy;
    let alpha = map(p.life,0,PARTICLE_LIFE,0,255);
    fill(255,200,0,alpha);
    ellipse(p.x,p.y,p.r*2,p.r*2);
    if(p.life <= 0){
      particles.splice(i,1);
    }
  }
  fill(0,200,255);
  for(let i=0;i<bullets.length;i++){
    ellipse(bullets[i].x,bullets[i].y,bullets[i].r*2,bullets[i].r*2);
  }
  fill(255,80,80);
  for(let i=0;i<enemies.length;i++){
    ellipse(enemies[i].x,enemies[i].y,enemies[i].r*2,enemies[i].r*2);
  }
  fill(100,255,150);
  ellipse(player.x,player.y,PLAYER_RADIUS*2,PLAYER_RADIUS*2);
  fill(255);
  textSize(24);
  textAlign(LEFT,TOP);
  text(score,10,10);
  if(gameOver){
    fill(255,0,0);
    textSize(36);
    textAlign(CENTER,CENTER);
    text("GAME OVER", width/2, height/2);
  }
}
function keyPressed(){
  if(!gameOver && keyCode === 32){
    let bx = player.x;
    let by = player.y - PLAYER_RADIUS - BULLET_RADIUS;
    bullets.push({x:bx,y:by,r:BULLET_RADIUS});
  }
}
