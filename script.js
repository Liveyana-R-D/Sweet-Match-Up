const cardGrid = document.getElementById("card-grid");
const moveCounter = document.getElementById("move-count");
const timerDisplay = document.getElementById("timer");
const newGameBtn = document.getElementById("new-game");
const congratsMsg = document.getElementById("congrats-message");
const finalScore = document.getElementById("final-score");
const scoreDisplay = document.getElementById("score");
const difficultySelect = document.getElementById("difficulty");

const flipSound = document.getElementById("flip-sound");
const matchSound = document.getElementById("match-sound");
const winSound = document.getElementById("win-sound");

let allEmojis = ["🍎", "🍌", "🍇", "🍓", "🍍", "🥝", "🍊", "🍒", "🍉", "🥥", "🍑", "🍋", "🍈", "🍅", "🍆", "🥑", "🥕", "🌽"];
let flippedCards = [];
let matchedCards = 0;
let moves = 0;
let timer;
let seconds = 0;
let totalPairs = 8;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function calculateScore() {
  return Math.max(1000 - moves * 5 - seconds, 0);
}

function resetGame() {
  const difficulty = difficultySelect.value;
  cardGrid.className = `grid ${difficulty}`;
  cardGrid.innerHTML = "";
  congratsMsg.classList.add("hidden");
  moves = 0;
  seconds = 0;
  matchedCards = 0;
  flippedCards = [];
  moveCounter.textContent = "0";
  scoreDisplay.textContent = "0";
  timerDisplay.textContent = "00:00";
  stopTimer();
  timer = null;

  if (difficulty === "easy") {
    totalPairs = 8;
  } else {
    totalPairs = 18;
  }

  renderCards();
}

function renderCards() {
  let images = shuffle(allEmojis).slice(0, totalPairs);
  let pairs = shuffle([...images, ...images]);

  pairs.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = emoji;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${emoji}</div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card));
    cardGrid.appendChild(card);
  });
}

function flipCard(card) {
  if (!timer) startTimer();
  if (flippedCards.length === 2 || card.classList.contains("flip")) return;

  flipSound.play();
  card.classList.add("flip");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    moveCounter.textContent = moves;

    const [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
      matchSound.play();
      matchedCards += 2;
      flippedCards = [];
      if (matchedCards === totalPairs * 2) {
        stopTimer();
        const score = calculateScore();
        finalScore.textContent = score;
        scoreDisplay.textContent = score;
        congratsMsg.classList.remove("hidden");
        winSound.play();
      }
    } else {
      setTimeout(() => {
        card1.classList.remove("flip");
        card2.classList.remove("flip");
        flippedCards = [];
      }, 1000);
    }
  }
}

newGameBtn.addEventListener("click", resetGame);
resetGame();
