// ===== DADOS DO JOGO (12 pares - 24 cartas) =====
const pairs = [
  { id: 1, emoji: "⚫", text: "Ponto" },
  { id: 2, emoji: "📏", text: "Linha" },
  { id: 3, emoji: "🔺", text: "Forma" },
  { id: 4, emoji: "🔴🟡🔵", text: "Cores Primárias" },
  { id: 5, emoji: "✂️", text: "Colagem" },
  { id: 6, emoji: "🗿", text: "Escultura" },
  { id: 7, emoji: "🖼️", text: "Arte Rupestre" },
  { id: 8, emoji: "🪶", text: "Arte Indígena" },
  { id: 9, emoji: "🎵", text: "Ritmo" },
  { id: 10, emoji: "🥁", text: "Percussão" },
  { id: 11, emoji: "💃", text: "Dança" },
  { id: 12, emoji: "🎭", text: "Personagem" }
];

// ===== VARIÁVEIS DO JOGO =====
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;
let startTime = null;

// ===== ELEMENTOS DO DOM =====
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const winScreen = document.getElementById("win-screen");
const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const movesEl = document.getElementById("moves");
const finalMovesEl = document.getElementById("final-moves");
const finalTimeEl = document.getElementById("final-time");

// ===== BOTÕES =====
document.getElementById("btn-start").addEventListener("click", startGame);
document.getElementById("btn-restart").addEventListener("click", startGame);
document.getElementById("btn-play-again").addEventListener("click", startGame);

// ===== FUNÇÕES PRINCIPAIS =====
function startGame() {
  // Reset
  matchedPairs = 0;
  moves = 0;
  flippedCards = [];
  lockBoard = false;
  startTime = Date.now();

  // Atualiza interface
  scoreEl.textContent = "0";
  movesEl.textContent = "0";

  // Troca de tela
  showScreen("game-screen");

  // Cria as cartas
  createBoard();
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function createBoard() {
  board.innerHTML = "";

  // Duplica os pares e embaralha
  cards = [...pairs, ...pairs]
    .map(card => ({ ...card, uniqueId: Math.random() }))
    .sort(() => Math.random() - 0.5);

  cards.forEach((card, index) => {
    const cardEl = document.createElement("div");
    cardEl.classList.add("card");
    cardEl.dataset.id = card.id;
    cardEl.dataset.index = index;

    cardEl.innerHTML = `
      <div class="card-face card-back"></div>
      <div class="card-face card-front">
        <span class="card-emoji">${card.emoji}</span>
        <span class="card-text">${card.text}</span>
      </div>
    `;

    cardEl.addEventListener("click", flipCard);
    board.appendChild(cardEl);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this.classList.contains("flipped") || this.classList.contains("matched")) return;

  this.classList.add("flipped");
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    moves++;
    movesEl.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.id === card2.dataset.id;

  if (isMatch) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedPairs++;
    scoreEl.textContent = matchedPairs;
    flippedCards = [];

    // Verifica vitória
    if (matchedPairs === pairs.length) {
      setTimeout(showWinScreen, 600);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
    }, 900);
  }
}

function showWinScreen() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  finalMovesEl.textContent = moves;
  finalTimeEl.textContent = elapsed + "s";
  showScreen("win-screen");
}
