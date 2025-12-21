let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let player = {};
let score = 0;
let gameOver = false;
function setup(){
  createCanvas(400,600);
  player.x = width/2;
  player.y = height - 40;
  player.r = 12;
  player.speed = 5;
  for(let i=0;i<30;i++){
    let s = {};
    s.x = random(0,width);
    s.y = random(0,height);
    s.size = random(1,3);
    s.speed = random(1,3);
    stars.push(s);
  }
  score = 0;
  gameOver = false;
}
function draw(){
  background(0);
  fill(255);
  noStroke();
  for(let i=stars.length-1;i>=0;i--){
    let s = stars[i];
    s.y += s.speed;
    if(s.y > height){
      s.x = random(0,width);
      s.y = random(-height,0);
      s.size = random(1,3);
      s.speed = random(1,3);
    }
    ellipse(s.x,s.y,s.size,s.size);
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
  fill(0,150,255);
  ellipse(player.x, player.y, player.r*2, player.r*2);
  if(!gameOver && frameCount % 60 === 0){
    let e = {};
    e.r = 12;
    e.x = random(e.r, width - e.r);
    e.y = -e.r;
    e.speed = 8;
    enemies.push(e);
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    if(!gameOver){
      e.y += e.speed;
    }
    fill(255,80,80);
    ellipse(e.x, e.y, e.r*2, e.r*2);
    if(e.y - e.r > height){
      enemies.splice(i,1);
    }
  }
  for(let i=bullets.length-1;i>=0;i--){
    let b = bullets[i];
    b.y += b.dy;
    fill(255,255,0,200);
    ellipse(b.x,b.y,b.r*2,b.r*2);
    if(b.y + b.r < 0){
      bullets.splice(i,1);
    }
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    for(let j=bullets.length-1;j>=0;j--){
      let b = bullets[j];
      let dx = e.x - b.x;
      let dy = e.y - b.y;
      let dist = sqrt(dx*dx + dy*dy);
      if(dist <= e.r + b.r){
        for(let k=0;k<5;k++){
          let p = {};
          p.x = e.x;
          p.y = e.y;
          p.r = 3;
          p.life = 20;
          p.age = 0;
          p.speed = random(1,4);
          p.angle = random(0, TWO_PI);
          particles.push(p);
        }
        enemies.splice(i,1);
        bullets.splice(j,1);
        score += 1;
        break;
      }
    }
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    let dx = e.x - player.x;
    let dy = e.y - player.y;
    let dist = sqrt(dx*dx + dy*dy);
    if(dist <= e.r + player.r){
      gameOver = true;
    }
  }
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += cos(p.angle)*p.speed;
    p.y += sin(p.angle)*p.speed;
    p.age += 1;
    let alpha = map(p.age,0,p.life,255,0);
    fill(255,200,50,alpha);
    ellipse(p.x,p.y,p.r*2,p.r*2);
    if(p.age >= p.life){
      particles.splice(i,1);
    }
  }
  fill(255);
  textSize(16);
  textAlign(LEFT,TOP);
  text("Score: " + score, 10, 10);
  if(gameOver){
    textSize(36);
    textAlign(CENTER,CENTER);
    fill(255,0,0);
    text("GAME OVER", width/2, height/2);
  }
}
function keyPressed(){
  if(keyCode === 32 && !gameOver){
    let b = {};
    b.x = player.x;
    b.y = player.y - player.r - 1;
    b.r = 300;
    b.dy = -70;
    bullets.push(b);
  }
}
