// DOM Elements
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const modeButtons = document.querySelectorAll('.mode-btn');
const difficultySelector = document.getElementById('difficulty-selector');
const difficultyButtons = document.querySelectorAll('.diff-btn');

// Game State
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameRunning = false;
let scores = { X: 0, O: 0 };

// Game Settings
let gameMode = "pvp"; // "pvp" or "ai"
let aiDifficulty = "medium"; // "easy", "medium", "hard"
const HUMAN = "X";
const AI = "O";

// Win Conditions (rows, columns, diagonals)
const WIN_CONDITIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize the game
initializeGame();

/**
 * Sets up event listeners and initializes game state
 */
function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', restartGame);
    
    // Mode selection listeners
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => selectGameMode(btn.dataset.mode));
    });
    
    // Difficulty selection listeners
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => selectDifficulty(btn.dataset.difficulty));
    });
    
    updateStatus(`Turn: ${currentPlayer}`);
    isGameRunning = true;
}

/**
 * Handles game mode selection (PvP or AI)
 */
function selectGameMode(mode) {
    gameMode = mode;
    
    // Update UI
    modeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Show/hide difficulty selector
    difficultySelector.classList.toggle('hidden', mode !== 'ai');
    
    // Restart game with new mode
    restartGame();
}

/**
 * Handles AI difficulty selection
 */
function selectDifficulty(difficulty) {
    aiDifficulty = difficulty;
    
    // Update UI
    difficultyButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
    });
    
    // Restart game with new difficulty
    restartGame();
}

/**
 * Handles cell click events
 */
function handleCellClick() {
    const cellIndex = parseInt(this.getAttribute("data-index"));
    
    // Ignore if cell is taken or game is over
    if (board[cellIndex] !== "" || !isGameRunning) {
        return;
    }
    
    makeMove(cellIndex, currentPlayer);
    
    // Check for winner after human move
    if (checkGameEnd()) return;
    
    // If AI mode and it's AI's turn, make AI move
    if (gameMode === "ai" && currentPlayer === AI && isGameRunning) {
        // Small delay for better UX
        statusText.classList.add('thinking');
        setTimeout(() => {
            makeAIMove();
            statusText.classList.remove('thinking');
        }, 400);
    }
}

/**
 * Makes a move on the board
 */
function makeMove(index, player) {
    board[index] = player;
    const cell = cells[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
}

/**
 * Switches to the next player
 */
function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus(`Turn: ${currentPlayer}`);
}

/**
 * Updates the game status text
 */
function updateStatus(message) {
    statusText.textContent = message;
}

/**
 * Checks if the game has ended (win or draw)
 * @returns {boolean} True if game ended
 */
function checkGameEnd() {
    const result = checkWinner(board);
    
    if (result.winner) {
        updateStatus(`${result.winner} Wins!`);
        isGameRunning = false;
        highlightWinningCells(result.winningCells);
        updateScore(result.winner);
        return true;
    }
    
    if (getAvailableMoves(board).length === 0) {
        updateStatus("Draw!");
        isGameRunning = false;
        return true;
    }
    
    switchPlayer();
    return false;
}

/**
 * Checks for a winner on the given board
 * @returns {Object} Winner info or null
 */
function checkWinner(boardState) {
    for (const condition of WIN_CONDITIONS) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return { winner: boardState[a], winningCells: condition };
        }
    }
    return { winner: null, winningCells: [] };
}

/**
 * Gets available moves on the board
 */
function getAvailableMoves(boardState) {
    return boardState.reduce((moves, cell, index) => {
        if (cell === "") moves.push(index);
        return moves;
    }, []);
}

/**
 * Highlights the winning cells with animation
 */
function highlightWinningCells(indices) {
    indices.forEach(index => {
        cells[index].classList.add('win');
    });
}

/**
 * Updates the score for the winner
 */
function updateScore(winner) {
    scores[winner]++;
    if (winner === "X") {
        scoreXEl.textContent = scores.X;
    } else {
        scoreOEl.textContent = scores.O;
    }
}

/**
 * Restarts the game
 */
function restartGame() {
    currentPlayer = "X";
    board = ["", "", "", "", "", "", "", "", ""];
    updateStatus(`Turn: ${currentPlayer}`);
    
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o', 'win');
    });
    
    isGameRunning = true;
}

// ==========================================
// AI LOGIC - MINIMAX ALGORITHM
// ==========================================

/**
 * Makes the AI move based on difficulty
 */
function makeAIMove() {
    if (!isGameRunning) return;
    
    let moveIndex;
    
    switch (aiDifficulty) {
        case "easy":
            moveIndex = getEasyMove();
            break;
        case "medium":
            moveIndex = getMediumMove();
            break;
        case "hard":
            moveIndex = getBestMove();
            break;
        default:
            moveIndex = getBestMove();
    }
    
    if (moveIndex !== -1) {
        makeMove(moveIndex, AI);
        checkGameEnd();
    }
}

/**
 * Easy AI: Random valid move
 */
function getEasyMove() {
    const availableMoves = getAvailableMoves(board);
    if (availableMoves.length === 0) return -1;
    
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
}

/**
 * Medium AI: 70% best move, 30% random
 */
function getMediumMove() {
    if (Math.random() < 0.7) {
        return getBestMove();
    }
    return getEasyMove();
}

/**
 * Hard AI: Always best move using Minimax
 */
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;
    
    const availableMoves = getAvailableMoves(board);
    
    for (const move of availableMoves) {
        // Make the move
        board[move] = AI;
        
        // Calculate score using minimax
        const score = minimax(board, 0, false, -Infinity, Infinity);
        
        // Undo the move
        board[move] = "";
        
        // Update best move
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    
    return bestMove;
}

/**
 * Minimax algorithm with alpha-beta pruning
 * @param {Array} boardState - Current board state
 * @param {number} depth - Current depth in the game tree
 * @param {boolean} isMaximizing - Is it AI's turn (maximizing)?
 * @param {number} alpha - Alpha value for pruning
 * @param {number} beta - Beta value for pruning
 * @returns {number} Best score for this position
 */
function minimax(boardState, depth, isMaximizing, alpha, beta) {
    const result = checkWinner(boardState);
    
    // Terminal states
    if (result.winner === AI) return 10 - depth;    // AI wins (prefer faster wins)
    if (result.winner === HUMAN) return depth - 10; // Human wins (prefer slower losses)
    if (getAvailableMoves(boardState).length === 0) return 0; // Draw
    
    if (isMaximizing) {
        // AI's turn - maximize score
        let maxScore = -Infinity;
        
        for (const move of getAvailableMoves(boardState)) {
            boardState[move] = AI;
            const score = minimax(boardState, depth + 1, false, alpha, beta);
            boardState[move] = "";
            
            maxScore = Math.max(score, maxScore);
            alpha = Math.max(alpha, score);
            
            // Alpha-beta pruning
            if (beta <= alpha) break;
        }
        
        return maxScore;
    } else {
        // Human's turn - minimize score
        let minScore = Infinity;
        
        for (const move of getAvailableMoves(boardState)) {
            boardState[move] = HUMAN;
            const score = minimax(boardState, depth + 1, true, alpha, beta);
            boardState[move] = "";
            
            minScore = Math.min(score, minScore);
            beta = Math.min(beta, score);
            
            // Alpha-beta pruning
            if (beta <= alpha) break;
        }
        
        return minScore;
    }
}
