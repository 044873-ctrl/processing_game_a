let COLS=10;
let ROWS=20;
let SIZE=30;
let canvasW=COLS*SIZE;
let canvasH=ROWS*SIZE;
let grid=[];
let pieces=[];
let colors=[];
let current=null;
let score=0;
let dropCounter=0;
let normalDrop=30;
let fastDrop=5;
let gameOver=false;
function copyMatrix(m){let out=[];for(let r=0;r<4;r++){out[r]=m[r].slice();}return out;}
function rotateMatrix(m){let out=[];for(let r=0;r<4;r++){out[r]=[0,0,0,0];}for(let r=0;r<4;r++){for(let c=0;c<4;c++){out[c][3-r]=m[r][c];}}return out;}
function collision(mat,x,y){for(let r=0;r<4;r++){for(let c=0;c<4;c++){if(mat[r][c]===1){let gx=x+c;let gy=y+r;if(gx<0||gx>=COLS) return true;if(gy>=ROWS) return true;if(gy>=0){if(grid[gy][gx]!==0) return true;}}}}return false;}
function createNewPiece(){let idx=floor(random(0,pieces.length));let mat=copyMatrix(pieces[idx]);let x=Math.floor((COLS-4)/2);let y=0;current={mat:mat,x:x,y:y,idx:idx};if(collision(current.mat,current.x,current.y)){gameOver=true;}}
function lockPiece(){for(let r=0;r<4;r++){for(let c=0;c<4;c++){if(current.mat[r][c]===1){let gx=current.x+c;let gy=current.y+r;if(gy>=0&&gy<ROWS&&gx>=0&&gx<COLS){grid[gy][gx]=current.idx+1;}}}}for(let i=ROWS-1;i>=0;i--){let full=true;for(let j=0;j<COLS;j++){if(grid[i][j]===0){full=false;break;}}if(full){grid.splice(i,1);let newRow=new Array(COLS);for(let k=0;k<COLS;k++){newRow[k]=0;}grid.unshift(newRow);score+=100;}}createNewPiece();dropCounter=0;}
function setup(){createCanvas(canvasW,canvasH);for(let r=0;r<ROWS;r++){let row=[];for(let c=0;c<COLS;c++){row[c]=0;}grid[r]=row;}pieces=[[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]]];colors=["#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000","#ff0000"];createNewPiece();textSize(16);textAlign(LEFT,TOP);}
function rotateCurrent(){if(gameOver) return;let rotated=rotateMatrix(current.mat);let kicked=false;let offsets=[0,-1,1,-2,2];for(let i=0;i<offsets.length;i++){let ox=offsets[i];if(!collision(rotated,current.x+ox,current.y)){current.mat=rotated;current.x+=ox;kicked=true;break;}}}
function moveCurrent(dx){if(gameOver) return;if(!collision(current.mat,current.x+dx,current.y)){current.x+=dx;}}
function dropStep(){if(gameOver) return;if(!collision(current.mat,current.x,current.y+1)){current.y+=1;}else{lockPiece();}}
function draw(){background(0);stroke(50);for(let r=0;r<ROWS;r++){for(let c=0;c<COLS;c++){let val=grid[r][c];if(val===0){fill(20);}else{fill(colors[val-1]);}rect(c*SIZE,r*SIZE,SIZE,SIZE);}}if(current!==null){for(let r=0;r<4;r++){for(let c=0;c<4;c++){if(current.mat[r][c]===1){let gx=current.x+c;let gy=current.y+r;if(gy>=0){fill(colors[current.idx]);rect(gx*SIZE,gy*SIZE,SIZE,SIZE);}}}}}let interval=normalDrop;if(keyIsDown(DOWN_ARROW)) interval=fastDrop;if(!gameOver){dropCounter++;if(dropCounter>=interval){dropStep();dropCounter=0;}}noStroke();fill(255);text("Score: "+score,5,5);if(gameOver){fill(255,0,0);textAlign(CENTER,CENTER);text("Game Over",canvasW/2,canvasH/2);textAlign(LEFT,TOP);}}
function keyPressed(){if(gameOver) return;if(keyCode===LEFT_ARROW){moveCurrent(-1);dropCounter=0;}else if(keyCode===RIGHT_ARROW){moveCurrent(1);dropCounter=0;}else if(keyCode===UP_ARROW){rotateCurrent();dropCounter=0;}else if(keyCode===DOWN_ARROW){dropStep();dropCounter=0;}}
