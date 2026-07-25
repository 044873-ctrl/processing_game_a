let canvasW=600;
let canvasH=400;
let player;
let bullets=[];
let enemies=[];
let spawnTimer=0;
let spawnInterval=40;
let score=0;
let lives=3;
let gameOver=false;
let leftPressed=false;
let rightPressed=false;
let shootPressed=false;
let shootCooldown=0;
let maxShootCooldown=12;
function setup(){
createCanvas(canvasW,canvasH);
player={x:canvasW/2,y:canvasH-30,size:24,speed:5};
}
function draw(){
background(30);
if(!gameOver){
if(leftPressed){player.x-=player.speed;}
if(rightPressed){player.x+=player.speed;}
if(player.x<player.size/2){player.x=player.size/2;}
if(player.x>canvasW-player.size/2){player.x=canvasW-player.size/2;}
if(shootPressed&&shootCooldown<=0){
let bx={x:player.x,y:player.y-player.size/2-6,r:4,speed:7};
bullets.push(bx);
shootCooldown=maxShootCooldown;
}
if(shootCooldown>0){shootCooldown--; if(shootCooldown<0){shootCooldown=0;}}
spawnTimer++;
if(spawnTimer>=spawnInterval){
spawnTimer=0;
let ex={x:random(20,canvasW-20),y:-10,r:random(10,22),speed:random(1.6,3.2)};
enemies.push(ex);
}
for(let i=bullets.length-1;i>=0;i--){
let b=bullets[i];
b.y-=b.speed;
if(b.y<-10){bullets.splice(i,1);continue;}
}
for(let i=enemies.length-1;i>=0;i--){
let e=enemies[i];
e.y+=e.speed;
if(e.y>canvasH+50){enemies.splice(i,1); lives--; if(lives<=0){gameOver=true;} continue;}
for(let j=bullets.length-1;j>=0;j--){
let b=bullets[j];
let dx=b.x-e.x;let dy=b.y-e.y;let distSq=dx*dx+dy*dy;let radSum=(b.r+e.r);
if(distSq<=radSum*radSum){
bullets.splice(j,1);
enemies.splice(i,1);
score+=1;
break;
}
}
}
for(let i=enemies.length-1;i>=0;i--){
let e=enemies[i];let dx=e.x-player.x;let dy=e.y-player.y;let distSq=dx*dx+dy*dy;let radSum=(e.r+player.size/2);
if(distSq<=radSum*radSum){enemies.splice(i,1);lives--; if(lives<=0){gameOver=true;}}
}
}
fill(200);
rectMode(CENTER);
rect(player.x,player.y,player.size,player.size);
for(let i=0;i<bullets.length;i++){let b=bullets[i];fill(255,200,50);noStroke();ellipse(b.x,b.y,b.r*2,b.r*2);}
for(let i=0;i<enemies.length;i++){let e=enemies[i];fill(200,60,60);noStroke();ellipse(e.x,e.y,e.r*2,e.r*2);}
fill(255);noStroke();textSize(16);textAlign(LEFT,TOP);text('Score: '+score,8,8);text('Lives: '+lives,8,28);
if(gameOver){textAlign(CENTER,CENTER);textSize(32);text('GAME OVER',canvasW/2,canvasH/2-20);textSize(16);text('Press R to restart',canvasW/2,canvasH/2+16);}
}
function keyPressed(){if(keyCode===LEFT||key==='a'||key==='A'){leftPressed=true;}if(keyCode===RIGHT||key==='d'||key==='D'){rightPressed=true;}if(key===' '){shootPressed=true;}if(key==='r'||key==='R'){if(gameOver){resetGame();}}}
function keyReleased(){if(keyCode===LEFT||key==='a'||key==='A'){leftPressed=false;}if(keyCode===RIGHT||key==='d'||key==='D'){rightPressed=false;}if(key===' '){shootPressed=false;}}
function resetGame(){enemies=[];bullets=[];score=0;lives=3;gameOver=false;player.x=canvasW/2;spawnTimer=0;shootCooldown=0;}
