const PI=Math.PI
function abs(v){return v<0?-v:v}
function floor(v){return Math.floor(v)}
function constrain(v,a,b){if(v<a)return a; if(v>b)return b; return v}
function map(value,start1,stop1,start2,stop2){return start2+(stop2-start2)*((value-start1)/(stop1-start1))}
function random(a,b){if(b===undefined){if(Array.isArray(a)){return a[floor(Math.random()*a.length)]}return Math.random()*a}return Math.random()*(b-a)+a}
let canvasW=400,canvasH=600
let paddle
let balls=[]
let blocks=[]
let particles=[]
let rows=6,cols=7
let score=0
let gameOver=false
function initBlocks(){blocks=[];let marginX=20;let gap=5;let blockW=(canvasW-marginX*2-gap*(cols-1))/cols;let blockH=20;let colors=["#FF6B6B","#FFB86B","#FFD36E","#8AE29D","#6BD1FF","#C29BFF"];for(let r=0;r<rows;r++){for(let c=0;c<cols;c++){let x=marginX+c*(blockW+gap);let y=40+r*(blockH+gap);let color=colors[r%colors.length];blocks.push({x:x,y:y,w:blockW,h:blockH,color:color,row:r,col:c});}}}
function spawnParticles(x,y){for(let i=0;i<6;i++){let angle=random(0,PI*2);let speed=random(1,3);let vx=Math.cos(angle)*speed;let vy=Math.sin(angle)*speed;let life=20;let col=[floor(random([255,200,150,100])),floor(random([100,150,200])),floor(random([50,100,200]))];particles.push({x:x,y:y,vx:vx,vy:vy,life:life,maxLife:life,r:2,col:col});}}
function circleRectCollision(cx,cy,cr,rx,ry,rw,rh){let closestX=constrain(cx,rx,rx+rw);let closestY=constrain(cy,ry,ry+rh);let dx=cx-closestX;let dy=cy-closestY;return dx*dx+dy*dy<=cr*cr}
function setup(){createCanvas(canvasW,canvasH);paddle={w:90,h:12,x:(canvasW-90)/2,y:canvasH-40};balls=[];balls.push({x:canvasW/2-10,y:canvasH-60,r:6,vx:3,vy:-5,active:true});balls.push({x:canvasW/2+10,y:canvasH-60,r:6,vx:-3,vy:-4.5,active:true});initBlocks();particles=[];textFont("sans-serif")}
function draw(){background(30);if(!gameOver){paddle.x=constrain(mouseX-paddle.w/2,0,canvasW-paddle.w)}fill(200);noStroke();rect(paddle.x,paddle.y,paddle.w,paddle.h,4);for(let bi=0;bi<balls.length;bi++){let ball=balls[bi];if(ball.active && !gameOver){ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x-ball.r<0){ball.x=ball.r;ball.vx*=-1}if(ball.x+ball.r>canvasW){ball.x=canvasW-ball.r;ball.vx*=-1}if(ball.y-ball.r<0){ball.y=ball.r;ball.vy*=-1}if(ball.y-ball.r>canvasH){ball.active=false}}fill(255,220,0);ellipse(ball.x,ball.y,ball.r*2,ball.r*2);if(ball.active && !gameOver){for(let i=blocks.length-1;i>=0;i--){let b=blocks[i];if(circleRectCollision(ball.x,ball.y,ball.r,b.x,b.y,b.w,b.h)){blocks.splice(i,1);score+=10;spawnParticles(b.x+b.w/2,b.y+b.h/2);ball.y+=ball.vy<0?-1:1;ball.vy*=-1;let speed=Math.sqrt(ball.vx*ball.vx+ball.vy*ball.vy);if(speed<0.5){speed=0.5}break}}if(circleRectCollision(ball.x,ball.y,ball.r,paddle.x,paddle.y,paddle.w,paddle.h) && ball.vy>0){let relative=(ball.x-(paddle.x+paddle.w/2))/(paddle.w/2);if(relative<-1){relative=-1}else if(relative>1){relative=1}let maxAngle=PI/3;let angle=relative*maxAngle;let speed=Math.sqrt(ball.vx*ball.vx+ball.vy*ball.vy);if(speed<0.5){speed=0.5}ball.vx=speed*Math.sin(angle);ball.vy=-abs(speed*Math.cos(angle));ball.y=paddle.y-ball.r-0.1}}}for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.x+=p.vx;p.y+=p.vy;p.life--;let alpha=floor(map(p.life,0,p.maxLife,0,255));fill(p.col[0],p.col[1],p.col[2],alpha);noStroke();ellipse(p.x,p.y,p.r*2,p.r*2);if(p.life<=0){particles.splice(i,1)}}let allInactive=true;for(let i=0;i<balls.length;i++){if(balls[i].active){allInactive=false;break}}fill(255);textSize(16);textAlign(LEFT,TOP);text("Score: "+score,10,10);if(allInactive && !gameOver){gameOver=true}if(gameOver){fill(255);textSize(36);textAlign(CENTER,CENTER);text("Game Over",canvasW/2,canvasH/2);textSize(14);textAlign(CENTER,TOP);text("Click to restart",canvasW/2,canvasH/2+30)}}
function mousePressed(){if(gameOver){score=0;gameOver=false;initBlocks();balls=[];balls.push({x:canvasW/2-10,y:canvasH-60,r:6,vx:3,vy:-5,active:true});balls.push({x:canvasW/2+10,y:canvasH-60,r:6,vx:-3,vy:-4.5,active:true});particles=[]}}
