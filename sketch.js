let players=[];
let numPlayers=4;
let humanIndex=0;
let currentTurn=0;
let deck=[];
let jokerRank=0;
let aiDelay=40;
let aiTimer=0;
let gameOver=false;
let loserIndex=-1;
function shuffleArray(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));let t=a[i];a[i]=a[j];a[j]=t;}}
function initGame(){deck=[];for(let r=1;r<=12;r++){deck.push({r:r});deck.push({r:r});}deck.push({r:0});shuffleArray(deck);players=[];for(let p=0;p<numPlayers;p++){players.push({hand:[]});}let idx=0;while(deck.length>0){let card=deck.pop();players[idx%numPlayers].hand.push(card);idx++;}for(let p=0;p<numPlayers;p++){removePairs(players[p]);}currentTurn=0;aiTimer=0;gameOver=false;loserIndex=-1;}
function removePairs(player){let groups={};for(let i=0;i<player.hand.length;i++){let r=player.hand[i].r; if(groups[r]===undefined){groups[r]=[];}groups[r].push(player.hand[i]);}let newHand=[];let keys=Object.keys(groups);for(let k=0;k<keys.length;k++){let rk=parseInt(keys[k]);let arr=groups[rk];if(rk===0){for(let m=0;m<arr.length;m++){newHand.push(arr[m]);}}else{if(arr.length%2===1){newHand.push(arr[0]);}}}player.hand=newHand;}
function nextAlive(from){for(let offset=1;offset<numPlayers;offset++){let idx=(from+offset)%numPlayers; if(players[idx].hand.length>0){return idx;}}return -1;}
function totalCardsRemaining(){let sum=0;for(let i=0;i<players.length;i++){sum+=players[i].hand.length;}return sum;}
function advanceTurn(){for(let k=1;k<=numPlayers;k++){currentTurn=(currentTurn+1)%numPlayers; if(players[currentTurn].hand.length>0){return;}}}
function drawFrom(targetIdx,pickerIdx,chosenIndex){if(targetIdx<0||pickerIdx<0) return; if(players[targetIdx].hand.length===0) return; if(chosenIndex===undefined){chosenIndex=Math.floor(Math.random()*players[targetIdx].hand.length);}let card=players[targetIdx].hand.splice(chosenIndex,1)[0];players[pickerIdx].hand.push(card);removePairs(players[pickerIdx]);if(totalCardsRemaining()===1){gameOver=true;for(let i=0;i<players.length;i++){if(players[i].hand.length>0){loserIndex=i;break;}}}}
function setup(){createCanvas(800,600);initGame();textFont("Arial");textSize(16);}
function draw(){background(30);fill(255);noStroke();for(let i=0;i<numPlayers;i++){let x=50+ (i*(width-100)/(numPlayers-1));let y=80;textAlign(CENTER);let label=(i===humanIndex)?"You":"AI"+(i);text(label,x,y-40);rectMode(CENTER);fill(currentTurn===i?100:180);rect(x,y,120,60,8);fill(255);text("Cards: "+players[i].hand.length,x,y+4);if(i===humanIndex){let hx=50;let hy=height-140;textAlign(LEFT);text("Your hand:",hx,hy);for(let j=0;j<players[i].hand.length;j++){let cx=hx+ j*40;fill(60,140,220);rect(cx+20,hy+30,36,52,6);fill(255);textAlign(CENTER);text(players[i].hand[j].r===0?"J":players[i].hand[j].r,cx+20,hy+36);}}}fill(255);textAlign(LEFT);text("Click center AI box to draw from them when it's your turn.",20,20);if(gameOver){let msg=(loserIndex===humanIndex)?"You lost (Old Maid)!":"Player "+loserIndex+" lost (Old Maid).";textAlign(CENTER);text(msg,width/2,height/2);textAlign(LEFT);text("Click anywhere to restart.",20,40);}else{if(currentTurn!==humanIndex){aiTimer++;if(aiTimer>=aiDelay){aiTimer=0;let target=nextAlive(currentTurn);if(target!==-1){drawFrom(target,currentTurn);}if(!gameOver){advanceTurn();}}}}}
function mousePressed(){if(gameOver){initGame();return;}if(currentTurn===humanIndex){let target=nextAlive(humanIndex);if(target===-1) return;let tx=50+ (target*(width-100)/(numPlayers-1));let ty=80;if(mouseX>tx-60 && mouseX<tx+60 && mouseY>ty-30 && mouseY<ty+30){drawFrom(target,humanIndex);if(!gameOver){advanceTurn();}}}}
