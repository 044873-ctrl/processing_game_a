let canvasW=400,canvasH=600;
let playerX,playerY;
let playerSpeed=5,playerRadius=14;
let bullets=[];
let enemies=[];
let particles=[];
let stars=[];
let score=0;
let gameOver=false;
function spawnEnemy(){
  let enemyRadius=12;
  let ex=random(enemyRadius,canvasW-enemyRadius);
  let ey=-enemyRadius;
  enemies.push({x:ex,y:ey,r:enemyRadius,vy:2});
}
function spawnParticles(x,y){
  for(let k=0;k<5;k++){
    let angle=random(0,TWO_PI);
    let speed=random(1,3);
    let vx=cos(angle)*speed;
    let vy=sin(angle)*speed;
    particles.push({x:x,y:y,r:3,vx:vx,vy:vy,life:20});
  }
}
function setup(){
  createCanvas(canvasW,canvasH);
  playerX=canvasW/2;
  playerY=canvasH-30;
  for(let i=0;i<30;i++){
    stars.push({x:random(0,canvasW),y:random(0,canvasH),s:random(1,3),vy:random(0.5,2)});
  }
  textSize(16);
  textAlign(LEFT,TOP);
  frameRate(60);
}
function keyPressed(){
  if(keyCode===32 && !gameOver){
    bullets.push({x:playerX,y:playerY-playerRadius,r:4,vy:8});
  }
}
function draw(){
  background(255,230,0);
  for(let i=0;i<stars.length;i++){
    let st=stars[i];
    fill(255);
    noStroke();
    ellipse(st.x,st.y,st.s,st.s);
    st.y+=st.vy;
    if(st.y>canvasH){
      st.y=-st.s;
      st.x=random(0,canvasW);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      playerX-=playerSpeed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      playerX+=playerSpeed;
    }
    playerX=constrain(playerX,playerRadius,canvasW-playerRadius);
  }
  for(let i=bullets.length-1;i>=0;i--){
    let b=bullets[i];
    fill(255,255,0);
    noStroke();
    ellipse(b.x,b.y,b.r*2,b.r*2);
    b.y-=b.vy;
    if(b.y<-b.r){
      bullets.splice(i,1);
    }
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e=enemies[i];
    fill(200,0,0);
    noStroke();
    ellipse(e.x,e.y,e.r*2,e.r*2);
    e.y+=e.vy;
    if(e.y>canvasH+e.r){
      enemies.splice(i,1);
    } else {
      let dx=e.x-playerX;
      let dy=e.y-playerY;
      let dist2=dx*dx+dy*dy;
      let sumr=e.r+playerRadius;
      if(dist2<=sumr*sumr){
        gameOver=true;
      }
    }
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e=enemies[i];
    let hit=false;
    for(let j=bullets.length-1;j>=0;j--){
      let b=bullets[j];
      let dx=e.x-b.x;
      let dy=e.y-b.y;
      let dist2=dx*dx+dy*dy;
      let sumr=e.r+b.r;
      if(dist2<=sumr*sumr){
        enemies.splice(i,1);
        bullets.splice(j,1);
        spawnParticles(e.x,e.y);
        score++;
        hit=true;
        break;
      }
    }
    if(hit) continue;
  }
  for(let i=particles.length-1;i>=0;i--){
    let p=particles[i];
    fill(255,150,0,200);
    noStroke();
    ellipse(p.x,p.y,p.r*2,p.r*2);
    p.x+=p.vx;
    p.y+=p.vy;
    p.life--;
    if(p.life<=0){
      particles.splice(i,1);
    }
  }
  fill(0,0,255);
  noStroke();
  triangle(playerX,playerY-playerRadius,playerX-playerRadius,playerY+playerRadius,playerX+playerRadius,playerY+playerRadius);
  fill(255);
  text("Score: "+score,8,8);
  if(gameOver){
    textAlign(CENTER,CENTER);
    textSize(32);
    fill(255,0,0);
    text("GAME OVER",canvasW/2,canvasH/2);
  }
  if(!gameOver && frameCount%60===0){
    spawnEnemy();
  }
}
