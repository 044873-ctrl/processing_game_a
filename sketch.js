let deck=[];
let suits=["♠","♥","♦","♣"];
function createDeck(){let d=[];for(let r=3;r<=15;r++){for(let s=0;s<suits.length;s++){d.push({rank:r,suit:suits[s],id:r+"-"+s});}}return d;}
function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));let t=a[i];a[i]=a[j];a[j]=t;}}
let players=[];
let hands=[];
let finished=[];
let currentPlayer=0;
let humanIndex=0;
let currentPlay=null;
let lastPlayer=null;
let passCount=0;
let selected=[];
let winnerOrder=[];
let canvasW=800;
let canvasH=600;
function deal(){deck=createDeck();shuffle(deck);players=[];hands=[];finished=[];winnerOrder=[];for(let i=0;i<4;i++){hands.push([]);finished.push(false);}for(let i=0;i<deck.length;i++){hands[i%4].push(deck[i]);}for(let i=0;i<hands.length;i++){sortHand(hands[i]);}currentPlayer=0;currentPlay=null;lastPlayer=null;passCount=0;selected=[];}
function sortHand(hand){hand.sort(function(a,b){if(a.rank!==b.rank) return a.rank-b.rank;return a.suit<b.suit?-1:1;});}
function cardLabel(c){let r=c.rank;let s=c.suit;let lab="";if(r===11) lab="J";else if(r===12) lab="Q";else if(r===13) lab="K";else if(r===14) lab="A";else if(r===15) lab="2";else lab=String(r);return lab+""+s;}
function countActive(){let cnt=0;for(let i=0;i<hands.length;i++){if(!finished[i]) cnt++;}return cnt;}
function validSelection(indices,playerIdx){if(indices.length===0) return false;let ranks=[];for(let i=0;i<indices.length;i++){let idx=indices[i];if(idx<0||idx>=hands[playerIdx].length) return false;ranks.push(hands[playerIdx][idx].rank);}let first=ranks[0];for(let i=1;i<ranks.length;i++){if(ranks[i]!==first) return false;}let candidate={player:playerIdx,rank:first,count:indices.length};if(currentPlay===null) return true;if(candidate.count!==currentPlay.count) return false;return candidate.rank>currentPlay.rank;}
function playSelection(indices,playerIdx){let playRank=hands[playerIdx][indices[0]].rank;let removed=[];indices.sort(function(a,b){return b-a;});for(let i=0;i<indices.length;i++){removed.push(hands[playerIdx].splice(indices[i],1)[0]);}sortHand(hands[playerIdx]);currentPlay={player:playerIdx,rank:playRank,count:indices.length,cards:removed};lastPlayer=playerIdx;passCount=0;if(hands[playerIdx].length===0){finished[playerIdx]=true;winnerOrder.push(playerIdx);} }
function aiMove(i){if(finished[i]) return;let hand=hands[i];let groups={};for(let j=0;j<hand.length;j++){let r=hand[j].rank;if(groups[r]===undefined) groups[r]=[];groups[r].push(j);}let indicesToPlay=null;if(currentPlay===null){let bestRank=1000;let bestCount=1;for(let r in groups){let arr=groups[r];if(arr.length>0){let rankNum=Number(r);if(rankNum<bestRank || (rankNum===bestRank && arr.length>bestCount)){bestRank=rankNum;bestCount=arr.length;}}}if(bestRank!==1000){indicesToPlay=[groups[bestRank][0]];}} else {let neededCount=currentPlay.count;let candidateRank=1000;for(let r in groups){let arr=groups[r];if(arr.length>=neededCount){let rankNum=Number(r);if(rankNum>currentPlay.rank && rankNum<candidateRank){candidateRank=rankNum;}}}if(candidateRank!==1000){let arr=groups[candidateRank];indicesToPlay=[];for(let k=0;k<neededCount;k++){indicesToPlay.push(arr[k]);}}}if(indicesToPlay===null){passCount++;} else {playSelection(indicesToPlay,i);} }
function advanceTurn(){let active=countActive();if(active<=1){return;}let start=currentPlayer;let loops=0;while(true){currentPlayer=(currentPlayer+1)%hands.length;loops++;if(!finished[currentPlayer]) break;if(loops>100) break;}if(passCount>=countActive()-1 && lastPlayer!==null){currentPlayer=lastPlayer;currentPlay=null;passCount=0;lastPlayer=null;selected=[];}}
function mousePressedHandler(){if(mouseX>=canvasW-180 && mouseX<=canvasW-80 && mouseY>=20 && mouseY<=60){if(selected.length>0 && validSelection(selected,humanIndex)){playSelection(selected,humanIndex);selected=[];advanceTurn();}return;}if(mouseX>=canvasW-70 && mouseX<=canvasW-10 && mouseY>=20 && mouseY<=60){passCount++;advanceTurn();return;}let hand=hands[humanIndex];let cardW=50;let gap=20;let startX=(canvasW-(hand.length*(cardW+gap)-gap))/2;let y=canvasH-140;for(let i=0;i<hand.length;i++){let x=startX+i*(cardW+gap);if(mouseX>=x && mouseX<=x+cardW && mouseY>=y && mouseY<=y+70){let found=false;for(let j=0;j<selected.length;j++){if(selected[j]===i){selected.splice(j,1);found=true;break;}}if(!found){selected.push(i);}break;}}}
function drawTable(){background(34,139,34);fill(255);textSize(18);textAlign(LEFT,TOP);text("Daifugo - Simple",20,20);let infoX=canvasW-380;textAlign(LEFT,TOP);text("Current Player: "+currentPlayer,infoX,20);text("Passes: "+passCount,infoX,50);if(currentPlay!==null){text("Current Play: "+currentPlay.count+"x "+cardLabel({rank:currentPlay.rank,suit:""}),20,60);} else {text("Current Play: (none)",20,60);}for(let p=0;p<hands.length;p++){let labelY=120+p*30;textAlign(LEFT,TOP);text("Player "+p+(finished[p]?" (finished)":"")+" : "+hands[p].length+" cards",20,labelY);}fill(200);rect(canvasW-180,20,100,40,6);fill(0);textAlign(CENTER,CENTER);text("Play",canvasW-130,40);fill(200);rect(canvasW-70,20,60,40,6);fill(0);textAlign(CENTER,CENTER);text("Pass",canvasW-40,40);}
function drawHand(){let hand=hands[humanIndex];let cardW=50;let gap=20;let startX=(canvasW-(hand.length*(cardW+gap)-gap))/2;let y=canvasH-140;for(let i=0;i<hand.length;i++){let x=startX+i*(cardW+gap);let isSel=false;for(let j=0;j<selected.length;j++){if(selected[j]===i) {isSel=true;break;}}if(isSel){rect(x,y-20,50,90,8);} else {rect(x,y,50,70,8);}fill(0);textSize(14);textAlign(CENTER,CENTER);text(cardLabel(hand[i]),x+25,y+35);}}
function drawCurrentPlay(){if(currentPlay===null) return;textAlign(CENTER,CENTER);fill(255);textSize(16);text("Last Play by P"+currentPlay.player,canvasW/2,200);text(currentPlay.count+"x "+cardLabel({rank:currentPlay.rank,suit:""}),canvasW/2,230);}
function setup(){createCanvas(canvasW,canvasH);deal();frameRate(60);}
function draw(){drawTable();drawCurrentPlay();drawHand();if(currentPlayer!==humanIndex && !finished[currentPlayer]){aiMove(currentPlayer);advanceTurn();}if(winnerOrder.length===3){fill(255);textAlign(CENTER,CENTER);textSize(32);text("Winner: Player "+winnerOrder[0],canvasW/2,canvasH/2);} }
function mousePressed(){mousePressedHandler();}
