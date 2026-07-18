let canvasW=400,canvasH=600;
let playerX,playerY;
let playerSpeed=5,playerRadius=14;
let bullets=[];
let enemies=[];
let enemyBullets=[];
let particles=[];
let stars=[];
let score=0;
let gameOver=false;
let playerHits=0;
let maxHits=3;
let extraLifeGranted=false;
function spawnEnemy(){let enemyRadius=12;let ex=random(enemyRadius,canvasW-enemyRadius);let ey=-enemyRadius;let evy=random(1.5,2.5);let fireCooldown=floor(random(60,180));enemies.push({x:ex,y:ey,r:enemyRadius,vy:evy,fireCooldown:fireCooldown});}
function spawnEnemyBullet(x,y,angle,speed){let vx=cos(angle)*speed;let vy=sin(angle)*speed;enemyBullets.push({x:x,y:y,r:4,vx:vx,vy:vy});}
function spawnParticles(x,y){for(let k=0;k<5;k++){let angle=random(0,TWO_PI);let speed=random(1,3);let vx=cos(angle)*speed;let vy=sin(angle)*speed;particles.push({x:x,y:y,r:3,vx:vx,vy:vy,life:20});}}
function setup(){createCanvas(canvasW,canvasH);playerX=canvasW/2;playerY=canvasH-30;for(let i=0;i<30;i++){stars.push({x:random(0,canvasW),y:random(0,canvasH),s:random(1,3),vy:random(0.5,2)});}textSize(16);textAlign(LEFT,TOP);frameRate(60);}
function keyPressed(){if(keyCode===32 && !gameOver){bullets.push({x:playerX,y:playerY-playerRadius,r:4,vy:8});}}
function draw(){background(255,230,0);for(let i=0;i<stars.length;i++){let st=stars[i];fill(255);noStroke();ellipse(st.x,st.y,st.s,st.s);st.y+=st.vy;if(st.y>canvasH){st.y=-st.s;st.x=random(0,canvasW);}}if(!gameOver){if(keyIsDown(LEFT_ARROW)){playerX-=playerSpeed;}if(keyIsDown(RIGHT_ARROW)){playerX+=playerSpeed;}playerX=constrain(playerX,playerRadius,canvasW-playerRadius);}for(let i=bullets.length-1;i>=0;i--){let b=bullets[i];fill(0);noStroke();ellipse(b.x,b.y,b.r*2,b.r*2);b.y-=b.vy;if(b.y<-b.r){bullets.splice(i,1);}}for(let i=enemies.length-1;i>=0;i--){let e=enemies[i];fill(200,0,0);noStroke();ellipse(e.x,e.y,e.r*2,e.r*2);e.y+=e.vy;e.fireCooldown--;if(e.fireCooldown<=0){let angle=atan2(playerY-e.y,playerX-e.x)+random(-PI/6,PI/6);let speed=random(2,4);spawnEnemyBullet(e.x,e.y,angle,speed);e.fireCooldown=floor(random(60,180));}if(e.y>canvasH+e.r){enemies.splice(i,1);}else{let dx=e.x-playerX;let dy=e.y-playerY;let dist2=dx*dx+dy*dy;let sumr=e.r+playerRadius;if(dist2<=sumr*sumr){spawnParticles(playerX,playerY);enemies.splice(i,1);playerHits++;if(playerHits>=maxHits){gameOver=true;}}}}for(let i=enemies.length-1;i>=0;i--){let e=enemies[i];let hit=false;for(let j=bullets.length-1;j>=0;j--){let b=bullets[j];let dx=e.x-b.x;let dy=e.y-b.y;let dist2=dx*dx+dy*dy;let sumr=e.r+b.r;if(dist2<=sumr*sumr){enemies.splice(i,1);bullets.splice(j,1);spawnParticles(e.x,e.y);score++;hit=true;break;}}if(hit)continue;}for(let i=enemyBullets.length-1;i>=0;i--){let eb=enemyBullets[i];fill(0);noStroke();ellipse(eb.x,eb.y,eb.r*2,eb.r*2);eb.x+=eb.vx;eb.y+=eb.vy;if(eb.x<-eb.r||eb.x>canvasW+eb.r||eb.y<-eb.r||eb.y>canvasH+eb.r){enemyBullets.splice(i,1);continue;}let dx=eb.x-playerX;let dy=eb.y-playerY;let dist2=dx*dx+dy*dy;let sumr=eb.r+playerRadius;if(dist2<=sumr*sumr){enemyBullets.splice(i,1);spawnParticles(playerX,playerY);playerHits++;if(playerHits>=maxHits){gameOver=true;}}}for(let i=particles.length-1;i>=0;i--){let p=particles[i];fill(255,150,0,200);noStroke();ellipse(p.x,p.y,p.r*2,p.r*2);p.x+=p.vx;p.y+=p.vy;p.life--;if(p.life<=0){particles.splice(i,1);}}fill(0,0,255);noStroke();triangle(playerX,playerY-playerRadius,playerX-playerRadius,playerY+playerRadius,playerX+playerRadius,playerY+playerRadius);fill(255);text('Score: '+score,8,8);text('Hits: '+playerHits+'/'+maxHits,8,28);if(!extraLifeGranted && score>=10){maxHits++;extraLifeGranted=true;}if(gameOver){textAlign(CENTER,CENTER);textSize(32);fill(255,0,0);text('GAME OVER',canvasW/2,canvasH/2);}if(!gameOver && frameCount%60===0){spawnEnemy();}}
