const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let scores = {
    X: 0,
    O: 0
};

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    restartBtn.addEventListener('click', restartGame);
    statusText.textContent = `Turn: ${currentPlayer}`;
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute("data-index");

    if (options[cellIndex] !== "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
    
    // Add class for styling
    cell.classList.add(currentPlayer.toLowerCase());
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `Turn: ${currentPlayer}`;
}

function checkWinner() {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === "" || cellB === "" || cellC === "") {
            continue;
        }

        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            winningCells = condition;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} Wins!`;
        running = false;
        highlightWinningCells(winningCells);
        updateScore(currentPlayer);
    } else if (!options.includes("")) {
        statusText.textContent = `Draw!`;
        running = false;
    } else {
        changePlayer();
    }
}

function highlightWinningCells(indices) {
    indices.forEach(index => {
        cells[index].classList.add('win');
    });
}

function updateScore(winner) {
    scores[winner]++;
    if (winner === "X") {
        scoreXEl.textContent = scores.X;
    } else {
        scoreOEl.textContent = scores.O;
    }
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `Turn: ${currentPlayer}`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o', 'win');
    });
    running = true;
}
