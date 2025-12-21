var player = {};
var bullets = [];
var enemies = [];
var particles = [];
var stars = [];
var score = 0;
var gameOver = false;
var frameCounter = 0;
function setup(){
  createCanvas(400,600);
  player.x = width/2;
  player.y = height - 30;
  player.r = 12;
  player.speed = 5;
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  frameCounter = 0;
  for(var i=0;i<30;i++){
    var s = {
      x: random(0,width),
      y: random(0,height),
      r: random(1,3),
      speed: random(0.5,2)
    };
    stars.push(s);
  }
  textSize(18);
  textAlign(LEFT,TOP);
  noStroke();
}
function draw(){
  background(0);
  for(var si=0;si<stars.length;si++){
    var st = stars[si];
    fill(255);
    ellipse(st.x,st.y,st.r,st.r);
    st.y += st.speed;
    if(st.y > height){
      st.y = 0;
      st.x = random(0,width);
    }
  }
  frameCounter++;
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.speed;
    }
    player.x = constrain(player.x, player.r, width - player.r);
    if(frameCounter % 60 === 0){
      var en = {
        x: random(12, width-12),
        y: -12,
        r: 12,
        vy: 2
      };
      enemies.push(en);
    }
    for(var bIndex = bullets.length-1;bIndex>=0;bIndex--){
      var b = bullets[bIndex];
      b.y -= 8;
      if(b.y < -b.r){
        bullets.splice(bIndex,1);
        continue;
      }
    }
    for(var eIndex = enemies.length-1;eIndex>=0;eIndex--){
      var e = enemies[eIndex];
      e.y += e.vy;
      if(e.y > height + e.r){
        enemies.splice(eIndex,1);
        continue;
      }
    }
    for(var ei = enemies.length-1; ei>=0; ei--){
      var enemy = enemies[ei];
      for(var bi = bullets.length-1; bi>=0; bi--){
        var bullet = bullets[bi];
        var dx = enemy.x - bullet.x;
        var dy = enemy.y - bullet.y;
        var dist = sqrt(dx*dx + dy*dy);
        if(dist <= enemy.r + bullet.r){
          score++;
          for(var k=0;k<5;k++){
            var p = {
              x: enemy.x,
              y: enemy.y,
              r: 3,
              life: 20,
              dx: random(-2,2),
              dy: random(-2,2)
            };
            particles.push(p);
          }
          bullets.splice(bi,1);
          enemies.splice(ei,1);
          break;
        }
      }
    }
    for(var pi=particles.length-1;pi>=0;pi--){
      var p = particles[pi];
      p.x += p.dx;
      p.y += p.dy;
      p.life--;
      if(p.life <= 0){
        particles.splice(pi,1);
      }
    }
    for(var i=enemies.length-1;i>=0;i--){
      var enm = enemies[i];
      var dxp = enm.x - player.x;
      var dyp = enm.y - player.y;
      var dp = sqrt(dxp*dxp + dyp*dyp);
      if(dp <= enm.r + player.r){
        gameOver = true;
        break;
      }
    }
  } else {
    for(var pi2=particles.length-1;pi2>=0;pi2--){
      var p2 = particles[pi2];
      p2.x += p2.dx;
      p2.y += p2.dy;
      p2.life--;
      if(p2.life <= 0){
        particles.splice(pi2,1);
      }
    }
  }
  fill(255);
  for(var i=0;i<bullets.length;i++){
    var bb = bullets[i];
    ellipse(bb.x,bb.y,bb.r*2,bb.r*2);
  }
  fill(200,50,50);
  for(var i=0;i<enemies.length;i++){
    var ee = enemies[i];
    ellipse(ee.x,ee.y,ee.r*2,ee.r*2);
  }
  fill(255,200,0);
  ellipse(player.x,player.y,player.r*2,player.r*2);
  for(var i=0;i<particles.length;i++){
    var pp = particles[i];
    var alpha = map(pp.life,0,20,0,255);
    fill(255,150,0,alpha);
    ellipse(pp.x,pp.y,pp.r*2,pp.r*2);
  }
  fill(255);
  text("SCORE: " + score,8,8);
  if(gameOver){
    fill(255,0,0);
    textSize(36);
    textAlign(CENTER,CENTER);
    text("GAME OVER", width/2, height/2);
    textSize(18);
    textAlign(LEFT,TOP);
  }
}
function keyPressed(){
  if(keyCode === 32 && !gameOver){
    var bl = {
      x: player.x,
      y: player.y - player.r - 4,
      r: 4
    };
    bullets.push(bl);
  }
}
