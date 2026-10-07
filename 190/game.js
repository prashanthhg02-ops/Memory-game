const symbols = ["🍋", "🌼", "🍓", "🍄", "🦋", "🍊", "🌿", "🐝"];
const board = document.querySelector("#board");
const movesDisplay = document.querySelector("#moves");
const timerDisplay = document.querySelector("#timer");
const message = document.querySelector("#message");
const restartButton = document.querySelector("#restart");

let firstCard = null;
let secondCard = null;
let locked = false;
let moves = 0;
let matchedPairs = 0;
let elapsedSeconds = 0;
let timerInterval = null;
let mismatchTimeout = null;
let gameStarted = false;

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function startTimer() {
  if (gameStarted) return;

  gameStarted = true;
  timerInterval = window.setInterval(() => {
    elapsedSeconds += 1;
    timerDisplay.textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function finishGame() {
  window.clearInterval(timerInterval);
  message.textContent = `Lovely work! ${moves} moves in ${formatTime(elapsedSeconds)} ✨`;
}

function handleCardClick(event) {
  const card = event.currentTarget;
  if (locked || card === firstCard || card.classList.contains("is-matched")) return;

  startTimer();
  card.classList.add("is-face-up");
  card.setAttribute("aria-label", `Revealed ${card.dataset.symbol}`);

  if (!firstCard) {
    firstCard = card;
    message.textContent = "Now find its matching pair…";
    return;
  }

  secondCard = card;
  locked = true;
  moves += 1;
  movesDisplay.textContent = moves.toString().padStart(2, "0");

  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("is-matched");
    secondCard.classList.add("is-matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs += 1;
    resetTurn();

    if (matchedPairs === symbols.length) {
      finishGame();
    } else {
      message.textContent = "A match! Nice one 🌱";
    }
    return;
  }

  message.textContent = "Not quite — try another pair.";
  mismatchTimeout = window.setTimeout(() => {
    firstCard.classList.remove("is-face-up");
    secondCard.classList.remove("is-face-up");
    firstCard.setAttribute("aria-label", "Face-down memory card");
    secondCard.setAttribute("aria-label", "Face-down memory card");
    mismatchTimeout = null;
    resetTurn();
  }, 850);
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  locked = false;
}

function createCard(symbol) {
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";
  card.dataset.symbol = symbol;
  card.setAttribute("aria-label", "Face-down memory card");
  card.innerHTML = `
    <span class="card-inner">
      <span class="card-face" aria-hidden="true">${symbol}</span>
    </span>
  `;
  card.addEventListener("click", handleCardClick);
  return card;
}

function newGame() {
  window.clearInterval(timerInterval);
  window.clearTimeout(mismatchTimeout);
  mismatchTimeout = null;
  firstCard = null;
  secondCard = null;
  locked = false;
  moves = 0;
  matchedPairs = 0;
  elapsedSeconds = 0;
  gameStarted = false;
  movesDisplay.textContent = "00";
  timerDisplay.textContent = "00:00";
  message.textContent = "Your first card is waiting ✨";

  const cards = shuffle([...symbols, ...symbols]);
  board.replaceChildren(...cards.map(createCard));
}

restartButton.addEventListener("click", newGame);
newGame();
