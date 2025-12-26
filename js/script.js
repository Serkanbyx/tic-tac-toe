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
let aiDifficulty = "medium"; // "easy", "medium", "hard", "impossible"
const HUMAN = "X";
const AI = "O";

// Impossible mode cheat messages
const CHEAT_MESSAGES = [
    "Nice try! 🎭",
    "Did you really think that would work?",
    "Oops! My finger slipped...",
    "That spot is mine now!",
    "Rules? What rules?",
    "I'm the AI, I make the rules!",
    "Haha! Better luck next time!",
    "Your move has been... relocated.",
    "Surprise! 🎉",
    "Trust no one, especially AI!",
];

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
    
    // Impossible mode: AI cheats!
    if (gameMode === "ai" && aiDifficulty === "impossible") {
        handleImpossibleMove(cellIndex);
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
        case "impossible":
            moveIndex = getImpossibleMove();
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

// ==========================================
// IMPOSSIBLE MODE - CHEATING AI 😈
// ==========================================

/**
 * Handles player move in Impossible mode
 * AI will cheat by relocating player's move if needed
 */
function handleImpossibleMove(cellIndex) {
    // First, make the player's move normally
    makeMove(cellIndex, HUMAN);
    
    // Check if player would be in a winning position
    const shouldCheat = shouldAICheat(cellIndex);
    
    if (shouldCheat) {
        // AI cheats! Relocate the player's move
        statusText.classList.add('thinking', 'evil');
        
        setTimeout(() => {
            relocatePlayerMove(cellIndex);
            statusText.classList.remove('thinking', 'evil');
            
            // Check game state after cheating
            if (checkGameEnd()) return;
            
            // Now AI makes its move
            setTimeout(() => {
                statusText.classList.add('thinking', 'evil');
                setTimeout(() => {
                    makeAIMove();
                    statusText.classList.remove('thinking', 'evil');
                }, 300);
            }, 200);
        }, 500);
    } else {
        // No need to cheat this time, just make AI move
        if (checkGameEnd()) return;
        
        statusText.classList.add('thinking', 'evil');
        setTimeout(() => {
            makeAIMove();
            statusText.classList.remove('thinking', 'evil');
        }, 400);
    }
}

/**
 * Determines if AI should cheat based on player's move
 */
function shouldAICheat(playerMoveIndex) {
    // Count how many X's are on the board
    const xCount = board.filter(cell => cell === HUMAN).length;
    
    // Always cheat on first few moves to establish dominance
    if (xCount <= 2 && Math.random() < 0.6) return true;
    
    // Check if player is about to win
    if (isPlayerAboutToWin()) return true;
    
    // Check if player took a strategic position (center or corners)
    const strategicPositions = [0, 2, 4, 6, 8];
    if (strategicPositions.includes(playerMoveIndex) && Math.random() < 0.7) return true;
    
    // Random chance to cheat just for fun
    if (Math.random() < 0.4) return true;
    
    return false;
}

/**
 * Checks if player is about to win (has 2 in a row)
 */
function isPlayerAboutToWin() {
    for (const condition of WIN_CONDITIONS) {
        const [a, b, c] = condition;
        const values = [board[a], board[b], board[c]];
        const xCount = values.filter(v => v === HUMAN).length;
        const emptyCount = values.filter(v => v === "").length;
        
        if (xCount === 2 && emptyCount === 1) return true;
    }
    return false;
}

/**
 * Relocates the player's last move to a worse position
 */
function relocatePlayerMove(originalIndex) {
    // Remove the player's move
    const originalCell = cells[originalIndex];
    originalCell.classList.add('stolen');
    
    // Find the worst position for the player
    const newIndex = findWorstPosition(originalIndex);
    
    // Show cheat message
    showCheatMessage();
    
    // Clear original cell
    setTimeout(() => {
        board[originalIndex] = "";
        originalCell.textContent = "";
        originalCell.classList.remove('x', 'stolen');
        
        // Place in new position
        if (newIndex !== -1) {
            makeMove(newIndex, HUMAN);
            cells[newIndex].classList.add('stolen');
            setTimeout(() => cells[newIndex].classList.remove('stolen'), 600);
        }
    }, 300);
}

/**
 * Finds the worst position for the player's move
 */
function findWorstPosition(avoidIndex) {
    const availableMoves = getAvailableMoves(board).filter(i => i !== avoidIndex);
    
    if (availableMoves.length === 0) return -1;
    
    // Evaluate each position - find the one that helps player least
    let worstScore = Infinity;
    let worstMove = availableMoves[0];
    
    for (const move of availableMoves) {
        // Temporarily place X there
        board[move] = HUMAN;
        
        // Count how many winning lines this position contributes to
        let score = 0;
        for (const condition of WIN_CONDITIONS) {
            if (condition.includes(move)) {
                const [a, b, c] = condition;
                const values = [board[a], board[b], board[c]];
                // If no O in this line, it's valuable for X
                if (!values.includes(AI)) {
                    score += values.filter(v => v === HUMAN).length;
                }
            }
        }
        
        board[move] = "";
        
        // We want the lowest score (least helpful for player)
        if (score < worstScore) {
            worstScore = score;
            worstMove = move;
        }
    }
    
    return worstMove;
}

/**
 * Shows a random cheat message popup
 */
function showCheatMessage() {
    // Remove any existing message
    const existingMsg = document.querySelector('.cheat-message');
    if (existingMsg) existingMsg.remove();
    
    // Create and show new message
    const message = document.createElement('div');
    message.className = 'cheat-message';
    message.textContent = CHEAT_MESSAGES[Math.floor(Math.random() * CHEAT_MESSAGES.length)];
    document.body.appendChild(message);
    
    // Remove after animation
    setTimeout(() => message.remove(), 1500);
}

/**
 * Impossible AI: Uses best move but also ensures victory
 */
function getImpossibleMove() {
    // First check if AI can win immediately
    for (const condition of WIN_CONDITIONS) {
        const [a, b, c] = condition;
        const values = [board[a], board[b], board[c]];
        const oCount = values.filter(v => v === AI).length;
        const emptyCount = values.filter(v => v === "").length;
        
        if (oCount === 2 && emptyCount === 1) {
            // Win!
            const emptyIndex = condition.find(i => board[i] === "");
            return emptyIndex;
        }
    }
    
    // Otherwise use best move
    return getBestMove();
}
