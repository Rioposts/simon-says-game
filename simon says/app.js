let gameSeq=[];
let userSeq=[];

let btns= ["red", "blue", "green", "yellow"];

let started = false;
let level = 0;

let h2 = document.querySelector("h2");

document.addEventListener("keypress", function() {
if (started == false){
  console.log("GAME STARTED");
  started = true;

  levelUp();
}
});

function gameFlash(btn){
  btn.classList.add("flash");
  setTimeout(function(){
    btn.classList.remove("flash");
  }, 250);
}

function userFlash(btn){
  btn.classList.add("userFlash");
  setTimeout(function(){
    btn.classList.remove("userFlash");
  }, 250);

}

function levelUp(){
  userSeq = [];
  level++;
  h2.innerHTML = `Level ${level}`;

  let randIndex = Math.floor(Math.random() * 4);
  let randColor = btns[randIndex];
  let randBtn = document.querySelector(`.${randColor}`);
  gameSeq.push(randColor);
  console.log("gameSeq: ", gameSeq);  
  gameFlash(randBtn);
}

function checkAns(idx){
  
  if (userSeq[idx] == gameSeq[idx]){
    if(userSeq.length == gameSeq.length){
      setTimeout(levelUp, 1000);
    }
   }
      else{
      h2.innerHTML = `Game Over! Your score was ${level}. <br> Press Any Key to Restart`;
      document.querySelector("body").style.backgroundColor = "red";
      setTimeout(function(){
        document.querySelector("body").style.backgroundColor = "white";
      }, 250);  
     
      reset();
    }

}
function btnPress(){
  console.log("btn pressed");
  let btn = this;
  userFlash(btn);

  userColor = btn.getAttribute("id");
  userSeq.push(userColor);

  checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for(btn of allBtns){
  btn.addEventListener("click", btnPress);

}

function reset(){
  gameSeq = [];
  userSeq = [];
  level = 0;
  started = false;
  console.log("Game Reset");
}