// ✅ GAME LOGIC FOR SINGLE PLAYER MODE
let playerSign = '';
let computerSign = '';

const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('statusText');
const winLine = document.getElementById('winLine');
const restartButton = document.getElementById('restartButton');
const chooseSignModal = document.getElementById('chooseSignModal');

// All winning combinations in tic tac toe\const winPatterns = [
// All winning combinations in tic tac toe
const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// Win line style positions for each win combination
const winLinePositions = {
  "0,1,2": { top: "16%", left: "0%", width: "100%", height: "4px", rotate: "0deg" },
  "3,4,5": { top: "49.8%", left: "0%", width: "100%", height: "4px", rotate: "0deg" },
  "6,7,8": { top: "83%", left: "0%", width: "100%", height: "4px", rotate: "0deg" },

  "0,3,6": { top: "0%", left: "16.6%", width: "4px", height: "100%", rotate: "0deg" },
  "1,4,7": { top: "0%", left: "49.8%", width: "4px", height: "100%", rotate: "0deg" },
  "2,5,8": { top: "0%", left: "83%", width: "4px", height: "100%", rotate: "0deg" },

  "0,4,8": { top: "5%", left: "0%", width: "141%", height: "4px", rotate: "45deg" },
  "2,4,6": { top: "90%", left: "0%", width: "141%", height: "4px", rotate: "-45deg" }
};

// Show sign selection modal on load
window.addEventListener('DOMContentLoaded', () => {
  chooseSignModal.style.display = 'flex';
});

// User selects sign (X or O)
function selectSign(sign) {
  playerSign = sign;
  computerSign = (sign === 'X') ? 'O' : 'X';
  chooseSignModal.style.display = 'none';
  statusText.textContent = "Player's Turn";
  startGame();
}

// Start the game
function startGame() {
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
    cell.addEventListener('click', handlePlayerMove, { once: true });
  });
  winLine.style.opacity = '0';
}

// Player makes a move
function handlePlayerMove(e) {
  const cell = e.target;
  if (cell.textContent !== '') return;

  cell.textContent = playerSign;
  cell.classList.add('taken');

  if (checkWin(playerSign)) {
    statusText.textContent = "🎉 You Win!";
    endGame();
    return;
  }

  if (isDraw()) {
    statusText.textContent = "🤝 It's a Draw!";
    endGame();
    return;
  }

  statusText.textContent = "Computer's Turn";
  setTimeout(computerMove, 500); // Delay for computer move
}

// Computer AI logic
function computerMove() {
  // 1. Try to win if possible
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    const values = [cells[a].textContent, cells[b].textContent, cells[c].textContent];
    if (values.filter(v => v === computerSign).length === 2 && values.includes('')) {
      const emptyIndex = pattern[values.indexOf('')];
      markCell(emptyIndex, computerSign);
      return;
    }
  }

  // 2. Block player from winning
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    const values = [cells[a].textContent, cells[b].textContent, cells[c].textContent];
    if (values.filter(v => v === playerSign).length === 2 && values.includes('')) {
      const emptyIndex = pattern[values.indexOf('')];
      markCell(emptyIndex, computerSign);
      return;
    }
  }

  // 3. Random move
  const emptyCells = Array.from(cells).filter(cell => cell.textContent === '');
  if (emptyCells.length === 0) return;
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const randomIndex = [...cells].indexOf(randomCell);
  markCell(randomIndex, computerSign);
}

// Mark a cell and check game status
function markCell(index, sign) {
  const cell = cells[index];
  cell.textContent = sign;
  cell.classList.add('taken');

  if (checkWin(sign)) {
    statusText.textContent = sign === playerSign ? "🎉 You Win!" : "💻 Computer Wins!";
    endGame();
    return;
  }

  if (isDraw()) {
    statusText.textContent = "🤝 It's a Draw!";
    endGame();
    return;
  }

  statusText.textContent = sign === playerSign ? "Computer's Turn" : "Player's Turn";
}

// Check for winning pattern
function checkWin(sign) {
  for (let pattern of winPatterns) {
    if (pattern.every(index => cells[index].textContent === sign)) {
      showWinLine(pattern);
      return true;
    }
  }
  return false;
}

// Check if all cells are filled
function isDraw() {
  return [...cells].every(cell => cell.textContent !== '');
}

// Display the win line using fixed style map
function showWinLine(pattern) {
  const key = pattern.join(',');
  const props = winLinePositions[key];
  if (!props) return;

  winLine.style.opacity = "1";
  winLine.style.top = props.top || "0";
  winLine.style.left = props.left || "0";
  winLine.style.width = props.width || "4px";
  winLine.style.height = props.height || "4px";
  winLine.style.transform = `rotate(${props.rotate})`;
}

// Stop the game by removing event listeners
function endGame() {
  cells.forEach(cell => cell.removeEventListener('click', handlePlayerMove));
}

// Restart button resets game
restartButton.addEventListener('click', () => {
  startGame();
  chooseSignModal.style.display = 'flex';
  statusText.textContent = '';
});
