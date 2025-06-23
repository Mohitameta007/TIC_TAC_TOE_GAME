// ✅ OPEN & CLOSE MODALS
function openModal() {
  document.getElementById('aboutModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('aboutModal').style.display = 'none';
}

function openHowToPlay() {
  document.getElementById('howToModal').style.display = 'flex';
}

function closeHowToPlay() {
  document.getElementById('howToModal').style.display = 'none';
}

function showThemeMessage() {
  document.getElementById("themeModal").style.display = "flex";
}

function closeThemeModal() {
  document.getElementById("themeModal").style.display = "none";
}

// ✅ MULTIPLAYER GAME LOGIC (X vs O)
const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('statusText');
const winLine = document.getElementById('winLine');
const restartButton = document.getElementById('restartButton');

let isXTurn = true;
let gameActive = true;

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const winLinePositions = {
  "0,1,2": { top: "16%", left: "0%", width: "100%", height: "4px", rotate: "0deg" },
  "3,4,5": { top: "49.8%", left: "0%", width: "100%", height: "4px", rotate: "0deg" },
  "6,7,8": { top: "80%", left: "0%", width: "100%", height: "4px", rotate: "0deg" },

  "0,3,6": { top: "0%", left: "16.6%", width: "4px", height: "100%", rotate: "0deg" },
  "1,4,7": { top: "0%", left: "49.8%", width: "4px", height: "100%", rotate: "0deg" },
  "2,5,8": { top: "0%", left: "83%", width: "4px", height: "100%", rotate: "0deg" },

  "0,4,8": { top: "5%", left: "0%", width: "141%", height: "4px", rotate: "45deg" },
  "2,4,6": { top: "90%", left: "0%", width: "141%", height: "4px", rotate: "-45deg" }
};

// ✅ Start Game
startGame();

function startGame() {
  isXTurn = true;
  gameActive = true;
  statusText.textContent = "X's Turn";
  winLine.style.opacity = "0";

  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
    cell.addEventListener('click', handleMove, { once: true });
  });
}

// ✅ Handle Player Move
function handleMove(e) {
  if (!gameActive) return;

  const cell = e.target;
  const symbol = isXTurn ? 'X' : 'O';

  cell.textContent = symbol;
  cell.classList.add('taken');

  if (checkWin(symbol)) {
    statusText.textContent = `${symbol} Wins! 🎉`;
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusText.textContent = "🤝 It's a Draw!";
    gameActive = false;
    return;
  }

  isXTurn = !isXTurn;
  statusText.textContent = isXTurn ? "X's Turn" : "O's Turn";
}

// ✅ Check Win
function checkWin(sign) {
  for (let pattern of winPatterns) {
    if (pattern.every(index => cells[index].textContent === sign)) {
      showWinLine(pattern);
      return true;
    }
  }
  return false;
}

// ✅ Check Draw
function isDraw() {
  return [...cells].every(cell => cell.textContent !== '');
}

// ✅ Show Win Line
function showWinLine(pattern) {
  const key = pattern.join(',');
  const props = winLinePositions[key];
  if (!props) return;

  winLine.style.opacity = "1";
  winLine.style.top = props.top;
  winLine.style.left = props.left;
  winLine.style.width = props.width;
  winLine.style.height = props.height;
  winLine.style.transform = `rotate(${props.rotate})`;
}

// ✅ Restart Game
restartButton.addEventListener('click', startGame);
