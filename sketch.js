const GRID = 8;
const CELL = 50;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;
let board = [];
let currentPlayer = BLACK;
let gameOver = false;
const dirs = [
  {x:1,y:0},
  {x:1,y:1},
  {x:0,y:1},
  {x:-1,y:1},
  {x:-1,y:0},
  {x:-1,y:-1},
  {x:0,y:-1},
  {x:1,y:-1}
];
function inBounds(x,y){
  return x>=0 && x<GRID && y>=0 && y<GRID;
}
function opponent(color){
  if(color===BLACK){return WHITE;}
  return BLACK;
}
function tilesToFlip(x,y,color){
  let flipsAll = [];
  if(!inBounds(x,y)){return flipsAll;}
  if(board[y][x]!==EMPTY){return flipsAll;}
  for(let i=0;i<dirs.length;i++){
    let dx = dirs[i].x;
    let dy = dirs[i].y;
    let nx = x+dx;
    let ny = y+dy;
    let flipsDir = [];
    if(!inBounds(nx,ny)){continue;}
    if(board[ny][nx]!==opponent(color)){continue;}
    while(inBounds(nx,ny) && board[ny][nx]===opponent(color)){
      flipsDir.push({x:nx,y:ny});
      nx += dx;
      ny += dy;
    }
    if(inBounds(nx,ny) && board[ny][nx]===color && flipsDir.length>0){
      for(let j=0;j<flipsDir.length;j++){
        flipsAll.push(flipsDir[j]);
      }
    }
  }
  return flipsAll;
}
function hasAnyValidMove(color){
  for(let y=0;y<GRID;y++){
    for(let x=0;x<GRID;x++){
      let flips = tilesToFlip(x,y,color);
      if(flips.length>0){return true;}
    }
  }
  return false;
}
function applyMove(x,y,color){
  let flips = tilesToFlip(x,y,color);
  if(flips.length===0){return false;}
  board[y][x]=color;
  for(let i=0;i<flips.length;i++){
    let fx = flips[i].x;
    let fy = flips[i].y;
    board[fy][fx]=color;
  }
  return true;
}
function aiMove(){
  let safety = 0;
  while(safety<64){
    safety++;
    if(!hasAnyValidMove(WHITE)){
      if(!hasAnyValidMove(BLACK)){gameOver=true;return;}
      currentPlayer = BLACK;
      return;
    }
    let bestMoves = [];
    let bestScore = -1;
    for(let y=0;y<GRID;y++){
      for(let x=0;x<GRID;x++){
        if(board[y][x]!==EMPTY){continue;}
        let flips = tilesToFlip(x,y,WHITE);
        if(flips.length>0){
          if(flips.length>bestScore){
            bestScore = flips.length;
            bestMoves = [{x:x,y:y,flips:flips}];
          } else if(flips.length===bestScore){
            bestMoves.push({x:x,y:y,flips:flips});
          }
        }
      }
    }
    if(bestMoves.length===0){
      if(!hasAnyValidMove(BLACK)){gameOver=true;return;}
      currentPlayer = BLACK;
      return;
    }
    let choiceIndex = Math.floor(Math.random()*bestMoves.length);
    let mv = bestMoves[choiceIndex];
    applyMove(mv.x,mv.y,WHITE);
    currentPlayer = BLACK;
    if(hasAnyValidMove(BLACK)){
      return;
    } else {
      currentPlayer = WHITE;
      continue;
    }
  }
  gameOver = true;
}
function initBoard(){
  board = [];
  for(let y=0;y<GRID;y++){
    let row = [];
    for(let x=0;x<GRID;x++){
      row.push(EMPTY);
    }
    board.push(row);
  }
  let m = GRID/2;
  board[m-1][m-1]=WHITE;
  board[m][m]=WHITE;
  board[m-1][m]=BLACK;
  board[m][m-1]=BLACK;
  currentPlayer = BLACK;
  gameOver = false;
}
function setup(){
  createCanvas(400,400);
  initBoard();
}
function draw(){
  background(34,139,34);
  stroke(0);
  for(let i=0;i<=GRID;i++){
    line(i*CELL,0,i*CELL,GRID*CELL);
    line(0,i*CELL,GRID*CELL,i*CELL);
  }
  for(let y=0;y<GRID;y++){
    for(let x=0;x<GRID;x++){
      let v = board[y][x];
      if(v===BLACK){
        fill(0);
        noStroke();
        ellipseMode(CORNER);
        ellipse(x*CELL+4,y*CELL+4,CELL-8,CELL-8);
      } else if(v===WHITE){
        fill(255);
        noStroke();
        ellipseMode(CORNER);
        ellipse(x*CELL+4,y*CELL+4,CELL-8,CELL-8);
      }
    }
  }
  if(!gameOver && currentPlayer===BLACK){
    noStroke();
    fill(255,255,0,180);
    for(let y=0;y<GRID;y++){
      for(let x=0;x<GRID;x++){
        let flips = tilesToFlip(x,y,BLACK);
        if(flips.length>0){
          ellipseMode(CENTER);
          ellipse(x*CELL+CELL/2,y*CELL+CELL/2,10,10);
        }
      }
    }
  }
  let blackCount = 0;
  let whiteCount = 0;
  for(let y=0;y<GRID;y++){
    for(let x=0;x<GRID;x++){
      if(board[y][x]===BLACK){blackCount++;}
      if(board[y][x]===WHITE){whiteCount++;}
    }
  }
  fill(255);
  stroke(0);
  textSize(14);
  textAlign(LEFT,TOP);
  text(
