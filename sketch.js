var canvasW=600;
var canvasH=400;
var groundHeight=20;
var gravity=0.6;
var maxFall=12;
var jumpVel=-11;
var player;
var platforms=[];
var coins=[];
var score=0;
var gameOver=false;
function createPlatforms(){
  platforms=[];
  var ground={x:0,y:canvasH-groundHeight,w:canvasW,h:groundHeight,isGround:true};
  platforms.push(ground);
  var lowestY=canvasH-groundHeight-60;
  var w;
  var x;
  var y;
  for(var i=0;i<5;i++){
    w=floor(random(80,140));
    x=floor(random(0,canvasW-w));
    if(i===0){
      y=lowestY;
    } else {
      y=floor(random(60,canvasH-groundHeight-80));
    }
    var plat={x:x,y:y,w:w,h:10,isGround:false};
    platforms.push(plat);
  }
}
function createCoins(){
  coins=[];
  for(var i=1;i<platforms.length;i++){
    var plat=platforms[i];
    var cx=floor(random(plat.x+8,plat.x+plat.w-8));
    var cy=plat.y-10;
    var coin={x:cx,y:cy,r:8};
    coins.push(coin);
  }
  for(var j=0;j<3;j++){
    var cx2=floor(random(20,canvasW-20));
    var cy2=floor(random(40,canvasH-groundHeight-120));
    var coin2={x:cx2,y:cy2,r:8};
    coins.push(coin2);
  }
}
function resetGame(){
  score=0;
  gameOver=false;
  createPlatforms();
  createCoins();
  player={x:50,y:canvasH-groundHeight-30,w:30,h:30,vx:0,vy:0,speed:3,onGround:true,hasTouchedPlatform:false,jumps:0};
}
function setup(){
  createCanvas(canvasW,canvasH);
  resetGame();
  textFont('Arial');
}
function applyPlatformCollisions(){
  player.onGround=false;
  for(var i=0;i<platforms.length;i++){
    var plat=platforms[i];
    var prevY=player.y-player.vy;
    var prevTop=prevY;
    var prevBottom=prevY+player.h;
    var curTop=player.y;
    var curBottom=player.y+player.h;
    var horOverlap=(player.x+player.w>plat.x && player.x<plat.x+plat.w);
    if(horOverlap){
      if(player.vy>0 && prevBottom<=plat.y && curBottom>=plat.y){
        player.y=plat.y-player.h;
        player.vy=0;
        player.onGround=true;
        player.jumps=0;
        if(!plat.isGround){
          player.hasTouchedPlatform=true;
        } else {
          if(player.hasTouchedPlatform){
            gameOver=true;
          }
        }
      } else if(player.vy<0 && prevTop>=plat.y+plat.h && curTop<=plat.y+plat.h){
        player.y=plat.y+plat.h;
        player.vy=0;
      }
    }
  }
}
function updatePlayer(){
  if(gameOver){
    player.vx=0;
    player.vy=0;
    return;
  }
  if(keyIsDown(37)){
    player.x-=player.speed;
  }
  if(keyIsDown(39)){
    player.x+=player.speed;
  }
  player.vy+=gravity;
  if(player.vy>maxFall){
    player.vy=maxFall;
  }
  player.y+=player.vy;
  if(player.x<0){player.x=0;}
  if(player.x+player.w>canvasW){player.x=canvasW-player.w;}
  applyPlatformCollisions();
}
function checkCoinCollisions(){
  for(var i=coins.length-1;i>=0;i--){
    var c=coins[i];
    var cx=c.x;
    var cy=c.y;
    var r=c.r;
    var overlap=(player.x<cx+r && player.x+player.w>cx-r && player.y<cy+r && player.y+player.h>cy-r);
    if(overlap){
      coins.splice(i,1);
      score+=10;
    }
  }
}
function drawScene(){
  background(10,20,60);
  noStroke();
  fill(100);
  for(var i=0;i<platforms.length;i++){
    var p=platforms[i];
    rect(p.x,p.y,p.w,p.h);
  }
  for(var j=0;j<coins.length;j++){
    var co=coins[j];
    fill(255,204,0);
    ellipse(co.x,co.y,co.r*2,co.r*2);
  }
  fill(255);
  rect(player.x,player.y,player.w,player.h);
  fill(255);
  textSize(16);
  text('Score: '+score,10,20);
  if(gameOver){
    textSize(36);
    fill(255,50,50);
    textAlign(CENTER,CENTER);
    text('GAME OVER',canvasW/2,canvasH/2-20);
    textSize(16);
    text('Press R to Retry',canvasW/2,canvasH/2+10);
    textAlign(LEFT,BASELINE);
  }
}
function draw(){
  updatePlayer();
  checkCoinCollisions();
  drawScene();
}
function keyPressed(){
  if((key===' ' || keyCode===32) && !gameOver){
    if(player.onGround){
      player.vy=jumpVel;
      player.onGround=false;
      player.jumps=1;
    }
  }
  if(keyCode===38 && !gameOver){
    if(player.onGround){
      player.vy=jumpVel;
      player.onGround=false;
      player.jumps=1;
    } else if(player.jumps===1){
      player.vy=jumpVel;
      player.jumps=2;
    }
  }
  if(key==='r' || key==='R' || keyCode===82){
    resetGame();
  }
}
