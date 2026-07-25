var words=[];
var inputStr='';
var message='';
var gameOver=false;
var lastChar='';
var vowels={'a':true,'i':true,'u':true,'e':true,'o':true};
var maxWords=100;
var canvasW=800;
var canvasH=600;
var fontSize=20;
function setup(){createCanvas(canvasW,canvasH);textSize(fontSize);textAlign(LEFT,TOP);}
function draw(){background(30);fill(255);text('English Shiritori',20,20);text('Enter words using keyboard. Press Enter to submit. Backspace to delete.',20,50);text('Current input: '+inputStr,20,90);var sy=130;for(var i=0;i<words.length;i++){text((i+1)+'. '+words[i],20,sy);sy+=fontSize+6;}if(message!==''){fill(200,200,0);text(message,400,90);}if(gameOver){fill(255,0,0);text('Game Over - last letter is vowel '+lastChar+'. Press R to restart.',20,canvasH-60);}else{if(words.length>0){text('Last letter: '+lastChar,20,canvasH-60);}}if(words.length>maxWords){words.shift();}}
function keyPressed(){if(typeof key==='string'&&!gameOver){if(keyCode===BACKSPACE){if(inputStr.length>0){inputStr=inputStr.substring(0,inputStr.length-1);}}else if(keyCode===ENTER){var candidate=inputStr.trim().toLowerCase();if(candidate.length===0){message='Please enter a word.';}else if(!/^[a-z]+$/.test(candidate)){message='Only letters a-z allowed.';}else if(words.length>0&&candidate.charAt(0)!==lastChar){message='Word must start with '+lastChar+'.';}else if(words.indexOf(candidate)!==-1){message='Word already used.';}else{words.push(candidate);lastChar=candidate.charAt(candidate.length-1);inputStr='';message='Accepted '+candidate+'.';if(vowels[lastChar]){gameOver=true;}if(words.length>maxWords){words.shift();}}}else{if(key.length===1){var c=key.toLowerCase();if(/^[a-z]$/.test(c)&&inputStr.length<30){inputStr+=c;}}}}else if(typeof key==='string'&&gameOver){if(key.toLowerCase()==='r'){words=[];inputStr='';message='';gameOver=false;lastChar='';}}}
