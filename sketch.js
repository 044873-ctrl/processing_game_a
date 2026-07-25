let wordList=['apple','elephant','tiger','rabbit','table','eagle','giraffe','engine','north','hammer','rose','ear','rat','tap','pan','nose','egg','goat','ant','top','pen','note','earring','guitar','ring','gold','dog','gift','fan','nest','tree','earl','lion','nut','umbrella','ox','xylophone','opera','actor','robot','train','night','hat','toy','yacht'];
let currentWord='';
let history=[];
let inputBuffer='';
let message='';
let gameOver=false;
let maxHistory=100;
let vowels=['a','i','u','e','o'];
function resetGame(){let idx=Math.floor(Math.random()*wordList.length);currentWord=wordList[idx].toLowerCase();history=[currentWord];inputBuffer='';message='';gameOver=false;}
function submitWord(){let w=inputBuffer.trim().toLowerCase();if(!(typeof w==='string')){inputBuffer='';message='error';return;}if(w.length===0){inputBuffer='';message='input empty';return;}if(!/^[a-z]+$/.test(w)){inputBuffer='';message='letters only';return;}let last=currentWord.charAt(currentWord.length-1);if(w.charAt(0)!==last){inputBuffer='';message='must start with '+last;return;}if(history.indexOf(w)!==-1){inputBuffer='';message='already used';return;}history.push(w);if(history.length>maxHistory){history.shift();}currentWord=w;inputBuffer='';let lastChar=currentWord.charAt(currentWord.length-1);if(vowels.indexOf(lastChar)!==-1){gameOver=true;message='game over';}else{message='accepted';}}
function setup(){createCanvas(800,400);textFont('monospace',16);resetGame();}
function draw(){background(30);fill(255);textSize(18);textAlign(LEFT,TOP);text('Current: '+currentWord,20,20);text('Input: '+inputBuffer+((frameCount%60<30&& !gameOver)?'|':''),20,50);text('Message: '+message,20,80);text('History (recent):',20,110);let displayLines=10;for(let i=0;i<displayLines;i++){let idx=history.length-1-i;if(idx>=0){text((i+1)+'. '+history[idx],20,140+i*20);}}if(gameOver){textSize(22);fill(255,100,100);text('GAME OVER - last letter was vowel. Press Enter to restart.',20,340);}}
function keyTyped(){if(!gameOver){if(key.length===1&&/[a-zA-Z]/.test(key)){inputBuffer+=key.toLowerCase();}}return false;}
function keyPressed(){if(!gameOver){if(keyCode===BACKSPACE){if(inputBuffer.length>0){inputBuffer=inputBuffer.substring(0,inputBuffer.length-1);}}else if(keyCode===ENTER||keyCode===RETURN){submitWord();}}else{if(keyCode===ENTER||keyCode===RETURN){resetGame();}}return false;}
