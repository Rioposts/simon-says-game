
// Game state variables
let gameSeq = [];
let userSeq = [];
let btns = ["red", "blue", "green", "yellow"];
let started = false;
let level = 0;
let highScore = localStorage.getItem('simonHighScore') || 0;

// DOM elements
const statusText = document.getElementById("status");
const levelDisplay = document.getElementById("level");
const highScoreDisplay = document.getElementById("high-score");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const btnElements = document.querySelectorAll(".btn");

// Initialize high score
highScoreDisplay.textContent = highScore;

// Audio setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {
  red: { freq: 261.63, color: "#FF4136" },    // C4
  blue: { freq: 329.63, color: "#0074D9" },   // E4
  green: { freq: 392.00, color: "#2ECC40" },  // G4
  yellow: { freq: 523.25, color: "#FFDC00" }  // C5
};

function playSound(color) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = "sine";
  oscillator.frequency.value = sounds[color].freq;
  gainNode.gain.value = 0.1;
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Envelope to avoid clicks
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
}

// Game visual effects
function gameFlash(btn) {
  btn.classList.add("flash");
  playSound(btn.id);
  
  setTimeout(() => {
    btn.classList.remove("flash");
  }, 300);
}

function userFlash(btn) {
  btn.classList.add("userFlash");
  playSound(btn.id);
  
  setTimeout(() => {
    btn.classList.remove("userFlash");
  }, 300);
}

// Game logic functions
function startGame() {
  if (started) return;
  
  started = true;
  startBtn.disabled = true;
  statusText.textContent = "Watch the sequence...";
  
  // Slight delay before starting the first level
  setTimeout(levelUp, 1000);
}

function levelUp() {
  userSeq = [];
  level++;
  levelDisplay.textContent = level;
  statusText.textContent = `Level ${level}`;
  
  // Generate and add a new random color to the sequence
  const randColor = btns[Math.floor(Math.random() * 4)];
  gameSeq.push(randColor);
  
  // Play the sequence after a short delay
  setTimeout(playSequence, 1000);
}

function playSequence() {
  // Disable buttons during sequence playback
  disableButtons(true);
  statusText.textContent = "Watch carefully...";
  
  let i = 0;
  const interval = setInterval(() => {
    const color = gameSeq[i];
    const btn = document.getElementById(color);
    gameFlash(btn);
    
    i++;
    if (i >= gameSeq.length) {
      clearInterval(interval);
      setTimeout(() => {
        statusText.textContent = "Your turn!";
        disableButtons(false);
      }, 500);
    }
  }, 600);
}

function checkAnswer(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    // Correct so far
    if (userSeq.length === gameSeq.length) {
      // Completed the sequence successfully
      disableButtons(true);
      statusText.textContent = "Great job! Next level...";
      setTimeout(levelUp, 1000);
    }
  } else {
    // Wrong answer
    gameOver();
  }
}

function gameOver() {
  const body = document.querySelector("body");
  const btnContainer = document.querySelector(".btn-container");
  
  // Visual indication of game over
  btnContainer.classList.add("game-over");
  body.style.backgroundColor = "#ffebee";
  
  // Play "game over" sound
  const errorOsc = audioContext.createOscillator();
  const errorGain = audioContext.createGain();
  
  errorOsc.type = "sawtooth";
  errorOsc.frequency.value = 150;
  errorGain.gain.value = 0.15;
  
  errorOsc.connect(errorGain);
  errorGain.connect(audioContext.destination);
  
  errorOsc.start();
  errorOsc.stop(audioContext.currentTime + 0.6);
  
  // Update status and enable buttons
  statusText.textContent = `Game Over! Your score: ${level}`;
  startBtn.disabled = false;
  startBtn.textContent = "Try Again";
  
  // Update high score if needed
  if (level > highScore) {
    highScore = level;
    highScoreDisplay.textContent = highScore;
    localStorage.setItem('simonHighScore', highScore);
    statusText.textContent += " - New High Score!";
  }
  
  // Reset game state
  setTimeout(() => {
    btnContainer.classList.remove("game-over");
    body.style.backgroundColor = "";
  }, 600);
  
  resetGame();
}

function resetGame() {
  gameSeq = [];
  userSeq = [];
  level = 0;
  started = false;
  levelDisplay.textContent = "0";
  disableButtons(false);
}

function handleButtonClick() {
  if (!started) return;
  
  const btn = this;
  userFlash(btn);
  
  const color = btn.id;
  userSeq.push(color);
  
  checkAnswer(userSeq.length - 1);
}

function disableButtons(disabled) {
  btnElements.forEach(btn => {
    if (disabled) {
      btn.style.pointerEvents = "none";
    } else {
      btn.style.pointerEvents = "auto";
    }
  });
}

// Event listeners
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", () => {
  resetGame();
  statusText.textContent = "Press Start to begin the game";
  startBtn.disabled = false;
  startBtn.textContent = "Start Game";
});

// Add event listeners to game buttons
btnElements.forEach(btn => {
  btn.addEventListener("click", handleButtonClick);
});

// Enable keyboard shortcuts
document.addEventListener("keydown", (event) => {
  if (event.key === "s" || event.key === "S") {
    startGame();
  } else if (event.key === "r" || event.key === "R") {
    resetGame();
    statusText.textContent = "Press Start to begin the game";
    startBtn.disabled = false;
    startBtn.textContent = "Start Game";
  }
});