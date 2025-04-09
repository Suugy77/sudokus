const sudokuGrid = document.getElementById('sudoku-grid');
const checkButton = document.getElementById('checkButton');
const newGameButton = document.getElementById('newGameButton');
const exitButton = document.getElementById('exitButton');
const toggleThemeButton = document.getElementById('toggleTheme');
const timerElement = document.getElementById('timer');
const clickSound = document.getElementById('clickSound');
const errorSound = document.getElementById('errorSound');

let startTime, timerInterval;

function generateRandomPuzzle() {
  
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

  
  function isValid(row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  
  function fillGrid(row = 0, col = 0) {
    if (row === 9) return true;
    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = (col + 1) % 9;

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    for (let num of numbers) {
      if (isValid(row, col, num)) {
        grid[row][col] = num;
        if (fillGrid(nextRow, nextCol)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }

  fillGrid();

 
  const puzzle = grid.map(row => row.slice());
  let cellsToRemove = Math.floor(Math.random() * 20) + 40;
  while (cellsToRemove > 0) {
    const i = Math.floor(Math.random() * 9);
    const j = Math.floor(Math.random() * 9);
    if (puzzle[i][j] !== 0) {
      puzzle[i][j] = 0;
      cellsToRemove--;
    }
  }

  return puzzle;
}

function renderGrid(grid) {
  sudokuGrid.innerHTML = '';
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.dataset.row = i;
      input.dataset.col = j;
      if (cell !== 0) {
        input.value = cell;
        input.disabled = true;
      }
      input.addEventListener('input', () => clickSound.play());
      sudokuGrid.appendChild(input);
    });
  });
}

function startNewGame() {
  const puzzle = generateRandomPuzzle();
  renderGrid(puzzle);
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    timerElement.textContent = `⏱️ ${minutes}:${seconds}`;
  }, 1000);
}

function checkSudoku() {
  errorSound.play();
  alert('This is a simple checker demo. Real checking not implemented.');
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

newGameButton.onclick = startNewGame;
checkButton.onclick = checkSudoku;
exitButton.onclick = () => window.close();
toggleThemeButton.onclick = toggleTheme;

startNewGame();
