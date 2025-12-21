let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
let bulletCooldown = 0;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height - 40, r: 20, speed: 5};
  for(let i=0;i<30;i++){
    let s = {x: random(0,width), y: random(0,height), v: random(1,3), sz: random(1,3)};
    stars.push(s);
  }
  textAlign(LEFT, TOP);
  textSize(16);
  noStroke();
}
function draw(){
  background(0);
  fill(255);
  for(let i=0;i<stars.length;i++){
    let st = stars[i];
    ellipse(st.x, st.y, st.sz, st.sz);
    st.y += st.v;
    if(st.y > height){
      st.y = random(-10,0);
      st.x = random(0,width);
      st.v = random(1,3);
      st.sz = random(1,3);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.speed;
    }
    player.x = constrain(player.x, player.r, width - player.r);
    if(frameCount % 60 === 0){
      for(let i=0;i<10;i++){
        let ex = random(12, width-12);
        let ey = -12;
        let e = {x: ex, y: ey, r: 12, vy: 8};
        enemies.push(e);
      }
    }
    if(bulletCooldown > 0){
      bulletCooldown--;
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y += b.vy;
      if(b.y + b.r < 0){
        bullets.splice(i,1);
      }
    }
    for(let ei=enemies.length-1;ei>=0;ei--){
      let e = enemies[ei];
      e.y += e.vy;
      if(e.y - e.r > height){
        enemies.splice(ei,1);
        continue;
      }
      let dpe = dist(e.x,e.y,player.x,player.y);
      if(dpe < e.r + player.r){
        gameOver = true;
      }
    }
    for(let ei=enemies.length-1;ei>=0;ei--){
      let e = enemies[ei];
      let hit = false;
      for(let bi=bullets.length-1;bi>=0;bi--){
        let b = bullets[bi];
        let d = dist(e.x,e.y,b.x,b.y);
        if(d < e.r + b.r){
          for(let k=0;k<5;k++){
            let angle = random(0, TWO_PI);
            let speed = random(1,4);
            let p = {x: e.x, y: e.y, r: 3, vx: cos(angle)*speed, vy: sin(angle)*speed, life: 20};
            particles.push(p);
          }
          enemies.splice(ei,1);
          bullets.splice(bi,1);
          score += 1;
          hit = true;
          break;
        }
      }
      if(hit){
        continue;
      }
    }
    for(let pi=particles.length-1;pi>=0;pi--){
      let p = particles[pi];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if(p.life <= 0){
        particles.splice(pi,1);
      }
    }
  } else {
    for(let pi=particles.length-1;pi>=0;pi--){
      let p = particles[pi];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if(p.life <= 0){
        particles.splice(pi,1);
      }
    }
  }
  fill(0,200,255,200);
  for(let i=0;i<bullets.length;i++){
    let b = bullets[i];
    ellipse(b.x, b.y, b.r*2, b.r*2);
  }
  fill(255,80,80);
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    ellipse(e.x, e.y, e.r*2, e.r*2);
  }
  fill(255,200,50);
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    ellipse(p.x, p.y, p.r*2, p.r*2);
  }
  fill(100,255,150);
  ellipse(player.x, player.y, player.r*2, player.r*2);
  fill(255);
  text(String(score), 10, 10);
  if(gameOver){
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255,20,20);
    text("GAME OVER", width/2, height/2);
    textSize(16);
    textAlign(LEFT, TOP);
  }
}
function keyPressed(){
  if(!gameOver && (keyCode === 32) && bulletCooldown <= 0){
    let b = {x: player.x, y: player.y - player.r - 1, r: 50, vy: -70};
    bullets.push(b);
    bulletCooldown = 10;
  }
}
