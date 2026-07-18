var canvasW=600;
var canvasH=400;
var groundHeight=20;
var gravity=0.6;
var maxFall=12;
var jumpVel=-11;
var player;
var platforms=[];
var coins=[];
var redCoin=null;
var score=0;
var gameOver=false;
function rectsOverlap(a,b){
  return !(a.x+a.w<=b.x||a.x>=b.x+b.w||a.y+a.h<=b.y||a.y>=b.y+b.h);
}
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
    var placed=false;
    var tries=0;
    var maxTries=200;
    if(i===0){
      y=lowestY;
      while(!placed&&tries<maxTries){
        x=floor(random(0,canvasW-w));
        var plat={x:x,y:y,w:w,h:10,isGround:false};
        var ov=false;
        for(var j=0;j<platforms.length;j++){
          if(rectsOverlap(plat,platforms[j])){ov=true;break;}
        }
        if(!ov){platforms.push(plat);placed=true;}else{tries++;}
      }
    } else {
      while(!placed&&tries<maxTries){
        x=floor(random(0,canvasW-w));
        y=floor(random(60,canvasH-groundHeight-80));
        var plat2={x:x,y:y,w:w,h:10,isGround:false};
        var ov2=false;
        for(var k=0;k<platforms.length;k++){
          if(rectsOverlap(plat2,platforms[k])){ov2=true;break;}
        }
        if(!ov2){platforms.push(plat2);placed=true;}else{tries++;}
      }
      if(!placed){
        for(var sx=0;sx<=canvasW-w && !placed;sx+=10){
          x=sx;
          y=floor(random(60,canvasH-groundHeight-80));
          var plat3={x:x,y:y,w:w,h:10,isGround:false};
          var ov3=false;
          for(var m=0;m<platforms.length;m++){
            if(rectsOverlap(plat3,platforms[m])){ov3=true;break;}
          }
          if(!ov3){platforms.push(plat3);placed=true;break;}
        }
      }
    }
  }
}
function createCoins(){
  coins=[];
  var total=floor(random(8,11));
  for(var i=0;i<total;i++){
    var placed=false;
    var tries=0;
    while(!placed&&tries<200){
      if(random()<0.6 && platforms.length>1){
        var pidx=floor(random(1,platforms.length));
        var plat=platforms[pidx];
        if(plat.w>16){
          var cx=floor(random(plat.x+8,plat.x+plat.w-8));
          var cy=plat.y-10;
          coins.push({x:cx,y:cy,r:8});
          placed=true;
        } else {tries++;}
      } else {
        var cx2=floor(random(20,canvasW-20));
        var cy2=floor(random(40,canvasH-groundHeight-120));
        coins.push({x:cx2,y:cy2,r:8});
        placed=true;
      }
    }
    if(!placed){
      var cx3=floor(random(20,canvasW-20));
      var cy3=floor(random(40,canvasH-groundHeight-120));
      coins.push({x:cx3,y:cy3,r:8});
    }
  }
}
function createRedCoin(){
  redCoin=null;
  if(platforms.length>1){
    var idx=floor(random(1,platforms.length));
    var plat=platforms[idx];
    var left=plat.x+10;
    var right=plat.x+plat.w-10;
    if(right-left<10){left=plat.x+2;right=plat.x+plat.w-2;}
    var rx=floor(random(left,right));
    var ry=plat.y-10;
    redCoin={x:rx,y:ry,r:10,vx:1.6,dir:random()<0.5?1:-1,left:left,right:right,platIndex:idx};
  }
}
function resetGame(){
  score=0;
  gameOver=false;
  createPlatforms();
  createCoins();
  createRedCoin();
  player={x:50,y:canvasH-groundHeight-30,w:30,h:30,vx:0,vy:0,speed:3,onGround:true,hasTouchedPlatform:false,jumpsRemaining:2};
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
        player.jumpsRemaining=2;
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
  if(player.vy>maxFall){player.vy=maxFall;}
  player.y+=player.vy;
  if(player.x<0){player.x=0;}
  if(player.x+player.w>canvasW){player.x=canvasW-player.w;}
  applyPlatformCollisions();
}
function updateRedCoin(){
  if(!redCoin || gameOver){return;}
  redCoin.x+=redCoin.vx*redCoin.dir;
  if(redCoin.x<redCoin.left){redCoin.x=redCoin.left;redCoin.dir*=-1;}
  if(redCoin.x>redCoin.right){redCoin.x=redCoin.right;redCoin.dir*=-1;}
  var plat=platforms[redCoin.platIndex];
  if(plat){redCoin.y=plat.y-redCoin.r;}
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
  if(redCoin && !gameOver){
    var rx=redCoin.x;
    var ry=redCoin.y;
    var rr=redCoin.r;
    var rovr=(player.x<rx+rr && player.x+player.w>rx-rr && player.y<ry+rr && player.y+player.h>ry-rr);
    if(rovr){
      gameOver=true;
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
  if(redCoin){
    fill(200,50,50);
    ellipse(redCoin.x,redCoin.y,redCoin.r*2,redCoin.r*2);
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
  updateRedCoin();
  checkCoinCollisions();
  drawScene();
}
function keyPressed(){
  if((keyCode===UP_ARROW || keyCode===38) && !gameOver){
    if(player.jumpsRemaining>0){
      player.vy=jumpVel;
      player.onGround=false;
      player.jumpsRemaining--;
    }
  }
  if(key==='r' || key==='R' || keyCode===82){
    resetGame();
  }
}
