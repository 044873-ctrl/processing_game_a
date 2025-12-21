let canvasW = 400;
let canvasH = 600;
let paddleW = 90;
let paddleH = 12;
let paddleX = 0;
let paddleY = 0;
let ball = {};
let ballRadius = 6;
let blocks = [];
let particles = [];
let rows = 6;
let cols = 7;
let blockPadding = 6;
let blockOffsetTop = 60;
let blockOffsetLeft = 6;
let blockW = 0;
let blockH = 18;
let colors = [];
let score = 0;
let gameOver = false;
function setup(){
  createCanvas(canvasW, canvasH);
  paddleY = height - 40;
  paddleX = (width - paddleW) / 2;
  ball.x = width / 2;
  ball.y = paddleY - ballRadius - 1;
  ball.vx = 4;
  ball.vy = -5;
  ball.r = ballRadius;
  colors = ['#FF5733','#FFBD33','#75FF33','#33FFBD','#3375FF','#9B33FF'];
  blockW = Math.floor((width - (cols + 1) * blockPadding) / cols);
  blocks = [];
  for(let r = 0; r < rows; r++){
    for(let c = 0; c < cols; c++){
      let bx = blockPadding + c * (blockW + blockPadding);
      let by = blockOffsetTop + r * (blockH + blockPadding);
      let block = {x:bx,y:by,w:blockW,h:blockH,row:r};
      blocks.push(block);
    }
  }
  particles = [];
  score = 0;
  gameOver = false;
  textFont('Arial');
  textSize(16);
  noStroke();
}
function draw(){
  background(20);
  paddleX = constrain(mouseX - paddleW / 2, 0, width - paddleW);
  fill(200);
  rect(paddleX, paddleY, paddleW, paddleH, 4);
  if(!gameOver){
    ball.x += ball.vx;
    ball.y += ball.vy;
    if(ball.x - ball.r <= 0){
      ball.x = ball.r;
      ball.vx = -ball.vx;
    } else if(ball.x + ball.r >= width){
      ball.x = width - ball.r;
      ball.vx = -ball.vx;
    }
    if(ball.y - ball.r <= 0){
      ball.y = ball.r;
      ball.vy = -ball.vy;
    }
    if(ball.y - ball.r > height){
      gameOver = true;
      ball.vx = 0;
      ball.vy = 0;
    }
    if(ball.y + ball.r >= paddleY && ball.y - ball.r <= paddleY + paddleH){
      if(ball.x >= paddleX && ball.x <= paddleX + paddleW){
        let relative = ball.x - (paddleX + paddleW / 2);
        let norm = relative / (paddleW / 2);
        if(norm < -1) norm = -1;
        if(norm > 1) norm = 1;
        let maxAngle = PI / 3;
        let angle = norm * maxAngle;
        let speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        if(speed < 0.1) speed = 5;
        ball.vx = speed * Math.sin(angle);
        ball.vy = -Math.abs(speed * Math.cos(angle));
        ball.y = paddleY - ball.r - 0.1;
      }
    }
    for(let i = blocks.length - 1; i >= 0; i--){
      let b = blocks[i];
      let closestX = constrain(ball.x, b.x, b.x + b.w);
      let closestY = constrain(ball.y, b.y, b.y + b.h);
      let dx = ball.x - closestX;
      let dy = ball.y - closestY;
      if(dx * dx + dy * dy <= ball.r * ball.r){
        let centerX = b.x + b.w / 2;
        let centerY = b.y + b.h / 2;
        let diffX = ball.x - centerX;
        let diffY = ball.y - centerY;
        let overlapX = (b.w / 2 + ball.r) - Math.abs(diffX);
        let overlapY = (b.h / 2 + ball.r) - Math.abs(diffY);
        if(overlapX < overlapY){
          if(diffX > 0){
            ball.x += overlapX;
          } else {
            ball.x -= overlapX;
          }
          ball.vx = -ball.vx;
        } else {
          if(diffY > 0){
            ball.y += overlapY;
            ball.vy = -ball.vy;
          } else {
            ball.y -= overlapY;
            ball.vy = -ball.vy;
          }
        }
        for(let p = 0; p < 3; p++){
          let pvx = random(-2,2);
          let pvy = random(-2,2);
          let part = {x:ball.x,y:ball.y,vx:pvx,vy:pvy,life:15};
          particles.push(part);
        }
        blocks.splice(i,1);
        score += 10;
      }
    }
    for(let i = particles.length - 1; i >= 0; i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.life -= 1;
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
  }
  for(let i = 0; i < blocks.length; i++){
    let b = blocks[i];
    let col = colors[b.row % colors.length];
    fill(col);
    rect(b.x, b.y, b.w, b.h, 3);
  }
  fill(255);
  circle(ball.x, ball.y, ball.r * 2);
  for(let i = 0; i < particles.length; i++){
    let p = particles[i];
    let alpha = map(p.life,0,15,0,255);
    fill(255,180,80,alpha);
    circle(p.x, p.y, 4);
  }
  fill(255);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10);
  if(gameOver){
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(255, 220, 0);
    text('Game Over', width / 2, height / 2);
    textSize(16);
  }
}
